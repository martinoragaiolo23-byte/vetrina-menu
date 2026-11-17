import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { resizeImage } from "@/lib/image";
import { cn } from "@/lib/utils";

export function ImageUpload({
  value,
  onChange,
  maxSize,
  label,
  testId,
  className,
  round = false,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  maxSize: number;
  label: string;
  testId: string;
  className?: string;
  round?: boolean;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      onChange(await resizeImage(file, maxSize));
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = "";
    }
  };

  return (
    <div className={cn("group relative overflow-hidden border border-dashed border-stone-300 bg-stone-50", round ? "rounded-full" : "rounded-xl", className)}>
      {value ? (
        <img src={value} alt={label} className="h-full w-full object-cover" data-testid={`${testId}-preview`} />
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-xs text-stone-500 transition-colors hover:bg-orange-50 hover:text-terracotta"
          data-testid={`${testId}-button`}
        >
          {busy ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
          <span className="text-center leading-tight">{label}</span>
        </button>
      )}
      {value && (
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-stone-900/50 opacity-0 transition-opacity group-hover:opacity-100">
          <button type="button" onClick={() => input.current?.click()} className="rounded-full bg-white p-1.5 text-stone-800" aria-label="Cambia immagine" data-testid={`${testId}-change-button`}>
            <ImagePlus className="size-4" />
          </button>
          <button type="button" onClick={() => onChange(null)} className="rounded-full bg-white p-1.5 text-red-700" aria-label="Rimuovi immagine" data-testid={`${testId}-remove-button`}>
            <X className="size-4" />
          </button>
        </div>
      )}
      <input ref={input} type="file" accept="image/*" className="hidden" onChange={(e) => pick(e.target.files?.[0])} data-testid={`${testId}-input`} />
    </div>
  );
}
