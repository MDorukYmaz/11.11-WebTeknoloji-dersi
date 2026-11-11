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

// hatalı JSON gövdesi vb. -> JSON hata yanıtı
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = status === 400 ? "Invalid JSON body" : "Internal server error";
  res.status(status).json({ error: { message } });
});

export default app;
