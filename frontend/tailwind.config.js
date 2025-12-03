/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {fontFamily: {
      sans: [
        'ui-sans-serif',
        'system-ui',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ],
    },
    colors: {
      primary : {
        50 : "#F0F6FE",
        100 : "#DDEAFC",
        200 : "#C3DBFA",
        300 : "#99C6F7",
        400 : "#69A7F1",
        500 : "#4686EB",
        600 : "#3C71E1",
        700 : "#2854CD",
        800 : "#2746A6",
        900 : "#243E84",
        950 : "#1B2750",
      },
      gray: {
        50 : "#F9FAFB",
        100 : "#F3F4F6",
        200 : "#E5E7EB",
        300 : "#D1D5DB",
        400 : "#9CA3AF",
        500 : "#6B7280",
        600 : "#4B5563",
        700 : "#374151",
        800 : "#1F2937",
        900 : "#111827",
        950 : "#030712",
      },

      slate: {
        50 : "#F8FAFC",
        100 : "#F1F5F9",
        200 : "#E2E8F0",
        300 : "#CBD5E1",
        400 : "#94A3B8",
        500 : "#64748B",
        600 : "#475569",
        700 : "#334155",
        800 : "#1E293B",
        900 : "#0F172A",
        950 : "#020617",
      },
      neutral: {
        50 : "#FAFAFA",
        100 : "#F5F5F5",
        200 : "#E5E5E5",
        300 : "#D4D4D4",
        400 : "#A3A3A3",
        500 : "#737373",
        600 : "#525252",
        700 : "#404040",
        800 : "#262626",
        900 : "#171717",
        950 : "#0A0A0A",
      },
      error: {
        50 : "#FEF3F2",
        300 : "#FDA29B",
        500 : "#F04438",
      },

      brand: {
        300 : "#D6BBFB",
        600 : "#7F56D9",
      },
      purple: {
        50 : "#F4F3FF",
        700 : "#5925DC",
      },
      success: {
        50 : "#ECFDF3",
        700 : "#027A48",
      },

      card : {
        greenBg : "#D0FFC2B2",
        greenBorder : "#61E13D",

        yellowBg : "#FFFEED",
        yellowBorder : "#E1D93D",

        orangeBg : "#FFF9ED",
        orangeBorder : "#EB6A00",

        redBg : "#FFEDED",
        redBorder : "#E1503D",

        blackBg : "#F6F6F6",
        blackBorder : "#000000",

        blueBg : "#EDF2FF",
      }



      // light: {
      //   background: '#ffffff',
      //   text: '#000000',
      //   primary: '#3C71E1',
      //   secondary: '#6B7280',
      // },
      // dark: {
      //   background: '#111827',
      //   text: '#ffffff',
      //   primary: '#9CA3AF',
      //   secondary: '#D1D5DB',
      // },
    },
  },
  
  },
  plugins: []
};
