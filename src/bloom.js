"use strict";
const crypto = require("crypto");

const availableHashes = crypto.getHashes();

class BloomFilter {
  constructor(size, numberOfHashes = 5, secret = undefined) {
    this._count = 0;
    this._size = size;
    this._numberOfHashes = numberOfHashes;
    this._secret = secret || "whatevs, yo";
    this.hashFunctions = ["sha1", "sha256", "md5", "sha512", "whirlpool"];
    this.hashSlice = 8;
    this.reset();

    for (let i = 0; i < this.hashFunctions.length; i++) {
      if (availableHashes.indexOf(this.hashFunctions[i]) < 0) {
        console.warn(
          `Hash function ${
            this.hashFunctions[i]
          } is not available on this platform!`
        );
      }
    }
  }

  reset() {
    this.bits = Array(this._size);
    this.bits.fill(0);
  }

  length() {
    return this._count;
  }

  hexToInt(hexValue) {
    return parseInt(hexValue, 16);
  }

  getOffsets(value) {
    let offsets = [];

    for (let i = 0; i < this._numberOfHashes; i++) {
      if (availableHashes.indexOf(this.hashFunctions[i]) < 0) {
        continue;
      }
      const hash = crypto
        .createHmac(this.hashFunctions[i], this._secret)
        .update(value);
      const hex = hash.digest("hex").slice(0, this.hashSlice);
      offsets.push(this.hexToInt(hex));
    }

    return offsets;
  }

  add(value) {
    let offsets = this.getOffsets(value);

    for (let i = 0; i < offsets.length; i++) {
      this.bits[offsets[i] % this._size] = 1;
    }
  }

  test(value) {
    let offsets = this.getOffsets(value);

    for (let i = 0; i < offsets.length; i++) {
      if (this.bits[offsets[i] % this._size] !== 1) {
        return false;
      }
    }

    return true;
  }
}

module.exports.BloomFilter = BloomFilter;
