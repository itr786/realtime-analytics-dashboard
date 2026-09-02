from dataclasses import dataclass
from datetime import datetime, timedelta
from statistics import mean


@dataclass(frozen=True)
class MetricPoint:
    timestamp: datetime
    value: float


def aggregate(points: list[MetricPoint]) -> dict[str, float]:
    if not points:
        return {"count": 0, "avg": 0.0, "min": 0.0, "max": 0.0}
    values = [point.value for point in points]
    return {
        "count": float(len(values)),
        "avg": round(mean(values), 2),
        "min": min(values),
        "max": max(values),
    }


def rolling_window(points: list[MetricPoint], minutes: int = 15) -> list[MetricPoint]:
    if not points:
        return []
    cutoff = max(point.timestamp for point in points) - timedelta(minutes=minutes)
    return [point for point in points if point.timestamp >= cutoff]
