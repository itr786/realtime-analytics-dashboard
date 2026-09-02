"use client";

import { useEffect, useState } from "react";

type Metric = { name: string; value: number; unit: string };

const initial: Metric[] = [
  { name: "Active users", value: 1248, unit: "users" },
  { name: "Requests/min", value: 386, unit: "req" },
  { name: "Conversion", value: 7.4, unit: "%" },
];

export default function Dashboard() {
  const [metrics, setMetrics] = useState(initial);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8000/ws/metrics/";
    let socket: WebSocket | undefined;
    let timer: ReturnType<typeof setTimeout>;

    const connect = () => {
      socket = new WebSocket(url);
      socket.onopen = () => setConnected(true);
      socket.onclose = () => {
        setConnected(false);
        timer = setTimeout(connect, 2000);
      };
      socket.onmessage = (event) => {
        const update = JSON.parse(event.data) as Partial<Record<string, number>>;
        setMetrics((current) => current.map((metric) => ({ ...metric, value: update[metric.name] ?? metric.value })));
      };
    };

    connect();
    return () => { socket?.close(); clearTimeout(timer); };
  }, []);

  return (
    <main style={{ maxWidth: 1000, margin: "40px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Realtime Analytics</h1>
      <p>WebSocket: {connected ? "connected" : "reconnecting"}</p>
      <section style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        {metrics.map((metric) => <article key={metric.name} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 20 }}>
          <small>{metric.name}</small><h2>{metric.value} {metric.unit}</h2>
        </article>)}
      </section>
    </main>
  );
}
