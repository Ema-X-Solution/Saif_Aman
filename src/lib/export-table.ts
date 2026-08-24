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
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
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
  brand?: string;
  subtitle?: string;
  dir: "rtl" | "ltr";
  headers: string[];
  rows: string[][];
}

export function printPdfTable({
  title,
  brand = "SAIF AMAN",
  subtitle,
  dir,
  headers,
  rows,
}: PrintPdfTableOptions) {
  const html = `<!DOCTYPE html>
<html dir="${dir}" lang="${dir === "rtl" ? "ar" : "en"}">
<head>
  <meta charset="UTF-8" />
  <title>${escapeHtml(title)}</title>
  <style>
    @page { size: A4 landscape; margin: 12mm 12mm 14mm; }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      font-family: "Segoe UI", Tahoma, Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet { padding: 0; }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      background: #091f3a;
      color: #ffffff;
      padding: 16px 20px;
      border-bottom: 4px solid #e3a825;
    }
    .brand {
      font-size: 12px;
      letter-spacing: 0.16em;
      font-weight: 700;
      color: #f7cf6a;
      margin: 0 0 4px;
      text-transform: uppercase;
    }
    .title { font-size: 22px; font-weight: 700; margin: 0; }
    .meta {
      text-align: ${dir === "rtl" ? "left" : "right"};
      font-size: 12px;
      color: #fae3a6;
      line-height: 1.6;
      white-space: nowrap;
    }
    .content { padding: 16px 4px 0; }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
    }
    thead { display: table-header-group; }
    th {
      background: #12395e;
      color: #ffffff;
      font-weight: 700;
      padding: 10px 12px;
      text-align: start;
      border: 0;
    }
    td {
      padding: 9px 12px;
      text-align: start;
      border-bottom: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tr.even td { background: #ffffff; }
    tr.odd td { background: #f7f9fc; }
    tbody tr:last-child td { border-bottom: 2px solid #e3a825; }
    .footer {
      margin-top: 14px;
      font-size: 10px;
      color: #64748b;
      display: flex;
      justify-content: space-between;
    }
    @media print {
      .header { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <div class="sheet">
    <header class="header">
      <div>
        <p class="brand">${escapeHtml(brand)}</p>
        <h1 class="title">${escapeHtml(title)}</h1>
      </div>
      ${subtitle ? `<div class="meta">${escapeHtml(subtitle).replace(/\n/g, "<br/>")}</div>` : ""}
    </header>
    <div class="content">
      ${tableHtml(headers, rows)}
      <div class="footer">
        <span>${escapeHtml(brand)}</span>
        <span>${escapeHtml(title)}</span>
      </div>
    </div>
  </div>
</body>
</html>`;

  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  document.body.appendChild(iframe);

  const frameWindow = iframe.contentWindow;
  const frameDoc = iframe.contentDocument ?? frameWindow?.document;
  if (!frameWindow || !frameDoc) {
    iframe.remove();
    throw new Error("Print frame unavailable");
  }

  frameDoc.open();
  frameDoc.write(html);
  frameDoc.close();

  const cleanup = () => {
    iframe.remove();
  };

  const runPrint = () => {
    frameWindow.focus();
    frameWindow.print();
    window.setTimeout(cleanup, 1500);
  };

  window.setTimeout(runPrint, 250);
}
