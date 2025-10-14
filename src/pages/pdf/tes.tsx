import jsPDF from "jspdf";

export const generateOBAT = (): string => {
  const doc = new jsPDF();
  doc.text("Ini PDF untuk Obat", 10, 10);

  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
};