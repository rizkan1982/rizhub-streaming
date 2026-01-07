import { Router, Request, Response } from "express";
import { scrapeXvideos } from "../scraper/xvideos.scraper";

const router = Router();

/**
 * Endpoint: /xvideos/watch?id=milf
 */
router.get("/watch", async (req: Request, res: Response) => {
  try {
    const { id } = req.query;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Parameter ?id= tidak ditemukan atau tidak valid.",
      });
    }

    const data = await scrapeXvideos(id);

    if (!data.length) {
      return res.json({
        success: false,
        message: "Tidak ada hasil ditemukan.",
      });
    }

    res.json({
      success: true,
      total: data.length,
      data,
    });
  } catch (error: any) {
    console.error("❌ Error route /xvideos/watch:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
