import Image from "next/image";

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-2 bg-brand px-4 py-3 text-brand-foreground md:hidden">
      <Image src="/icons/icon-192.png" alt="" width={26} height={26} className="rounded-md" />
      <span className="font-display text-lg font-bold">Caltrax</span>
    </header>
  );
}
