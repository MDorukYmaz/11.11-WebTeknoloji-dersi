import mongoose from "mongoose";

// Sunucu ve seed açılırken bir kez çağrılır; bağlanamazsa hata fırlatır
export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI tanımlı değil");
  }

  await mongoose.connect(uri);

  // uri içinde şifre var: asla yazdırma, sadece host ve veritabanı adı
  const { host, name } = mongoose.connection;
  const yer = uri.startsWith("mongodb+srv://") ? "Atlas" : "yerel";
  console.log(`MongoDB bağlandı (${yer}): ${host}/${name}`);
}
