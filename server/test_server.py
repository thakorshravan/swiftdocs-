import unittest
from app import app

class ServerTestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_endpoint(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data['status'], 'healthy')
        self.assertIn('pdf-to-word', data['supported_tools'])

    def test_missing_file_convert(self):
        response = self.app.post('/api/convert/pdf-to-word')
        self.assertEqual(response.status_code, 400)

if __name__ == '__main__':
    unittest.main()
