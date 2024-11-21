import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./", // Path ke Next.js app untuk membaca next.config.js dan file .env
});

const customJestConfig: Config = {
  // Gunakan v8 sebagai coverage provider
  coverageProvider: "v8",
  // Gunakan jsdom sebagai test environment
  testEnvironment: "jsdom",
  // Path alias (opsional jika digunakan di proyek Anda)
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^~/(.*)$": "<rootDir>/$1",
    // Mock untuk file statis
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(gif|ttf|eot|svg|png)$": "<rootDir>/__mocks__/fileMock.ts",
  },
  // File setup untuk Jest sebelum setiap pengujian
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  // Direktori yang diabaikan saat menjalankan tes
  testPathIgnorePatterns: ["<rootDir>/node_modules/", "<rootDir>/.next/"],
  // Aturan transform untuk mendukung TypeScript
  transform: {
    "^.+\\.(ts|tsx)$": "babel-jest",
  },
};

// Ekspor konfigurasi
export default createJestConfig(customJestConfig);
