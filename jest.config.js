module.exports = {
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleFileExtensions: [
        'ts',
        'tsx',
        'js',
        'jsx',
        'json',
        'node',
    ],
    testRegex: '(/test/.*|(\\.|/)(test|spec))\\.(ts|js)x?$',
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'src/**/*.{ts,tsx,js,jsx}',
        '!src/**/*.d.ts',
    ],
    setupTestFrameworkScriptFile: "./jest.enzyme.js",
};
