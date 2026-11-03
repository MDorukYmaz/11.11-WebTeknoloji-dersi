import { Link } from "react-router-dom";
import type { CampusEvent } from "../../types/campus-event";
import { formatDate } from "../../utils/format-date";

interface EventDetailProps {
  event: CampusEvent;
}

function EventDetail({ event }: EventDetailProps) {
  return (
    <article>
      <div className="detay">
        {event.image && (
          <figure>
            <img src={event.image} alt={`${event.title} afişi`} width={400} height={200} />
            <figcaption><em>{event.title} afişi</em></figcaption>
          </figure>
        )}

        <dl>
          <dt>Tarih</dt>
          <dd>{formatDate(event.date)}, {event.time}</dd>
          <dt>Yer</dt>
          <dd>{event.location}</dd>
          <dt>Kategori</dt>
          <dd>{event.category}</dd>
          <dt>Kontenjan</dt>
          <dd>{event.capacity} kişi</dd>
        </dl>
      </div>

      <h2>Açıklama</h2>
      <p>{event.description}</p>

      <Link className="buton" to="/events">← Listeye dön</Link>{" "}
      <Link className="buton" to={`/admin/${event.id}/edit`}>Güncelle</Link>
    </article>
  );
}

export default EventDetail;
