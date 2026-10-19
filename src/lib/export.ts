const escapeCell = (value: unknown) => {
  let s = String(value ?? "");
  // escape special characters
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

export const toCsv = (rows: Record<string, unknown>[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  return [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escapeCell(r[h])).join(",")),
  ].join("\r\n");
};

export const downloadFile = (
  content: string,
  filename: string,
  mime: string,
) => {
  // \uFEFF (BOM) ทำให้ Excel อ่านภาษาไทยถูก
  const blob = new Blob(["\uFEFF" + content], {
    type: `${mime};charset=utf-8`,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const toBase64 = (buf: ArrayBuffer) => {
  let binary = "";
  const bytes = new Uint8Array(buf);
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
};

export async function exportPdf(
  rows: Record<string, unknown>[],
  filename = "transactions.pdf",
) {
  // import as lazy to avoid circular dependency
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);

  const doc = new jsPDF({ orientation: "landscape" });

  const res = await fetch("/fonts/Sarabun-Regular.ttf");
  const font = toBase64(await res.arrayBuffer());
  doc.addFileToVFS("Sarabun-Regular.ttf", font);
  doc.addFont("Sarabun-Regular.ttf", "Sarabun", "normal");
  doc.setFont("Sarabun");

  const headers = Object.keys(rows[0] ?? {});
  autoTable(doc, {
    head: [headers],
    body: rows.map((r) => headers.map((h) => String(r[h] ?? ""))),
    styles: { font: "Sarabun", fontSize: 9 },
    headStyles: { font: "Sarabun" },
  });

  doc.save(filename);
}
