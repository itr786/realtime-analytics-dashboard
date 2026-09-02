"use client";

import { useEffect, useState } from "react";
import { EventFeed } from "../components/EventFeed";
import { KpiGrid } from "../components/KpiGrid";

type Metric = { name: string; value: number; unit: string; change?: number };
type EventItem = { id: string; metric: string; value: number; timestamp: string };

const initial: Metric[] = [
  { name: "Active users", value: 1248, unit: "users", change: 8.2 },
  { name: "Requests/min", value: 386, unit: "req", change: 4.7 },
  { name: "Conversion", value: 7.4, unit: "%", change: -1.1 },
  { name: "P95 latency", value: 182, unit: "ms", change: -6.4 },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState(initial);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/metrics/";
    let socket: WebSocket | undefined;
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    const connect = () => {
      if (stopped) return;
      socket = new WebSocket(url);
      socket.onopen = () => setConnected(true);
      socket.onclose = () => {
        setConnected(false);
        timer = setTimeout(connect, 2000);
      };
      socket.onmessage = (event) => {
        try {
          const update = JSON.parse(event.data) as Partial<Record<string, number>>;
          const timestamp = new Date().toISOString();
          setMetrics((current) => current.map((metric) => ({ ...metric, value: update[metric.name] ?? metric.value })));
          const changed = Object.entries(update)[0];
          if (changed) setEvents((current) => [{ id: `${timestamp}-${changed[0]}`, metric: changed[0], value: changed[1] ?? 0, timestamp }, ...current].slice(0, 12));
        } catch {
          // Ignore malformed realtime frames without taking down the dashboard.
        }
      };
    };

    connect();
    return () => { stopped = true; socket?.close(); clearTimeout(timer); };
  }, []);

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px", fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", marginBottom: 28 }}>
        <div><p style={{ margin: 0, fontSize: 13 }}>OPERATIONS / LIVE MONITOR</p><h1 style={{ fontSize: 38, margin: "8px 0" }}>Realtime Analytics</h1><p style={{ margin: 0 }}>Monitor product activity as it happens.</p></div>
        <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "8px 14px" }}>● {connected ? "Live" : "Reconnecting"}</span>
      </header>
      <KpiGrid metrics={metrics} />
      <section style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 16 }}>
        <article style={{ minHeight: 280, border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "#fff" }}>
          <h2>Traffic overview</h2>
          <div style={{ height: 190, display: "flex", alignItems: "end", gap: 8, marginTop: 20 }}>
            {[42, 58, 51, 74, 68, 82, 77, 94, 86, 100, 91, 96].map((height, index) => <div key={index} style={{ flex: 1, height: `${height}%`, borderRadius: "8px 8px 2px 2px", background: "currentColor", opacity: 0.15 + index * 0.035 }} />)}
          </div>
        </article>
        <EventFeed events={events} />
      </section>
    </main>
  );
}
