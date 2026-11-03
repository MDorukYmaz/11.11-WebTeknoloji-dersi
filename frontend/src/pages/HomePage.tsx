import { Link } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import EventList from "../components/events/EventList";
import { toIso } from "../utils/format-date";

function HomePage() {
  const { events } = useEvents();
  const upcoming = [...events]
    .sort((a, b) => toIso(a.date).localeCompare(toIso(b.date)))
    .slice(0, 2);

  return (
    <>
      <h2 className="bolum-baslik">Yaklaşan 2 Etkinlik</h2>
      <EventList events={upcoming} emptyText="Henüz etkinlik yok." />
      <p>
        <Link className="buton" to="/events">Tüm etkinlikleri gör</Link>
      </p>
    </>
  );
}

export default HomePage;
