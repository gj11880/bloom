"use strict";
import * as crypto from "crypto"

const availableHashes = crypto.getHashes();

export class BloomFilter {
    private count: number = 0;
    private size: number = 0;
    private numberOfHashes: number;
    private secret: string = "whatevs, yo";
    private bits: number[]
    public hashFunctions: string[] = ["sha1", "sha256", "md5", "sha512", "whirlpool"];
    public hashSlice: number = 8;

    constructor(size: number, numberOfHashes = 5, secret: string = undefined) {
        this.size = size;
        this.numberOfHashes = numberOfHashes;
        this.hashFunctions = ["sha1", "sha256", "md5", "sha512", "whirlpool"];

        if (secret) {
            this.secret = secret;
        }

        this.reset();

        for (let i: number = 0; i < this.hashFunctions.length; i++) {
            if (availableHashes.indexOf(this.hashFunctions[i]) < 0) {
                console.warn(`Hash function ${this.hashFunctions[i]} is not available on this platform!`);
            }
        }
    }

    reset(): void {
        this.bits = Array(this.size);
        this.bits.fill(0);
    }

    length(): number {
        return this.count;
    }

    hexToInt(hexValue: string): number {
        return parseInt(hexValue, 16);
    }

    getOffsets(value: any): number[] {
        let offsets = [];

        for (let i = 0; i < this.numberOfHashes; i++) {
            if (availableHashes.indexOf(this.hashFunctions[i]) < 0) {
                continue;
            }
            const hash = crypto.createHmac(this.hashFunctions[i], this.secret)
                .update(value);
            const hex = hash.digest("hex").slice(0, this.hashSlice);
            offsets.push(this.hexToInt(hex));
        }

        return offsets;
    }

    add(value: any): void {
        let offsets = this.getOffsets(value);

        for (let i = 0; i < offsets.length; i++) {
            this.bits[offsets[i] % this.size] = 1;
        }
    }

    test(value: any): boolean {
        let offsets = this.getOffsets(value);

        for (let i = 0; i < offsets.length; i++) {
            if (this.bits[offsets[i] % this.size] !== 1) {
            return false;
            }
        }

        return true;
    }
}
