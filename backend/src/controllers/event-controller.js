import { ObjectId } from "mongodb";
import { eventsCollection } from "../db.js";

// MongoDB belgesi { _id, ... } -> API nesnesi { id, ... }
function toApi({ _id, ...rest }) {
  return { id: _id.toString(), ...rest };
}

// GET /events (?category=Atölye isteğe bağlı) -> 200
export async function getEvents(req, res) {
  const { category } = req.query;
  const filter = category ? { category } : {};
  const list = await eventsCollection().find(filter).sort({ date: 1 }).toArray();
  res.status(200).json(list.map(toApi));
}

// GET /events/:id -> 200 | 404
export async function getEventById(req, res) {
  const { id } = req.params;
  // geçersiz ObjectId biçimi de "bulunamadı" sayılır
  const event = ObjectId.isValid(id)
    ? await eventsCollection().findOne({ _id: new ObjectId(id) })
    : null;

  if (!event) {
    return res.status(404).json({ error: { message: "Event not found" } });
  }
  res.status(200).json(toApi(event));
}

// POST /events -> 201 | 400
export async function createEvent(req, res) {
  const { title, category, capacity, date, time, location, description } =
    req.body ?? {};

  if (!title || !category || !date) {
    return res
      .status(400)
      .json({ error: { message: "title, category and date are required" } });
  }

  const newEvent = {
    title,
    category,
    capacity: Number(capacity) || 0,
    date,
    time: time ?? "",
    location: location ?? "",
    description: description ?? "",
  };

  const { insertedId } = await eventsCollection().insertOne(newEvent);
  res.status(201).json(toApi({ _id: insertedId, ...newEvent }));
}
