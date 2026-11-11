import { events } from "../data/events.js";

const REQUIRED_FIELDS = ["title", "category", "date", "time", "location", "capacity"];

// GET /events -> 200
export function getEvents(req, res) {
  res.status(200).json(events);
}

// GET /events/:id -> 200 | 404
export function getEventById(req, res) {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: { message: "Event not found" } });
  }
  res.status(200).json(event);
}

// POST /events -> 201 | 400
export function createEvent(req, res) {
  const body = req.body ?? {};

  const missing = REQUIRED_FIELDS.filter(
    (field) => body[field] === undefined || String(body[field]).trim() === ""
  );
  if (missing.length > 0) {
    return res.status(400).json({
      error: { message: "Missing required fields", fields: missing },
    });
  }

  const capacity = Number(body.capacity);
  if (!Number.isInteger(capacity) || capacity <= 0) {
    return res.status(400).json({
      error: { message: "capacity must be a positive integer", fields: ["capacity"] },
    });
  }

  const newEvent = {
    id: `event-${Date.now()}`,
    title: String(body.title).trim(),
    category: String(body.category).trim(),
    date: String(body.date).trim(),
    time: String(body.time).trim(),
    location: String(body.location).trim(),
    description: body.description ? String(body.description).trim() : "",
    capacity,
  };

  events.push(newEvent);
  res.status(201).json(newEvent);
}
