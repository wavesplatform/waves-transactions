module.exports = {
    roots: [
        '<rootDir>/test',
    ],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
    collectCoverage: true,
    globals: {
        'ts-jest': {
            diagnostics: false,
        },
    },
    preset: 'ts-jest',
    testMatch: null,
}