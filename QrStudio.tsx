import { useRef, useState } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { Copy, Download, ExternalLink, FileCode2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { publicUrl } from "@/lib/types";
import { cn } from "@/lib/utils";

const COLORS = ["#1C1917", "#C2410C", "#3F6212", "#1E3A8A", "#7F1D1D"];
const HIRES = 1600;

function download(href: string, filename: string) {
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  a.click();
}

export function QrStudio({ slug, name, isActive }: { slug: string; name: string; isActive: boolean }) {
  const url = publicUrl(slug);
  const [color, setColor] = useState(COLORS[0]);
  const [headline, setHeadline] = useState("Inquadra per il Menù");
  const [table, setTable] = useState("");
  const hiresRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const downloadQrOnly = () => {
    const c = hiresRef.current;
    if (c) download(c.toDataURL("image/png"), `qr-${slug}.png`);
  };

  const downloadFramed = async () => {
    const qr = hiresRef.current;
    if (!qr) return;
    await document.fonts.ready;
    const W = 2000;
    const H = 2700;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#FAF7F2";
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(80, 80, W - 160, H - 160, 90);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.roundRect(260, 640, W - 520, W - 520, 60);
    ctx.fill();
    ctx.drawImage(qr, 300, 680, W - 600, W - 600);
    ctx.textAlign = "center";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "600 140px 'Lora Variable', serif";
    ctx.fillText(headline || "Inquadra per il Menù", W / 2, 330);
    ctx.font = "500 84px 'Plus Jakarta Sans Variable', sans-serif";
    ctx.fillText(name || "Il mio locale", W / 2, 480);
    if (table) {
      ctx.font = "700 120px 'Plus Jakarta Sans Variable', sans-serif";
      ctx.fillText(`Tavolo ${table}`, W / 2, 2330);
    }
    ctx.font = "400 56px 'Plus Jakarta Sans Variable', sans-serif";
    ctx.globalAlpha = 0.85;
    ctx.fillText(url.replace(/^https?:\/\//, ""), W / 2, table ? 2470 : 2400);
    download(c.toDataURL("image/png"), `qr-${slug}${table ? `-tavolo-${table}` : ""}.png`);
  };

  const downloadSvg = () => {
    const svg = svgRef.current;
    if (!svg) return;
    const xml = new XMLSerializer().serializeToString(svg);
    download(URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" })), `qr-${slug}.svg`);
  };

  return (
    <div className="grid gap-6 animate-rise lg:grid-cols-[1fr_1.1fr]" data-testid="qr-studio">
      <div className="flex flex-col items-center rounded-3xl p-8 text-center text-white transition-[background-color] duration-300" style={{ backgroundColor: color }}>
        <p className="font-heading text-2xl font-semibold">{headline || "Inquadra per il Menù"}</p>
        <p className="mt-1 text-sm opacity-90">{name || "Il mio locale"}</p>
        <div className="mt-6 rounded-2xl bg-white p-4 shadow-xl transition-transform duration-300 hover:scale-[1.02]">
          <QRCodeSVG ref={svgRef} value={url} size={220} level="H" fgColor={color} bgColor="#FFFFFF" marginSize={1} data-testid="qr-preview" />
        </div>
        {table && <p className="mt-5 text-xl font-bold">Tavolo {table}</p>}
        <p className="mt-3 break-all font-mono text-xs opacity-80" data-testid="qr-url-text">{url.replace(/^https?:\/\//, "")}</p>
        <div className="hidden">
          <QRCodeCanvas ref={hiresRef} value={url} size={HIRES} level="H" fgColor={color} bgColor="#FFFFFF" marginSize={2} />
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-stone-200 bg-white p-6">
        {!isActive && (
          <p className="rounded-xl bg-red-50 p-3 text-sm text-red-800" data-testid="qr-inactive-warning">
            La tua pagina pubblica è in pausa: chi inquadra il QR vedrà la schermata di abbonamento scaduto.
          </p>
        )}
        <div className="space-y-1.5">
          <Label>Link della tua pagina</Label>
          <div className="flex gap-2">
            <Input readOnly value={url} className="font-mono text-xs" data-testid="qr-public-url-input" />
            <Button
              variant="outline"
              size="icon"
              aria-label="Copia link"
              onClick={() => navigator.clipboard.writeText(url).then(() => toast.success("Link copiato"))}
              data-testid="qr-copy-link-button"
            >
              <Copy className="size-4" />
            </Button>
            <a href={url} target="_blank" rel="noreferrer" className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-input transition-colors hover:bg-stone-50" aria-label="Apri pagina" data-testid="qr-open-page-link">
              <ExternalLink className="size-4" />
            </a>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="qr-head">Testo della cornice</Label>
            <Input id="qr-head" value={headline} onChange={(e) => setHeadline(e.target.value)} data-testid="qr-headline-input" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="qr-table">Numero tavolo (opzionale)</Label>
            <Input id="qr-table" value={table} onChange={(e) => setTable(e.target.value.slice(0, 6))} placeholder="Es. 12" data-testid="qr-table-input" />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Colore</Label>
          <div className="flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={cn("size-9 rounded-full ring-offset-2 transition-transform hover:scale-110", color === c && "ring-2 ring-stone-800")}
                style={{ backgroundColor: c }}
                aria-label={`Colore ${c}`}
                data-testid={`qr-color-${c.slice(1)}`}
              />
            ))}
          </div>
        </div>
        <div className="grid gap-2 pt-2">
          <Button size="lg" className="h-11 gap-2" onClick={downloadFramed} data-testid="qr-download-png-button">
            <Download className="size-4" /> Scarica cartellino da tavolo (PNG alta risoluzione)
          </Button>
          <div className="grid gap-2 sm:grid-cols-2">
            <Button variant="outline" className="gap-2" onClick={downloadQrOnly} data-testid="qr-download-plain-button">
              <Download className="size-4" /> Solo QR (PNG {HIRES}px)
            </Button>
            <Button variant="outline" className="gap-2" onClick={downloadSvg} data-testid="qr-download-svg-button">
              <FileCode2 className="size-4" /> SVG vettoriale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
