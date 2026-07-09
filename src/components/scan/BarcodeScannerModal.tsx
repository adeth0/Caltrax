"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/Modal";

const ZXING_WASM_VERSION = "1.2.15"; // must match the zxing-wasm dependency in package.json

interface BarcodeScannerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDetected: (code: string) => void;
}

/**
 * Scans EAN/UPC barcodes via the device camera. The zxing-wasm binary is
 * fetched from jsDelivr at a pinned version rather than bundled — this is
 * the pattern the library's own docs recommend, since bundlers don't
 * reliably resolve the .wasm asset path otherwise.
 */
export function BarcodeScannerModal({ open, onOpenChange, onDetected }: BarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deliberate reset each time the modal opens
    setError(null);

    async function start() {
      try {
        const { setZXingModuleOverrides, readBarcodesFromImageData } = await import("zxing-wasm/reader");
        setZXingModuleOverrides({
          locateFile: (path: string) =>
            `https://fastly.jsdelivr.net/npm/zxing-wasm@${ZXING_WASM_VERSION}/dist/reader/${path}`,
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        setIsScanning(true);

        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d", { willReadFrequently: true });

        const tick = async () => {
          if (cancelled || !videoRef.current || !canvas || !ctx) return;
          const video = videoRef.current;
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            try {
              const results = await readBarcodesFromImageData(imageData, {
                formats: ["EAN-13", "EAN-8", "UPC-A", "UPC-E"],
                tryHarder: true,
              });
              const hit = results.find((r) => r.isValid && r.text);
              if (hit) {
                onDetected(hit.text);
                onOpenChange(false);
                return;
              }
            } catch {
              // Transient decode errors are expected on empty/blurry frames — keep scanning.
            }
          }
          rafRef.current = requestAnimationFrame(() => void tick());
        };
        rafRef.current = requestAnimationFrame(() => void tick());
      } catch {
        if (!cancelled) {
          setError(
            "Couldn't access the camera. Check your browser's camera permission, or enter the barcode manually below."
          );
        }
      }
    }

    void start();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setIsScanning(false);
    };
  }, [open, onDetected, onOpenChange]);

  function handleManualSubmit() {
    const trimmed = manualCode.trim();
    if (!trimmed) return;
    onDetected(trimmed);
    onOpenChange(false);
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Scan a barcode"
      description="Point your camera at the product's barcode."
    >
      <div className="flex flex-col gap-4">
        <div className="relative aspect-square w-full overflow-hidden rounded-control bg-black">
          {/* Decorative live camera preview, not a media file — captions don't apply */}
          <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
          <canvas ref={canvasRef} className="hidden" />
          {isScanning && (
            <div className="pointer-events-none absolute inset-8 rounded-lg border-2 border-accent-info/70" />
          )}
        </div>

        {error && <p className="text-sm text-accent-danger">{error}</p>}

        <div className="flex items-center gap-2">
          <Input
            placeholder="Or type the barcode number"
            inputMode="numeric"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
          />
          <Button type="button" onClick={handleManualSubmit} disabled={!manualCode.trim()}>
            Use
          </Button>
        </div>
      </div>
    </Modal>
  );
}
