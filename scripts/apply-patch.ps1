<#
.SYNOPSIS
  Applies a Caltrax patch file end-to-end. Two modes:
    - Branch mode (default): creates/continues a feature branch and pushes
      it for a pull request -- CI runs as a gate before anything reaches main.
    - Direct mode (-Direct): applies straight onto main and pushes
      immediately (Vercel deploys on push to main). Since there's no PR
      checkpoint in this mode, the script runs lint/build/test locally
      FIRST and refuses to push if any of them fail, rolling main back to
      exactly where it started. This is the only safety net once you skip
      the PR -- it is not a substitute for reviewing what a patch actually
      does before running this.

.USAGE
  Branch mode (opens a PR, CI gates the merge):
    .\scripts\apply-patch.ps1 -PatchPath "C:\Path\To\some-patch.patch" -BranchName "feature/payments"

  Direct mode (pushes straight to main, deploys immediately if checks pass):
    .\scripts\apply-patch.ps1 -PatchPath "C:\Path\To\some-patch.patch" -Direct

.WHAT IT HANDLES AUTOMATICALLY
  - Aborts any leftover ".git/rebase-apply" state from a previous failed attempt
  - Stashes uncommitted local changes so "dirty index" never blocks the patch
  - Branch mode: if -BranchName already exists on origin (an earlier
    not-yet-merged patch), continues on that same branch instead of
    starting fresh -- use the SAME branch name across multiple patches that
    build on each other, and a NEW name for an unrelated feature.
    Otherwise branches fresh off the latest origin/main.
  - Direct mode: applies onto main, runs lint + build + test locally, and
    only pushes if all three pass. On any failure, main is reset back to
    exactly where it was before this run and nothing is pushed.
  - Restores your stash afterwards either way, even if the patch fails
  - Prints a PR link (branch mode) or confirms the live push (direct mode)
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$PatchPath,

  [string]$BranchName = "patch/$(Get-Date -Format 'yyyyMMdd-HHmmss')",

  [switch]$Direct
)

$ErrorActionPreference = "Stop"

function Fail($msg) {
  Write-Host "`n[FAILED] $msg" -ForegroundColor Red
  exit 1
}

if (-not (Test-Path $PatchPath)) {
  Fail "Patch file not found at: $PatchPath"
}

# Must be run from inside the repo.
$repoRoot = git rev-parse --show-toplevel 2>$null
if (-not $repoRoot) {
  Fail "Not inside a git repository. cd into C:\Projects\Caltrax first."
}
Set-Location $repoRoot

# Preflight: fail BEFORE touching main if a required tool is missing.
# A "command not found" error is a different kind of failure to git/npm/etc
# returning a normal non-zero exit code -- PowerShell throws a terminating
# exception for it instead, which (with $ErrorActionPreference = "Stop")
# can escape past a bare "if ($LASTEXITCODE -ne 0)" check entirely and crash
# the whole script before its own rollback logic ever runs. Checking here,
# before main is ever reset or a patch ever applied, means that specific
# failure mode can only ever happen at a point where nothing has changed yet.
if ($Direct) {
  foreach ($tool in @("npm", "node")) {
    $found = Get-Command $tool -ErrorAction SilentlyContinue
    if (-not $found) {
      Fail "'$tool' isn't available in this terminal (needed for -Direct mode's local lint/build/test check). Install Node.js from nodejs.org, then close ALL terminal/VS Code windows and reopen before retrying -- PATH changes don't apply to already-open sessions."
    }
  }
}

Write-Host "== Cleaning up any stuck git state ==" -ForegroundColor Cyan
if (Test-Path ".git\rebase-apply") {
  git am --abort 2>$null
  if (Test-Path ".git\rebase-apply") {
    Remove-Item -Recurse -Force ".git\rebase-apply"
  }
  Write-Host "Cleared a leftover rebase-apply state from a previous attempt."
}

Write-Host "== Checking for uncommitted local changes ==" -ForegroundColor Cyan
$dirty = git status --porcelain
$stashed = $false
if ($dirty) {
  Write-Host "Stashing local changes so the patch can apply cleanly..."
  git stash push -m "auto-stash before applying $($PatchPath | Split-Path -Leaf)" | Out-Null
  $stashed = $true
}

Write-Host "== Fetching latest from origin ==" -ForegroundColor Cyan
git fetch origin
if ($LASTEXITCODE -ne 0) { Fail "git fetch failed. Check your network/GitHub access." }

function RestoreStashIfAny {
  if ($script:stashed) {
    Write-Host "== Restoring your stashed local changes ==" -ForegroundColor Cyan
    git stash pop
    if ($LASTEXITCODE -ne 0) {
      Write-Host "Note: your stash didn't reapply cleanly. It's still safe -- run 'git stash list' then 'git stash pop' manually." -ForegroundColor Yellow
    }
  }
}

if ($Direct) {
  # --- DIRECT MODE: apply straight onto main, verify locally, push only if clean ---
  Write-Host "== [DIRECT MODE] Resetting local main to match origin/main ==" -ForegroundColor Cyan
  git checkout main
  if ($LASTEXITCODE -ne 0) { Fail "Could not check out main." }
  git reset --hard origin/main | Out-Null

  $originalMainCommit = git rev-parse HEAD

  Write-Host "== Applying patch onto main ==" -ForegroundColor Cyan
  git am $PatchPath
  if ($LASTEXITCODE -ne 0) {
    git am --abort 2>$null
    git reset --hard $originalMainCommit | Out-Null
    RestoreStashIfAny
    Fail "Patch failed to apply onto main -- it may not match main's current state. main was left untouched. Ask Claude to regenerate the patch."
  }

  # Checks run BEFORE the stash is restored, so they test exactly what's
  # about to be pushed -- no leftover uncommitted changes muddying the
  # result, same as what CI would see.
  Write-Host "== Running local checks before pushing (no PR to gate this, so this is the only safety net) ==" -ForegroundColor Cyan
  $checks = @(
    @{ Name = "lint"; Cmd = "npm run lint" },
    @{ Name = "format:check"; Cmd = "npm run format:check" },
    @{ Name = "test"; Cmd = "npm run test" },
    @{ Name = "build"; Cmd = "npm run build" }
  )

  if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules missing -- running npm install first..."
    try {
      npm install
      $installFailed = ($LASTEXITCODE -ne 0)
    } catch {
      Write-Host $_.Exception.Message -ForegroundColor Red
      $installFailed = $true
    }
    if ($installFailed) {
      git reset --hard $originalMainCommit | Out-Null
      RestoreStashIfAny
      Fail "npm install failed. main was rolled back and nothing was pushed."
    }
  }

  foreach ($check in $checks) {
    Write-Host "-- $($check.Name) --" -ForegroundColor DarkCyan
    $checkFailed = $false
    try {
      Invoke-Expression $check.Cmd
      $checkFailed = ($LASTEXITCODE -ne 0)
    } catch {
      Write-Host $_.Exception.Message -ForegroundColor Red
      $checkFailed = $true
    }
    if ($checkFailed) {
      Write-Host "`n'$($check.Name)' failed." -ForegroundColor Red
      git reset --hard $originalMainCommit | Out-Null
      RestoreStashIfAny
      Fail "'$($check.Name)' failed on the patched code. main was rolled back to its previous state -- nothing was pushed. Fix the issue (or ask Claude to) before retrying."
    }
  }

  Write-Host "== All checks passed. Pushing directly to main ==" -ForegroundColor Cyan
  git push origin main
  if ($LASTEXITCODE -ne 0) {
    RestoreStashIfAny
    Fail "All checks passed locally, but the push to origin/main failed (auth issue, or someone else pushed to main since you fetched -- run this script again after fetching). main is NOT rolled back since the commit is valid, just unpushed; you can retry the push manually with 'git push origin main'."
  }

  RestoreStashIfAny

  Write-Host "`n[DONE]" -ForegroundColor Green
  Write-Host "Pushed directly to main. Vercel will deploy this shortly -- check the Vercel dashboard to confirm."
} else {
  # --- BRANCH MODE: create/continue a feature branch, push it, PR + CI gate the merge ---
  git ls-remote --exit-code --heads origin $BranchName *> $null
  $remoteBranchExists = ($LASTEXITCODE -eq 0)

  if ($remoteBranchExists) {
    Write-Host "== Branch '$BranchName' already exists on origin -- continuing on it (stacking this patch on top) ==" -ForegroundColor Cyan
    git checkout $BranchName 2>$null
    if ($LASTEXITCODE -ne 0) {
      git checkout -b $BranchName "origin/$BranchName"
    } else {
      git reset --hard "origin/$BranchName" | Out-Null
    }
    if ($LASTEXITCODE -ne 0) { Fail "Could not check out existing branch origin/$BranchName." }
  } else {
    Write-Host "== Creating new branch '$BranchName' from origin/main ==" -ForegroundColor Cyan
    git checkout -b $BranchName origin/main
    if ($LASTEXITCODE -ne 0) { Fail "Could not create branch $BranchName." }
  }

  Write-Host "== Applying patch ==" -ForegroundColor Cyan
  git am $PatchPath
  if ($LASTEXITCODE -ne 0) {
    git am --abort 2>$null
    if ($stashed) {
      Write-Host "Restoring your stashed changes (patch apply failed, nothing else was touched)..."
      git checkout main | Out-Null
      git branch -D $BranchName | Out-Null
      git stash pop | Out-Null
    }
    Fail "Patch failed to apply -- it may not match the current state of main. Ask Claude to regenerate it against the latest main."
  }

  RestoreStashIfAny

  Write-Host "== Pushing branch ==" -ForegroundColor Cyan
  git push -u origin $BranchName
  if ($LASTEXITCODE -ne 0) { Fail "Push failed. Check your GitHub auth (git credential manager / SSH key)." }

  Write-Host "`n[DONE]" -ForegroundColor Green
  Write-Host "Branch '$BranchName' is pushed. Open a PR here:"
  Write-Host "https://github.com/adeth0/Caltrax/pull/new/$BranchName" -ForegroundColor Cyan
}
