/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tx}"],
  theme: {
    extend: {
      colors: {
        "custom-gray": "#757575",
        "custom-black": "#1E1E1E",
        "rectangle-gray": "#B3B3B3",
      },
    },
  },
  plugins: [],
};
