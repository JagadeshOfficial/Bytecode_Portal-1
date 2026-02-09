/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-geist-sans)", "sans-serif"],
                mono: ["var(--font-geist-mono)", "monospace"],
                display: ["var(--font-outfit)", "sans-serif"],
                body: ["var(--font-inter)", "sans-serif"],
            },
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                // Quantum Verse Palette
                "void": "#030014",     // Deepest background
                "space": "#0f0728",    // Secondary background
                "violet-glow": "#7c3aed",
                "cyan-laser": "#22d3ee",
                "magenta-neon": "#d946ef",
                "glass-border": "rgba(255, 255, 255, 0.08)",
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "quantum-gradient": "linear-gradient(135deg, #030014 0%, #0f0728 100%)",
                "hero-glow": "conic-gradient(from 180deg at 50% 50%, #2a8af6 0deg, #a853ba 180deg, #e92a67 360deg)",
            },
            boxShadow: {
                "neon": "0 0 20px rgba(124, 58, 237, 0.5)",
                "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            },
            animation: {
                "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
                "float": "float 6s ease-in-out infinite",
                "shimmer": "shimmer 2s linear infinite",
            },
            keyframes: {
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200%" },
                    "100%": { backgroundPosition: "200%" },
                },
            },
        },
    },
    plugins: [],
};
