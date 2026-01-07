import express from "express";
import cors from "cors";
import xvideosRouter from "./routes/xvideos.js";

const app = express();

app.use(cors());
app.use(express.json());

// Route utama
app.get("/", (req, res) => {
  res.json({ message: "Server is running..." });
});

// Tambahkan route untuk xvideos
app.use("/xvideos", xvideosRouter);

// Jalankan server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
