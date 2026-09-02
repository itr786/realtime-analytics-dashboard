type Metric = { name: string; value: number; unit: string; change?: number };

export function KpiGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
      {metrics.map((metric) => (
        <article key={metric.name} style={{ border: "1px solid #e5e7eb", borderRadius: 16, padding: 20, background: "#fff" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{metric.name}</span>
            {metric.change !== undefined && <span>{metric.change >= 0 ? "+" : ""}{metric.change}%</span>}
          </div>
          <strong style={{ display: "block", fontSize: 30, marginTop: 12 }}>{metric.value} {metric.unit}</strong>
        </article>
      ))}
    </section>
  );
}
