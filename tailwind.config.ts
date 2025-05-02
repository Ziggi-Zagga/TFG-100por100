export default {
  theme: {
    //linear-gradient(135deg, #22d3ee 0%, #6366f1 50%, #a21caf 100%)
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        brand: {
          50:  '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6', // base morado
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95'
        },
        gray: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827'
        },
        error: {
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626'
        },
        success: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669'
        }
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease-out'
      }
    }
  },
  plugins: [],
  content: [
    './src/**/*.{html,js,svelte,ts}'
  ]
}