const test = require("tape");

const bloom = require("../src/bloom.js");

test("Testing bloom", function(t) {
  t.plan(6);

  let bf = new bloom.BloomFilter(100);
  t.deepEqual(bf.bits, Array(100).fill(0));

  bf.add("Hello");
  t.equal(bf.bits.filter(v => v === 1).length, 5);

  bf.add("world");
  bf.add("HELLO, YES, THIS IS DOG");
  t.equal(bf.test("Hello"), true);
  t.equal(bf.test("world"), true);
  t.equal(bf.test("HELLO, YES, THIS IS DOG"), true);
  t.equal(bf.test("Welp"), false);
});
