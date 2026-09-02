export function ConnectionBadge({ connected }: { connected: boolean }) {
  return (
    <span style={{ border: "1px solid #ddd", borderRadius: 999, padding: "8px 14px", fontSize: 13 }}>
      <span aria-hidden>●</span> {connected ? "Live stream" : "Reconnecting"}
    </span>
  );
}
