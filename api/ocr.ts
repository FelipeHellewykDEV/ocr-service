import Tesseract from "tesseract.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { imageBase64, imageUrl } = req.body;

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({ error: "imageBase64 or imageUrl required" });
    }

    const image = imageBase64 || imageUrl;

    const result = await Tesseract.recognize(
      image,
      "por+eng", // PORTUGUÊS + INGLÊS
      {
        logger: () => {}
      }
    );

    const text = result.data.text?.trim() || "";

    return res.status(200).json({
      ok: true,
      extracted_text: text,
      confidence: result.data.confidence || 0
    });

  } catch (err) {
    console.error("OCR error:", err);
    return res.status(500).json({
      error: "OCR engine failed",
      detail: String(err)
    });
  }
}
