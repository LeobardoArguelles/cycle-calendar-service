const express = require("express");
const sharp = require("sharp");
const { buildCycleData } = require("./cycle");
const { renderCycleSvg } = require("./renderSvg");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/render-cycle-calendar", async (req, res) => {
  try {
    const data = buildCycleData(req.body);
    const svg = renderCycleSvg(data);

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "no-store");
    return res.send(pngBuffer);
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message || "Unexpected error",
    });
  }
});

app.post("/render-cycle-calendar-json", async (req, res) => {
  try {
    const data = buildCycleData(req.body);
    const svg = renderCycleSvg(data);

    const pngBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

    return res.json({
      summary: {
        ovulation_date: data.ovulation_date,
        fertile_start: data.fertile_start,
        fertile_end: data.fertile_end,
        period_end: data.period_end,
      },
      svg,
      png_base64: pngBuffer.toString("base64"),
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message || "Unexpected error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Cycle calendar service running on port ${PORT}`);
});
