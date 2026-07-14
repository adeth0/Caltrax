"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
}

const MotionOverlay = motion.create(DialogPrimitive.Overlay);

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-screen-on-mobile, centered-on-desktop modal — used for the scanner
 * and camera-capture flows. Uses Radix's forceMount + framer-motion's
 * AnimatePresence so the glass panel gets a real exit animation (condensing
 * out) instead of Radix's default instant unmount.
 *
 * DialogPrimitive.Content stays a plain (non-motion) element carrying the
 * responsive centering transform (translate-x/y-1/2 on desktop) — animating
 * that directly with framer-motion would clobber the centering transform,
 * since both write to the same CSS `transform` property. The actual motion
 * lives on a nested motion.div instead, which composes fine as a separate
 * transform layer.
 */
export function Modal({ open, onOpenChange, title, description, children }: ModalProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <MotionOverlay
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE }}
            />
            <DialogPrimitive.Content
              forceMount
              className="fixed inset-x-0 bottom-0 z-50 sm:inset-x-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 sm:-translate-y-1/2"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <motion.div
                className="glass-panel flex max-h-[92vh] flex-col p-4 sm:p-6"
                initial={{ opacity: 0, scale: 0.96, y: 24 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: 12 }}
                transition={{ duration: 0.28, ease: EASE }}
              >
                <div className="mb-3 flex items-start justify-between gap-4">
                  <div>
                    <DialogPrimitive.Title className="font-display text-lg font-semibold text-text-primary">
                      {title}
                    </DialogPrimitive.Title>
                    {description && (
                      <DialogPrimitive.Description className="mt-0.5 text-sm text-text-tertiary">
                        {description}
                      </DialogPrimitive.Description>
                    )}
                  </div>
                  <DialogPrimitive.Close className="touch-target focus-ring control -mr-2 -mt-1 flex shrink-0 items-center justify-center text-text-tertiary hover:text-text-primary">
                    <X className="h-5 w-5" />
                  </DialogPrimitive.Close>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
