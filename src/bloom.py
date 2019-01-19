import datetime
import decimal
import hashlib
import time


class BloomFilter(object):
    hash_functions = [
        hashlib.sha1,
        hashlib.sha256,
        hashlib.md5,
        hashlib.blake2b,
        hashlib.blake2s,
    ]
    # This allows for 4+ billion integers.
    hash_slice = 8

    def __init__(self, size, number_of_hashes=5):
        self._count = 0
        self._size = size
        self._num_hashes = number_of_hashes
        self.reset()

    def __len__(self):
        return self._count

    def reset(self):
        self._bits = [0 for i in range(self._size)]

    def _hex_to_int(self, value):
        return int(value, 16)

    def _to_bytes(self, value):
        if isinstance(value, str):
            return value.encode("utf-8")
        elif isinstance(value, decimal.Decimal):
            return str(value).encode("utf-8")
        elif isinstance(value, [datetime.datetime, datetime.date]):
            return time.mktime(value.utctimetuple())

        return value

    def _get_offsets(self, value):
        offsets = []
        bytes_value = self._to_bytes(value)

        for i in range(self._num_hashes):
            fn = self.hash_functions[i]
            result = fn(bytes_value).hexdigest()[: self.hash_slice]
            offsets.append(self._hex_to_int(result))

        return offsets

    def add(self, value):
        offsets = self._get_offsets(value)

        for offset in offsets:
            actual_offset = offset % self._size
            self._bits[actual_offset] = 1

        self._count += 1

    def __contains__(self, value):
        offsets = self._get_offsets(value)

        for offset in offsets:
            actual_offset = offset % self._size

            if self._bits[actual_offset] != 1:
                return False

        return True
