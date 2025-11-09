// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,
        environment: "jsdom",
        setupFiles: ["test/setup.js"],
        // Evita cuelgues por workers en Vitest v3
        pool: "forks",
        hookTimeout: 30000,
        teardownTimeout: 15000,
        clearMocks: true,
        restoreMocks: true,
        unstubGlobals: true,
        coverage: {
            provider: "v8",
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.{js,jsx}"],
            exclude: [
                "**/node_modules/**",
                "**/dist/**",
                "**/__tests__/**",
                "**/*.test.*",
                // pantallas/UI que no medís aún
                "src/Screens/ProductsScreen.jsx",
                "src/Components/CartDrawer.jsx",
                "src/Components/Navbar.jsx",
                "src/Screens/Shop.jsx",
                "src/store/products/**",
                "src/api/favourites.js",
                "src/routes/Layout.jsx",
            ],
            all: true,
            cleanOnRerun: true,
            thresholds: { lines: 0, statements: 0, branches: 0, functions: 0 },
        },
    },
});
