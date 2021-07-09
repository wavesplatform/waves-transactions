module.exports = {
    verbose: true,
    roots: [
        '<rootDir>/test',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    collectCoverage: true,
    coverageReporters: [
        "json-summary",
        "text",
        "lcov"
    ],
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
    preset: 'ts-jest',
    testMatch: null,
    testEnvironment: 'node',
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ]
}
