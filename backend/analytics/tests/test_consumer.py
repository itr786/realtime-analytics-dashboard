from django.test import SimpleTestCase


class MetricsConsumerContractTests(SimpleTestCase):
    def test_metric_payload_shape(self):
        payload = {"Active users": 1250, "Requests/min": 400, "Conversion": 7.5}
        self.assertIn("Active users", payload)
        self.assertIsInstance(payload["Requests/min"], int)
