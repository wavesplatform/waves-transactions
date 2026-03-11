module.exports = {
    verbose: true,
    roots: [
        '<rootDir>/test'
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test))\\.tsx?$',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {diagnostics: false}]
    },
    testMatch: null,
    testEnvironment: 'node',
}
