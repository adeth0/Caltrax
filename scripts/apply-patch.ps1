<#
.SYNOPSIS
  Applies a Caltrax patch file end-to-end: cleans up any stuck git state,
  stashes local work-in-progress, creates a fresh branch off the latest
  main, applies the patch, restores your stashed work, and pushes.

.USAGE
  From the repo root (C:\Projects\Caltrax):
    .\scripts\apply-patch.ps1 -PatchPath "C:\Path\To\some-patch.patch"

  Optionally name the branch (default: auto-generated from date/time):
    .\scripts\apply-patch.ps1 -PatchPath "C:\Path\To\some-patch.patch" -BranchName "feature/payments"

.WHAT IT HANDLES AUTOMATICALLY
  - Aborts any leftover ".git/rebase-apply" state from a previous failed attempt
  - Stashes uncommitted local changes so "dirty index" never blocks the patch
  - Always branches off the latest origin/main (fetches first)
  - Restores your stash afterwards, even if the patch fails
  - Prints the PR link at the end
#>

param(
  [Parameter(Mandatory = $true)]
  [string]$PatchPath,

  [string]$BranchName = "patch/$(Get-Date -Format 'yyyyMMdd-HHmmss')"
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

Write-Host "== Fetching latest main ==" -ForegroundColor Cyan
git fetch origin main
if ($LASTEXITCODE -ne 0) { Fail "git fetch failed. Check your network/GitHub access." }

Write-Host "== Creating branch '$BranchName' from origin/main ==" -ForegroundColor Cyan
git checkout -b $BranchName origin/main
if ($LASTEXITCODE -ne 0) { Fail "Could not create branch $BranchName. Does it already exist? Try -BranchName with a different value." }

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
  Fail "Patch failed to apply — it may not match the current state of main. Ask Claude to regenerate it against the latest main."
}

if ($stashed) {
  Write-Host "== Restoring your stashed local changes ==" -ForegroundColor Cyan
  git stash pop
  if ($LASTEXITCODE -ne 0) {
    Write-Host "Note: your stash didn't reapply cleanly (likely overlaps with the patch)." -ForegroundColor Yellow
    Write-Host "Your changes are still safe in the stash — run 'git stash list' then 'git stash pop' manually once you've resolved it." -ForegroundColor Yellow
  }
}

Write-Host "== Pushing branch ==" -ForegroundColor Cyan
git push -u origin $BranchName
if ($LASTEXITCODE -ne 0) { Fail "Push failed. Check your GitHub auth (git credential manager / SSH key)." }

Write-Host "`n[DONE]" -ForegroundColor Green
Write-Host "Branch '$BranchName' is pushed. Open a PR here:"
Write-Host "https://github.com/adeth0/Caltrax/pull/new/$BranchName" -ForegroundColor Cyan
