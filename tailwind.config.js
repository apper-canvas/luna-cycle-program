/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9C6FDE',
        secondary: '#F5A5C8', 
        accent: '#6B46C1',
        surface: '#FBF7FF',
        success: '#4CAF50',
        warning: '#FF9800',
        error: '#F44336',
        info: '#2196F3',
        surface: {
          50: '#FBF7FF',
          100: '#F3E8FF',
          200: '#E9D5FF',
          300: '#D8B4FE',
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          700: '#7C3AED',
          800: '#6B46C1',
          900: '#553C9A'
        }
      },
      fontFamily: {
        display: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui'],
        body: ['Inter', 'ui-sans-serif', 'system-ui'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
        heading: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #9C6FDE 0%, #F5A5C8 100%)',
        'gradient-card': 'linear-gradient(135deg, #FBF7FF 0%, #F3E8FF 100%)',
        'gradient-button': 'linear-gradient(135deg, #9C6FDE 0%, #6B46C1 100%)'
      }
    },
  },
  plugins: [],
}