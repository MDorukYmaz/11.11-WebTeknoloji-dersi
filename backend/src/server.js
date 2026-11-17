import "dotenv/config";
import app from "./app.js";
import { connectDb } from "./db.js";

const PORT = process.env.PORT || 3000;

try {
  await connectDb();
  app.listen(PORT, () => console.log(`API: http://localhost:${PORT}`));
} catch (err) {
  console.error("MongoDB bağlantısı kurulamadı:", err.message);
  process.exit(1);
}
