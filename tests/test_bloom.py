import unittest

from src import bloom


class BloomFilterTestCase(unittest.TestCase):
    def test_reset(self):
        bf = bloom.BloomFilter(100)
        self.assertEqual(bf._bits, [0 for i in range(100)])

    def test_add(self):
        bf = bloom.BloomFilter(100)
        bf.add("Hello")
        self.assertEqual(len([1 for bit in bf._bits if bit]), 5)

    def test_contains(self):
        bf = bloom.BloomFilter(100)
        bf.add("Hello")
        bf.add("world")
        bf.add("HELLO, YES, THIS IS DOG")

        self.assertTrue("Hello" in bf)
        self.assertTrue("world" in bf)
        self.assertTrue("HELLO, YES, THIS IS DOG" in bf)
        self.assertFalse("Welp" in bf)
