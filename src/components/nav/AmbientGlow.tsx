/** Sits behind every page so glass panels have coloured light to catch. Fixed, non-interactive, z-indexed below content. */
export function AmbientGlow() {
  return (
    <div className="ambient-glow" aria-hidden>
      <span
        className="left-[-10%] top-[-10%] animate-ambient-drift bg-accent-info"
        style={{ animationDelay: "0s" }}
      />
      <span
        className="bottom-[-15%] right-[-10%] animate-ambient-drift bg-macro-fat"
        style={{ animationDelay: "-8s" }}
      />
      <span
        className="left-[30%] top-[40%] animate-ambient-drift bg-accent-success"
        style={{ animationDelay: "-16s" }}
      />
    </div>
  );
}
