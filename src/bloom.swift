import Cryptor

class BloomFilter {
    private count = 0
    private size = 0
    private numberOfHashes: Int
    private secret: String = "whatevs, yo"
    private bits = [Int]()
    public hashFunctions = ["sha1", "sha256", "md5"]
    public hashSlice = 8

    init(size: Int, numberOfHashes: Int? = 3, secret: String?) {
        self.size = size

        if(numberOfHashes) {
            self.numberOfHashes = numberOfHashes
        }

        if (secret) {
            self.secret = secret
        }

        self.reset()
    }

    reset(): void {
        self.bits = Array(repeating: 0, count: self.size)
    }

    length(): number {
        return self.count
    }

    hexToInt(hexValue: String): Int {
        return Int(hexValue, radix: 16)
    }

    createHash(hashName: String, value: any) {
        let digest: String

        switch hashName {
        case "sha1":
            let hmac = HMAC(using: HMAC.Algorithm.sha1, key: self.secret)
            hmac.update(string: value)
            digest = hmac.final()
        case "sha256":
            let hmac = HMAC(using: HMAC.Algorithm.sha256, key: self.secret)
            hmac.update(string: value)
            digest = hmac.final()
        case "md5":
        default:
            let md5 = Digest(using: .md5)
            md5.update(string: value)
            digest = md5.final()
        }

        return digest
    }

    getOffsets(value: any): number[] {
        let offsets = []

        for i in 0...self.numberOfHashes {
            let hex = self.createHash(self.hashFunctions[i], value)
            hex = String(hex[0..self.hashSlice])
            offsets.append(self.hexToInt(hex))
        }

        return offsets
    }

    add(value: any): void {
        let offsets = self.getOffsets(value)

        for offset in offsets {
            self.bits[offset % self.size] = 1
        }

        self.count += 1
    }

    test(value: any): boolean {
        let offsets = self.getOffsets(value)

        for offset in offsets {
            if (self.bits[offset % self.size] !== 1) {
                return false
            }
        }

        return true
    }
}
