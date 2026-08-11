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
  console.log(`\n🚀 StreetWear API running on http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Client URL  : ${process.env.CLIENT_URL || "http://localhost:3000"}\n`);
});

app.get("/api/test", async (req, res) => {
   const { data, error } = await supabase.from('test').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json({ data });
  console.log("Test data fetched from Supabase:");
})