import unittest
import uuid

import app

class AppTestCase(unittest.TestCase):

    def setUp(self):
        self.app = app.app

    def test_uuid_generated(self):
        resp = self.app.test_client().get('/')
        assert uuid.UUID(resp.data)
