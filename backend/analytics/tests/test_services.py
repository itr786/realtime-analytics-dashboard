from datetime import datetime, timedelta, timezone

from django.test import SimpleTestCase

from analytics.services.events import normalize_event
from analytics.services.metrics import MetricPoint, aggregate, rolling_window


class AnalyticsServiceTests(SimpleTestCase):
    def test_aggregate_returns_summary_statistics(self):
        points = [MetricPoint(datetime.now(timezone.utc), 10), MetricPoint(datetime.now(timezone.utc), 20)]
        self.assertEqual(aggregate(points)["avg"], 15)
        self.assertEqual(aggregate(points)["max"], 20)

    def test_rolling_window_discards_old_points(self):
        now = datetime.now(timezone.utc)
        points = [MetricPoint(now - timedelta(minutes=30), 1), MetricPoint(now, 2)]
        self.assertEqual(len(rolling_window(points, minutes=15)), 1)

    def test_event_is_normalized(self):
        event = normalize_event("Active users", 1250)
        self.assertEqual(event["metric"], "Active users")
        self.assertEqual(event["value"], 1250.0)
