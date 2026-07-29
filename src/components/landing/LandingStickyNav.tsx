"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function LandingStickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Roughly "past the hero" -- doesn't need to be exact, just past
      // the point where the full logo lockup has scrolled out of view.
      setVisible(window.scrollY > 420);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          initial={{ y: -64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -64, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="bg-base/80 fixed inset-x-0 top-0 z-50 border-b border-border backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <Image src="/icons/icon-192.png" alt="" width={28} height={28} className="rounded-md" />
              <span className="font-display text-base font-bold text-text-primary">Caltrax</span>
            </Link>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/signup">Get started</Link>
              </Button>
            </div>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  );
}
