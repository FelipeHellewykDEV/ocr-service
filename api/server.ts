import express from "express";
import cors from "cors";
import Tesseract from "tesseract.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "25mb" }));

app.post("/ocr", async (req, res) => {
  try {
    const { imageBase64, imageUrl } = req.body;

    if (!imageBase64 && !imageUrl) {
      return res.status(400).json({
        error: "imageBase64 or imageUrl required"
      });
    }

    const image = imageBase64 || imageUrl;

    const result = await Tesseract.recognize(
      image,
      "por+eng",
      {
        logger: () => {}
      }
    );

    const extractedText = result.data.text?.trim() || "";

    return res.json({
      ok: true,
      extracted_text: extractedText,
      confidence: Math.round(result.data.confidence || 0)
    });

  } catch (err) {
    console.error("OCR error:", err);
    return res.status(500).json({
      error: "OCR engine failed",
      detail: String(err)
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("OCR service running on port", PORT);
});
