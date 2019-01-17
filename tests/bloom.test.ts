import * as bloom from "../src/bloom";

test("Testing bloom TS", () => {
    let bf = new bloom.BloomFilter(100);
    bf.add("Hello");
    bf.add("world");
    bf.add("HELLO, YES, THIS IS DOG");

    expect(bf.test("Hello")).toBe(true);
    expect(bf.test("world")).toBe(true);
    expect(bf.test("HELLO, YES, THIS IS DOG")).toBe(true);
    expect(bf.test("Welp")).toBe(false);
});
