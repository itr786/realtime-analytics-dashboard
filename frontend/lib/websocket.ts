export type SocketState = "connecting" | "connected" | "reconnecting" | "closed";

export function createMetricSocket(
  url: string,
  onMessage: (payload: unknown) => void,
  onState: (state: SocketState) => void,
) {
  let socket: WebSocket | undefined;
  let retryTimer: ReturnType<typeof setTimeout> | undefined;
  let stopped = false;
  let delay = 1000;

  const connect = () => {
    if (stopped) return;
    onState(delay === 1000 ? "connecting" : "reconnecting");
    socket = new WebSocket(url);
    socket.onopen = () => { delay = 1000; onState("connected"); };
    socket.onmessage = (event) => {
      try { onMessage(JSON.parse(event.data)); } catch { /* ignore malformed frames */ }
    };
    socket.onclose = () => {
      if (stopped) return;
      onState("reconnecting");
      retryTimer = setTimeout(connect, delay);
      delay = Math.min(delay * 2, 10000);
    };
  };

  connect();
  return () => {
    stopped = true;
    if (retryTimer) clearTimeout(retryTimer);
    socket?.close();
    onState("closed");
  };
}
