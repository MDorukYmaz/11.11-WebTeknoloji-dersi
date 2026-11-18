import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { eventsCollection } from "../db.js";
import { Event } from "../models/event-model.js";

// MongoDB belgesi { _id, ... } -> API nesnesi { id, ... }
function toApi({ _id, ...rest }) {
  return { id: _id.toString(), ...rest };
}

// GET /events (?category=Atölye isteğe bağlı) -> 200, tarihe göre sıralı
export async function getEvents(req, res, next) {
  try {
    const filter = req.query.category ? { category: req.query.category } : {};
    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    next(err); // hata middleware'ine gider, sunucu çökmez
  }
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
