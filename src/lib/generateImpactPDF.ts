import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ImpactData {
  suppliers: number;
  programs: number;
  products: number;
  reports: any[];
  latestMetrics: any;
  latestBeneficiaries: number;
  allSdgTags: string[];
}

export function generateImpactPDF(data: ImpactData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const primary: [number, number, number] = [30, 70, 50];
  const dark: [number, number, number] = [30, 30, 30];
  const muted: [number, number, number] = [120, 120, 120];

  // --- Header ---
  doc.setFillColor(primary[0], primary[1], primary[2]);
  doc.rect(0, 0, pageWidth, 45, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("PasarBaik", margin, 20);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Impact Supply Aggregator Platform", margin, 28);
  doc.setFontSize(9);
  doc.text(`Report generated: ${new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })}`, margin, 36);

  y = 55;

  // --- Title ---
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Impact Report for Corporate Buyers", margin, y);
  y += 12;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(muted[0], muted[1], muted[2]);
  doc.text("Comprehensive overview of social and economic impact from all development programs.", margin, y);
  y += 14;

  // --- Key Metrics Table ---
  doc.setTextColor(dark[0], dark[1], dark[2]);
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Key Impact Metrics", margin, y);
  y += 6;

  const m = data.latestMetrics || {};
  const metricsData = [
    ["UMKM Suppliers", data.suppliers.toLocaleString()],
    ["Active Programs", data.programs.toLocaleString()],
    ["Products Listed", data.products.toLocaleString()],
    ["Beneficiaries", data.latestBeneficiaries.toLocaleString()],
    ["Jobs Created", (m.jobs_created || 0).toLocaleString()],
    ["Women Workers", (m.women_workers || 0).toLocaleString()],
    ["Villages Reached", (m.villages_reached || 0).toLocaleString()],
    ["Households Supported", (m.households_supported || 0).toLocaleString()],
  ];

  if (m.revenue_generated) {
    metricsData.push(["Revenue Generated", m.revenue_generated]);
  }
  if (m.carbon_offset_tons) {
    metricsData.push(["CO₂ Offset (tons)", String(m.carbon_offset_tons)]);
  }
  if (m.products_sold) {
    metricsData.push(["Products Sold", m.products_sold.toLocaleString()]);
  }

  autoTable(doc, {
    startY: y,
    head: [["Metric", "Value"]],
    body: metricsData,
    margin: { left: margin, right: margin },
    headStyles: {
      fillColor: [primary[0], primary[1], primary[2]],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 10,
    },
    bodyStyles: { fontSize: 10, textColor: dark },
    alternateRowStyles: { fillColor: [245, 247, 245] },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: contentWidth * 0.5 },
      1: { halign: "right" },
    },
    theme: "grid",
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // --- SDG Alignment ---
  if (data.allSdgTags.length > 0) {
    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("SDG Alignment", margin, y);
    y += 7;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.text(data.allSdgTags.join("  •  "), margin, y, { maxWidth: contentWidth });
    y += 14;
  }

  // --- Reports Table ---
  if (data.reports.length > 0) {
    // Check if we need a new page
    if (y > 230) {
      doc.addPage();
      y = margin;
    }

    doc.setTextColor(dark[0], dark[1], dark[2]);
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Impact Reports Timeline", margin, y);
    y += 6;

    const reportRows = data.reports.map((r) => {
      const rm = (r.metrics as any) || {};
      return [
        r.title,
        r.date || "—",
        (r.beneficiaries || 0).toLocaleString(),
        (rm.jobs_created || 0).toLocaleString(),
        (rm.women_workers || 0).toLocaleString(),
        rm.revenue_generated || "—",
      ];
    });

    autoTable(doc, {
      startY: y,
      head: [["Report", "Date", "Beneficiaries", "Jobs", "Women", "Revenue"]],
      body: reportRows,
      margin: { left: margin, right: margin },
      headStyles: {
        fillColor: [primary[0], primary[1], primary[2]],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        fontSize: 9,
      },
      bodyStyles: { fontSize: 9, textColor: dark },
      alternateRowStyles: { fillColor: [245, 247, 245] },
      theme: "grid",
    });

    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // --- Footer ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFillColor(245, 247, 245);
    doc.rect(0, pageHeight - 18, pageWidth, 18, "F");
    doc.setFontSize(8);
    doc.setTextColor(muted[0], muted[1], muted[2]);
    doc.setFont("helvetica", "normal");
    doc.text("PasarBaik — Impact Supply Aggregator Platform  •  pasarbaik.lovable.app", margin, pageHeight - 8);
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: "right" });
  }

  // --- Save ---
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`PasarBaik-Impact-Report-${dateStr}.pdf`);
}
