import type { Config } from 'tailwindcss' // Import kiểu "Config"

const config: Config = { // Áp dụng kiểu "Config"
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './public/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'footer-bg': '#6d968a', 
    },
  },
  plugins: [],
}
}

export default config 