// npm run seed -> events koleksiyonunu boşaltıp başlangıç verisini yükler
import "dotenv/config";
import { connectDb, eventsCollection, closeDb } from "./db.js";
import { events } from "./data/events.js";

try {
  await connectDb();
  const col = eventsCollection();
  await col.deleteMany({});
  // eski "event-1" id'leri atılır; MongoDB her belgeye kendi _id'sini verir
  const docs = events.map(({ id, ...rest }) => rest);
  const { insertedCount } = await col.insertMany(docs);
  console.log(`${insertedCount} etkinlik eklendi.`);
} catch (err) {
  console.error("Seed başarısız:", err.message);
  process.exitCode = 1;
} finally {
  await closeDb();
}
