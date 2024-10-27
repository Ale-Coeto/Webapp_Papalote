import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors : {
        'verde': {
          DEFAULT: '#12D354',
          200: '#2DEA6D',
        },
        'gris': '#74787A',
        'fondo': '#F4FAFE',
        'texto': '#444444',
        'azul': {
          DEFAULT: '#36B4FE',
          200: '#66C6FF',
        }
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  plugins: [],
} satisfies Config;
