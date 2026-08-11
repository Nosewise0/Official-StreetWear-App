require("dotenv").config();
const express = require("express");
const cors = require("cors");
const supabase = require("./supabaseClient");
const productRoutes = require("./routes/products");
const categoryRoutes = require("./routes/categories");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "StreetWear API is running 🚀",
    version: "1.0.0",
    endpoints: {
      products: "/api/products",
      categories: "/api/categories",
    },
  });
});

app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

app.get("/api/test", async (req, res) => {
  try {
    const { error } = await supabase.rpc("version");
    if (error && error.code !== "PGRST202") {
      return res.status(500).json({ connected: false, error: error.message });
    }
    res.json({ connected: true, message: "Supabase connection OK" });
  } catch (err) {
    res.status(503).json({ connected: false, error: String(err) });
  }
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`StreetWear API running on http://localhost:${PORT}`);
  console.log(`Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`Client URL  : ${process.env.CLIENT_URL || "http://localhost:3000"}`);
});