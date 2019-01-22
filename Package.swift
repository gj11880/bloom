// swift-tools-version:4.0
import PackageDescription

let excludes = [
    "README.md",
    "LICENSE",

    "src/*.py",
    "src/*.js",
    "src/*.ts",

    "tests",

    "Pipfile",
    "Pipfile.lock",
    ".mypy_cache",
    ".pytest_cache",

    "package.json",
    "package-lock.json"
    "tsconfig.json",
    "jest.config.json",
    "node_modules",

    ".gitignore",
]

let package = Package(
    name: "Bloom",
    products: [
        .library(name: "Bloom", targets: ["Bloom"]),
    ],
    dependencies: [
        .package(url: "https://github.com/IBM-Swift/BlueCryptor.git", from: "1.0.23")
    ],
    targets: [
        .target(
            name: "Bloom",
            dependencies: ["BlueCryptor"],
            exclude: excludes),
        .testTarget(
            name: "Bloom",
            dependencies: ["Bloom"]),
    ]
)
