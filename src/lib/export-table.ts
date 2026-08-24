function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function tableHtml(headers: string[], rows: string[][]): string {
  const head = headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
  const body = rows
    .map((row, index) => {
      const cells = row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("");
      return `<tr class="${index % 2 === 0 ? "even" : "odd"}">${cells}</tr>`;
    })
    .join("");
  return `<table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>`;
}

export function downloadExcelTable(filename: string, headers: string[], rows: string[][]) {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="UTF-8"></head><body>${tableHtml(headers, rows)}</body></html>`;
  const blob = new Blob(["\uFEFF", html], {
    type: "application/vnd.ms-excel;charset=utf-8",
  });
  triggerDownload(blob, filename.endsWith(".xls") ? filename : `${filename}.xls`);
}

export interface PrintPdfTableOptions {
  title: string;
  filename?: string;
  brand?: string;
  subtitle?: string;
  dir: "rtl" | "ltr";
  headers: string[];
  rows: string[][];
}

export async function printPdfTable({
  title,
  filename,
  brand = "SAIF AMAN",
  subtitle,
  dir,
  headers,
  rows,
}: PrintPdfTableOptions) {
  const host = document.createElement("div");
  host.setAttribute("dir", dir);
  host.setAttribute("aria-hidden", "true");
  host.style.cssText =
    "position:absolute;left:-10000px;top:0;width:1123px;background:#ffffff;pointer-events:none;";
  host.innerHTML = `
    <style>
      .sa-pdf-sheet { font-family: "Segoe UI", Tahoma, Arial, sans-serif; color: #0f172a; background: #ffffff; }
      .sa-pdf-header {
        display: flex; align-items: center; justify-content: space-between; gap: 16px;
        background: #091f3a; color: #ffffff; padding: 16px 20px; border-bottom: 4px solid #e3a825;
      }
      .sa-pdf-brand { font-size: 12px; letter-spacing: 0.16em; font-weight: 700; color: #f7cf6a; margin: 0 0 4px; text-transform: uppercase; }
      .sa-pdf-title { font-size: 22px; font-weight: 700; margin: 0; }
      .sa-pdf-meta { text-align: ${dir === "rtl" ? "left" : "right"}; font-size: 12px; color: #fae3a6; line-height: 1.6; white-space: nowrap; }
      .sa-pdf-content { padding: 16px 8px 8px; }
      .sa-pdf-sheet table { width: 100%; border-collapse: collapse; font-size: 11.5px; }
      .sa-pdf-sheet th { background: #12395e; color: #ffffff; font-weight: 700; padding: 10px 12px; text-align: start; border: 0; }
      .sa-pdf-sheet td { padding: 9px 12px; text-align: start; border-bottom: 1px solid #e2e8f0; vertical-align: middle; }
      .sa-pdf-sheet tr.even td { background: #ffffff; }
      .sa-pdf-sheet tr.odd td { background: #f7f9fc; }
      .sa-pdf-sheet tbody tr:last-child td { border-bottom: 2px solid #e3a825; }
      .sa-pdf-footer { margin-top: 14px; font-size: 10px; color: #64748b; display: flex; justify-content: space-between; }
    </style>
    <div class="sa-pdf-sheet">
      <header class="sa-pdf-header">
        <div>
          <p class="sa-pdf-brand">${escapeHtml(brand)}</p>
          <h1 class="sa-pdf-title">${escapeHtml(title)}</h1>
        </div>
        ${subtitle ? `<div class="sa-pdf-meta">${escapeHtml(subtitle).replace(/\n/g, "<br/>")}</div>` : ""}
      </header>
      <div class="sa-pdf-content">
        ${tableHtml(headers, rows)}
        <div class="sa-pdf-footer">
          <span>${escapeHtml(brand)}</span>
          <span>${escapeHtml(title)}</span>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(host);

  try {
    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const canvas = await html2canvas(host, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
      windowWidth: 1123,
    });
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    const imgData = canvas.toDataURL("image/jpeg", 0.92);

    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position -= pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const safeName = (filename ?? title).replace(/[\\/:*?"<>|]+/g, "-").trim() || "export";
    const pdfBlob = pdf.output("blob");
    triggerDownload(
      new Blob([pdfBlob], { type: "application/octet-stream" }),
      safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`,
    );
  } finally {
    host.remove();
  }
}
