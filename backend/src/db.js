import { MongoClient } from "mongodb";

let client;
let db;

// Sunucu açılırken bir kez çağrılır; bağlantı yoksa hata fırlatır
export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI .env içinde tanımlı değil");

  client = new MongoClient(uri);
  await client.connect();
  db = client.db(); // veritabanı adı URI'deki /kampus kısmından gelir
  console.log(`MongoDB bağlandı: ${db.databaseName}`);
  return db;
}

export function eventsCollection() {
  if (!db) throw new Error("Önce connectDb() çağrılmalı");
  return db.collection("events");
}

export async function closeDb() {
  await client?.close();
}
