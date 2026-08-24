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

function chunkRows<T>(rows: T[], size: number): T[][] {
  if (rows.length === 0) return [[]];
  const pages: T[][] = [];
  for (let i = 0; i < rows.length; i += size) {
    pages.push(rows.slice(i, i + size));
  }
  return pages;
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

const PDF_PAGE_WIDTH_PX = 1123;
/** Landscape A4 content box (297×210mm minus 8mm margins). */
const PDF_TARGET_SHEET_HEIGHT_PX = Math.round(PDF_PAGE_WIDTH_PX * (194 / 281));

function sheetDocumentHtml(options: {
  title: string;
  brand: string;
  subtitle?: string;
  dir: "rtl" | "ltr";
  headers: string[];
  rows: string[][];
  pageLabel: string;
}): string {
  const { title, brand, subtitle, dir, headers, rows, pageLabel } = options;
  return `<!DOCTYPE html>
<html dir="${dir}" lang="${dir === "rtl" ? "ar" : "en"}">
<head>
  <meta charset="UTF-8" />
  <style>
    html, body { margin: 0; padding: 0; background: #ffffff; }
    .sa-pdf-sheet {
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      width: ${PDF_PAGE_WIDTH_PX}px;
      min-height: ${PDF_TARGET_SHEET_HEIGHT_PX}px;
      display: flex;
      flex-direction: column;
    }
    .sa-pdf-header {
      display: flex; align-items: center; justify-content: space-between; gap: 16px;
      background: #091f3a; color: #ffffff; padding: 16px 20px; border-bottom: 4px solid #e3a825;
    }
    .sa-pdf-brand { font-size: 12px; letter-spacing: 0.16em; font-weight: 700; color: #f7cf6a; margin: 0 0 4px; text-transform: uppercase; }
    .sa-pdf-title { font-size: 22px; font-weight: 700; margin: 0; }
    .sa-pdf-meta { text-align: ${dir === "rtl" ? "left" : "right"}; font-size: 12px; color: #fae3a6; line-height: 1.6; white-space: nowrap; }
    .sa-pdf-content { padding: 12px 8px 8px; flex: 1; display: flex; flex-direction: column; }
    .sa-pdf-table-wrap { flex: 0 0 auto; width: 100%; }
    .sa-pdf-sheet table {
      width: 100%;
      table-layout: fixed;
      height: auto;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    .sa-pdf-sheet th { background: #12395e; color: #ffffff; font-weight: 700; padding: 8px 8px; text-align: start; border: 0; }
    .sa-pdf-sheet td { padding: 6px 8px; text-align: start; border-bottom: 1px solid #e2e8f0; vertical-align: middle; word-break: break-word; overflow-wrap: anywhere; }
    .sa-pdf-sheet tr.even td { background: #ffffff; }
    .sa-pdf-sheet tr.odd td { background: #f7f9fc; }
    .sa-pdf-footer {
      margin-top: auto; padding-top: 10px; border-top: 2px solid #e3a825;
      font-size: 10px; color: #64748b; display: flex; justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="sa-pdf-sheet">
    <header class="sa-pdf-header">
      <div>
        <p class="sa-pdf-brand">${escapeHtml(brand)}</p>
        <h1 class="sa-pdf-title">${escapeHtml(title)}</h1>
      </div>
      ${subtitle ? `<div class="sa-pdf-meta">${escapeHtml(subtitle).replace(/\n/g, "<br/>")}</div>` : ""}
    </header>
    <div class="sa-pdf-content">
      <div class="sa-pdf-table-wrap">
        ${tableHtml(headers, rows)}
      </div>
      <div class="sa-pdf-footer">
        <span>${escapeHtml(brand)}</span>
        <span>${escapeHtml(pageLabel)}</span>
        <span>${escapeHtml(title)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function writeSheet(frameDoc: Document, iframe: HTMLIFrameElement, html: string) {
  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();
  await new Promise((resolve) => window.setTimeout(resolve, 40));
  const sheet = frameDoc.querySelector(".sa-pdf-sheet") as HTMLElement | null;
  if (!sheet) throw new Error("PDF sheet missing");
  iframe.style.height = `${Math.max(sheet.scrollHeight, 1)}px`;
  return sheet;
}

function measureRowsPerPage(frameDoc: Document): number {
  const row = frameDoc.querySelector(".sa-pdf-sheet tbody tr") as HTMLElement | null;
  const header = frameDoc.querySelector(".sa-pdf-header") as HTMLElement | null;
  const thead = frameDoc.querySelector(".sa-pdf-sheet thead") as HTMLElement | null;
  const footer = frameDoc.querySelector(".sa-pdf-footer") as HTMLElement | null;
  const rowHeight = Math.max(row?.getBoundingClientRect().height || 32, 28);
  const chrome =
    (header?.getBoundingClientRect().height || 72) +
    (thead?.getBoundingClientRect().height || 32) +
    (footer?.getBoundingClientRect().height || 36) +
    24;
  return Math.max(1, Math.floor((PDF_TARGET_SHEET_HEIGHT_PX - chrome) / rowHeight));
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
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const htmlEl = document.documentElement;
  const bodyEl = document.body;
  const prevHtmlOverflow = htmlEl.style.overflow;
  const prevBodyOverflow = bodyEl.style.overflow;
  htmlEl.style.overflow = "hidden";
  bodyEl.style.overflow = "hidden";

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.tabIndex = -1;
  iframe.style.cssText =
    "position:fixed;left:0;top:0;width:1123px;height:1px;opacity:0;border:0;pointer-events:none;z-index:-1;";
  document.body.appendChild(iframe);

  const frameDoc = iframe.contentDocument;
  if (!frameDoc) {
    iframe.remove();
    htmlEl.style.overflow = prevHtmlOverflow;
    bodyEl.style.overflow = prevBodyOverflow;
    window.scrollTo(scrollX, scrollY);
    throw new Error("Print frame unavailable");
  }

  try {
    await writeSheet(
      frameDoc,
      iframe,
      sheetDocumentHtml({
        title,
        brand,
        subtitle,
        dir,
        headers,
        rows: rows.length ? rows.slice(0, 3) : [headers.map(() => "—")],
        pageLabel: "1 / 1",
      }),
    );
    const rowsPerPage = measureRowsPerPage(frameDoc);
    const pageChunks = chunkRows(rows, rowsPerPage);
    const totalPages = pageChunks.length;

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);
    const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 8;

    for (let i = 0; i < pageChunks.length; i += 1) {
      const pageLabel = `${i + 1} / ${totalPages}`;
      const sheet = await writeSheet(
        frameDoc,
        iframe,
        sheetDocumentHtml({
          title,
          brand,
          subtitle,
          dir,
          headers,
          rows: pageChunks[i],
          pageLabel,
        }),
      );

      const canvas = await html2canvas(sheet, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: 0,
        windowWidth: PDF_PAGE_WIDTH_PX,
      });

      if (i > 0) pdf.addPage();

      const maxWidth = pageWidth - margin * 2;
      const maxHeight = pageHeight - margin * 2;
      const imgWidth = maxWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const scale = imgHeight > maxHeight ? maxHeight / imgHeight : 1;
      const drawWidth = imgWidth * scale;
      const drawHeight = imgHeight * scale;
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      pdf.addImage(imgData, "JPEG", margin, margin, drawWidth, drawHeight);
    }

    const safeName = (filename ?? title).replace(/[\\/:*?"<>|]+/g, "-").trim() || "export";
    const buffer = pdf.output("arraybuffer");
    triggerDownload(
      new Blob([buffer], { type: "application/octet-stream" }),
      safeName.endsWith(".pdf") ? safeName : `${safeName}.pdf`,
    );
  } finally {
    iframe.remove();
    htmlEl.style.overflow = prevHtmlOverflow;
    bodyEl.style.overflow = prevBodyOverflow;
    window.scrollTo(scrollX, scrollY);
  }
}
