export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: { paper: "#faf7f0", ink: "#1c1b19", gain: "#1f7a4d", loss: "#d94f30" },
      fontFamily: { serif: ['"Instrument Serif"', "Georgia", "serif"], sans: ["Inter", "system-ui", "sans-serif"], mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"] },
    },
  },
  plugins: [],
};
