import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const downloadInvoice = async () => {
  const invoice =
    document.getElementById("invoice");

  if (!invoice) return;

  const canvas =
    await html2canvas(invoice, {
      scale: 2,
    });

  const imgData =
    canvas.toDataURL("image/png");

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const pdfWidth =
    pdf.internal.pageSize.getWidth();

  const pdfHeight =
    (canvas.height * pdfWidth) /
    canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save("invoice.pdf");
};

export default downloadInvoice;