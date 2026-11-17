// Client-side resize so uploaded photos stay small enough to store inline.
export function resizeImage(file: File, maxSize: number, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Il file selezionato non è un'immagine"));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Impossibile leggere il file"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Immagine non valida"));
      img.onload = () => {
        const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas non disponibile"));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/webp", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
