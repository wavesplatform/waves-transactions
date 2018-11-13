module.exports = {
    roots: [
        '<rootDir>/test',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    transform: {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    collectCoverage: true,
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