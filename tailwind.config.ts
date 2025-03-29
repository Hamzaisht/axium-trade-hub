
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom Axium colors - use RGB format to enable opacity modifiers
				axium: {
					blue: 'rgb(var(--axium-blue-rgb) / <alpha-value>)',
					'blue-light': 'rgb(var(--axium-blue-light-rgb) / <alpha-value>)',
					'blue-dark': 'rgb(var(--axium-blue-dark-rgb) / <alpha-value>)',
					'dark-bg': 'rgb(var(--axium-dark-bg-rgb) / <alpha-value>)',
					'neon-blue': 'rgb(var(--axium-neon-blue-rgb) / <alpha-value>)',
					'neon-gold': 'rgb(var(--axium-neon-gold-rgb) / <alpha-value>)',
					'neon-mint': 'rgb(var(--axium-neon-mint-rgb) / <alpha-value>)',
					gray: {
						100: 'rgb(var(--axium-gray-100-rgb) / <alpha-value>)',
						200: 'rgb(var(--axium-gray-200-rgb) / <alpha-value>)',
						300: 'rgb(var(--axium-gray-300-rgb) / <alpha-value>)',
						400: 'rgb(var(--axium-gray-400-rgb) / <alpha-value>)',
						500: 'rgb(var(--axium-gray-500-rgb) / <alpha-value>)',
						600: 'rgb(var(--axium-gray-600-rgb) / <alpha-value>)',
						700: 'rgb(var(--axium-gray-700-rgb) / <alpha-value>)',
						800: 'rgb(var(--axium-gray-800-rgb) / <alpha-value>)',
						900: 'rgb(var(--axium-gray-900-rgb) / <alpha-value>)',
					},
					'success': 'rgb(var(--axium-success-rgb) / <alpha-value>)',
					'warning': 'rgb(var(--axium-warning-rgb) / <alpha-value>)',
					'error': 'rgb(var(--axium-error-rgb) / <alpha-value>)',
					'positive': 'rgb(var(--axium-positive-rgb) / <alpha-value>)',
					'negative': 'rgb(var(--axium-negative-rgb) / <alpha-value>)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			boxShadow: {
				'glass': 'var(--shadow-glass)',
				'glass-strong': 'var(--shadow-glass-strong)',
				'glass-blue': 'var(--shadow-glass-blue)',
				'button': 'var(--shadow-button)',
				'button-hover': 'var(--shadow-button-hover)',
				'glow': 'var(--shadow-glow)',
				'neon-gold': 'var(--shadow-neon-gold)',
				'neon-blue': 'var(--shadow-neon-blue)',
				'neon-mint': 'var(--shadow-neon-mint)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'float': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-5px)'
					}
				},
				'pulse-subtle': {
					'0%, 100%': {
						opacity: '1'
					},
					'50%': {
						opacity: '0.85'
					}
				},
				'slide-up': {
					'0%': {
						transform: 'translateY(10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-down': {
					'0%': {
						transform: 'translateY(-10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateY(0)',
						opacity: '1'
					}
				},
				'slide-left': {
					'0%': {
						transform: 'translateX(10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'slide-right': {
					'0%': {
						transform: 'translateX(-10px)',
						opacity: '0'
					},
					'100%': {
						transform: 'translateX(0)',
						opacity: '1'
					}
				},
				'ticker': {
					'0%': {
						transform: 'translateX(0)'
					},
					'100%': {
						transform: 'translateX(-100%)'
					}
				},
				'glow-pulse': {
					'0%': { 
						boxShadow: '0 0 5px rgba(30, 174, 219, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(30, 174, 219, 0.7)' 
					},
					'100%': { 
						boxShadow: '0 0 5px rgba(30, 174, 219, 0.5)' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'float': 'float 3s ease-in-out infinite',
				'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
				'slide-up': 'slide-up 0.3s ease-out',
				'slide-down': 'slide-down 0.3s ease-out',
				'slide-left': 'slide-left 0.3s ease-out',
				'slide-right': 'slide-right 0.3s ease-out',
				'ticker': 'ticker 30s linear infinite',
				'glow-pulse': 'glow-pulse 3s infinite'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
