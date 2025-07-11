 const nextJest = require("next/jest");

 const createJestConfig = nextJest({
   // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
   dir: "./",
 });

 // Add any custom config to be passed to Jest
 const customJestConfig = {
   setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
   testEnvironment: "jest-environment-jsdom",
   moduleNameMapper: {
     "^@/components/(.*)$": "<rootDir>/components/$1",
     "^@/lib/(.*)$": "<rootDir>/lib/$1",
     "^@/models/(.*)$": "<rootDir>/models/$1",
   },
   testMatch: ["**/__tests__/**/*.test.js"],
   collectCoverage: true,
   collectCoverageFrom: [
     "components/**/*.js",
     "lib/**/*.js",
     "models/**/*.js",
     "!**/node_modules/**",
   ],
 };

 // createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
 module.exports = createJestConfig(customJestConfig);