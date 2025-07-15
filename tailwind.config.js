/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Custom color scheme from PRD
        'primary': '#000000',      // Pure black for text and primary elements
        'background': '#FFFFFF',   // Pure white backgrounds
        'accent': '#A855F7',       // Bright light purple for highlights and interactive elements
        'gray-light': '#F3F4F6',   // Light gray for subtle backgrounds
        'gray-medium': '#9CA3AF'   // Medium gray for secondary text
      },
      fontFamily: {
        'sans': ['DM Sans', 'sans-serif'],     // Primary font for body text
        'heading': ['Plus Jakarta Sans', 'sans-serif']  // Secondary font for headings
      },
      fontWeight: {
        'regular': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700'
      },
      borderRadius: {
        'card': '12px',    // For cards
        'button': '8px',   // For buttons
        'input': '6px'     // For inputs
      },
      spacing: {
        '44': '11rem'      // For minimum touch targets (44px)
      },
      maxWidth: {
        'mobile': '414px'  // Mobile-first max width
      },
      boxShadow: {
        'none': 'none'     // Completely flat design
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class'
    })
  ]
}