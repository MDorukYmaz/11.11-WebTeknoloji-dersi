import express from "express";
import cors from "cors";
import eventRoutes from "./routes/event-routes.js";

const app = express();
app.use(cors());
app.use(express.json()); // body -> req.body

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
    student: "2416501038",
  });
});

app.use("/events", eventRoutes);

app.use((req, res) => { // eşleşme yoksa
  res.status(404).json({ error: { message: "Route not found" } });
});

// hata yakalayıcı: 4 parametre olduğu için next(err) buraya gelir
app.use((err, req, res, next) => {
  // bozuk JSON gövdesi kullanıcı hatasıdır
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: { message: "Invalid JSON body" } });
  }
  console.error(err.message); // ayrıntı terminalde kalır
  res.status(500).json({ error: { message: "Server error" } });
});

export default app;
