type EventItem = { id: string; metric: string; value: number; timestamp: string };

export function EventFeed({ events }: { events: EventItem[] }) {
  return (
    <section style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "#fff" }}>
      <h2>Live events</h2>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {events.length === 0 ? <p>No events received yet.</p> : events.map((event) => (
          <div key={event.id} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #eee", paddingBottom: 10 }}>
            <span>{event.metric}</span>
            <strong>{event.value}</strong>
            <small>{new Date(event.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
    </section>
  );
}
