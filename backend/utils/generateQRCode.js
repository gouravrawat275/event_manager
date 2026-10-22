import QRCode from "qrcode";

export const generateQRCode = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data), {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 300,
    });
  } catch (err) {
    console.error("QR generation failed:", err.message);
    return "";
  }
};
