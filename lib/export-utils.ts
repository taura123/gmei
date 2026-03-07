import { utils, writeFile } from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportFormat = "CSV" | "XLSX" | "PDF";

interface ExportHeader<T> {
    key: keyof T | string;
    label: string;
}

/**
 * Universal export utility for CSV, XLSX, and PDF.
 */
export async function exportData<T>(
    data: T[],
    headers: ExportHeader<T>[],
    filename: string,
    format: ExportFormat
) {
    if (!data || data.length === 0) {
        alert("Tidak ada data untuk diekspor.");
        return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const finalFilename = `${filename}_${timestamp}`;

    switch (format) {
        case "CSV":
            exportToCSV(data, headers, finalFilename);
            break;
        case "XLSX":
            exportToXLSX(data, headers, finalFilename);
            break;
        case "PDF":
            exportToPDF(data, headers, filename);
            break;
    }
}

function exportToCSV<T>(data: T[], headers: ExportHeader<T>[], filename: string) {
    const csvRows = [];
    csvRows.push(headers.map(h => `"${h.label}"`).join(","));

    for (const row of data) {
        const values = headers.map(h => {
            const val = (row as any)[h.key];
            const escaped = String(val === null || val === undefined ? "" : val).replace(/"/g, '""');
            return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
    }

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    downloadFile(blob, `${filename}.csv`);
}

function exportToXLSX<T>(data: T[], headers: ExportHeader<T>[], filename: string) {
    const formattedData = data.map(item => {
        const obj: any = {};
        headers.forEach(h => {
            obj[h.label] = (item as any)[h.key];
        });
        return obj;
    });

    const worksheet = utils.json_to_sheet(formattedData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Data");
    writeFile(workbook, `${filename}.xlsx`);
}

function exportToPDF<T>(data: T[], headers: ExportHeader<T>[], title: string) {
    const isLandscape = headers.length > 5;
    const doc = new jsPDF({
        orientation: isLandscape ? "landscape" : "portrait",
        unit: "pt"
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const primaryColor = [30, 65, 152]; // Gramedia Blue

    // --- 1. HEADER & BRANDING ---
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, pageWidth, 80, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("GRAMEDIA CORPORATE", 40, 45);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("ADMINISTRATION REPORT SYSTEM - GMEI", 40, 60);

    // --- 2. REPORT TITLE & INFO ---
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`LAPORAN: ${title.toUpperCase().replace(/_/g, " ")}`, 40, 110);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Waktu Cetak: ${new Date().toLocaleString('id-ID')}`, 40, 125);

    // --- 3. SUMMARY SECTION ---
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(40, 140, pageWidth - 80, 50, 5, 5, "F");

    doc.setFont("helvetica", "bold");
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.text("RINGKASAN LAPORAN", 55, 158);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    const totalItems = data.length;
    const categories = new Set(data.map(item => (item as any).category || (item as any).status || "Lainnya"));

    doc.text(`Total Baris Data: ${totalItems}`, 55, 175);
    doc.text(`Jumlah Kategori/Status: ${categories.size}`, 200, 175);
    doc.text(`Status Dokumen: Resmi/Sistem-Generated`, pageWidth - 250, 175);

    // --- 4. DATA TABLE ---
    const tableHeaders = headers.map(h => h.label);
    const tableData = data.map(item =>
        headers.map(h => {
            const val = (item as any)[h.key];
            if (val === null || val === undefined || val === "") return "-";
            if (typeof val === "number") return val.toLocaleString('id-ID');

            // Critical fix: If it's a link, we show a clean text but the link is there in the data
            if (h.key === "link" && String(val).startsWith("http")) {
                return "LIHAT ONLINE";
            }

            return String(val);
        })
    );

    // Smart Column Sizing to fix squashing
    const columnStyles: any = {};
    headers.forEach((h, index) => {
        const label = h.label.toLowerCase();
        const key = String(h.key).toLowerCase();

        if (label.includes("nama") || label.includes("produk")) {
            columnStyles[index] = { cellWidth: isLandscape ? 160 : 110 };
        } else if (label.includes("link")) {
            columnStyles[index] = { cellWidth: 70, halign: 'center', textColor: [30, 65, 152] };
        } else if (label.includes("harga")) {
            columnStyles[index] = { cellWidth: 80, halign: 'right' };
        } else if (label.includes("pesan") || label.includes("message")) {
            columnStyles[index] = { cellWidth: isLandscape ? 250 : 150 };
        } else if (label.includes("subjek") || label.includes("subject")) {
            columnStyles[index] = { cellWidth: 120 };
        } else if (label.includes("status")) {
            columnStyles[index] = { cellWidth: 60, halign: 'center' };
        }
    });

    autoTable(doc, {
        head: [tableHeaders],
        body: tableData,
        startY: 210,
        margin: { left: 40, right: 40, bottom: 60 },
        styles: {
            fontSize: 8,
            cellPadding: 6,
            overflow: 'linebreak',
            font: "helvetica",
            lineWidth: 0.5,
            lineColor: [226, 232, 240],
            valign: 'middle'
        },
        headStyles: {
            fillColor: primaryColor as any,
            textColor: [255, 255, 255],
            fontSize: 9,
            fontStyle: 'bold',
            halign: 'center'
        },
        alternateRowStyles: {
            fillColor: [250, 252, 255]
        },
        columnStyles: columnStyles,
        didDrawCell: (cellData) => {
            if (cellData.section === 'body') {
                const header = headers[cellData.column.index];
                // If it's the link column, add a clickable link over the cell
                if (header && header.key === 'link') {
                    const originalItem = data[cellData.row.index];
                    if (originalItem) {
                        const url = (originalItem as any).link;
                        if (url && typeof url === 'string' && url.startsWith('http')) {
                            doc.link(cellData.cell.x, cellData.cell.y, cellData.cell.width, cellData.cell.height, { url: url });
                        }
                    }
                }
            }
        },
        didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(150);
            const str = `Halaman ${data.pageNumber}`;
            doc.text(str, pageWidth - 80, doc.internal.pageSize.getHeight() - 30);
            doc.text("Dokumen ini dihasilkan secara otomatis oleh Gramedia Corporate Admin Portal.", 40, doc.internal.pageSize.getHeight() - 30);
        }
    });

    doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
}

function downloadFile(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
