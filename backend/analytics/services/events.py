from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(frozen=True)
class MetricEvent:
    metric: str
    value: float
    timestamp: str


def normalize_event(metric: str, value: float, timestamp: datetime | None = None) -> dict:
    if not metric.strip():
        raise ValueError("metric is required")
    if value != value or value in (float("inf"), float("-inf")):
        raise ValueError("value must be finite")
    ts = timestamp or datetime.now(timezone.utc)
    return {"metric": metric.strip(), "value": float(value), "timestamp": ts.isoformat()}
