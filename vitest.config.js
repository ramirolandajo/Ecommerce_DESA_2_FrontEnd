// vitest.config.js
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
    plugins: [react()],
    test: {
        globals: true,        // para usar describe, it, expect sin importar
        environment: "jsdom",  // Necesario para pruebas que interactúan con el DOM
        setupFiles: ['test/setup.js'],
        coverage: {
            provider: "v8",     // motor de coverage
            reporter: ["text", "html", "lcov"],
            reportsDirectory: "./coverage",
            include: ["src/**/*.{js,jsx}"],
            exclude: [
                "**/node_modules/**",
                "**/dist/**",
                "**/__tests__/**",
                "**/*.test.*",
                // Excluir pantallas/admin no cubiertas aún o UI de 3ros compleja
                "src/Screens/ProductsScreen.jsx",
                "src/Components/CartDrawer.jsx",
                "src/Components/Navbar.jsx",
                "src/Screens/Shop.jsx",
                "src/store/products/**",
                "src/api/favourites.js",
                "src/routes/Layout.jsx",
            ],
            all: true,                 // reporta TODOS los archivos, aunque no tengan tests
            cleanOnRerun: true,        // limpia reporte entre corridas
            thresholds: {              // no fallar por umbrales por ahora
                lines: 0,
                statements: 0,
                branches: 0,
                functions: 0,
            },
        },
    },
});
