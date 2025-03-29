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
				border: 'rgb(var(--border) / <alpha-value>)',
				input: 'rgb(var(--input) / <alpha-value>)',
				ring: 'rgb(var(--ring) / <alpha-value>)',
				background: 'rgb(var(--background) / <alpha-value>)',
				foreground: 'rgb(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'rgb(var(--primary) / <alpha-value>)',
					foreground: 'rgb(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'rgb(var(--secondary) / <alpha-value>)',
					foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'rgb(var(--destructive) / <alpha-value>)',
					foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'rgb(var(--muted) / <alpha-value>)',
					foreground: 'rgb(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
					foreground: 'rgb(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'rgb(var(--popover) / <alpha-value>)',
					foreground: 'rgb(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'rgb(var(--card) / <alpha-value>)',
					foreground: 'rgb(var(--card-foreground) / <alpha-value>)'
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
					'neon-magenta': 'rgb(var(--axium-neon-magenta-rgb) / <alpha-value>)',
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
				'neon-magenta': 'var(--shadow-neon-magenta)',
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
						boxShadow: '0 0 5px rgba(0, 207, 255, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(0, 207, 255, 0.7)' 
					},
					'100%': { 
						boxShadow: '0 0 5px rgba(0, 207, 255, 0.5)' 
					}
				},
				'neon-pulse': {
					'0%': { 
						boxShadow: '0 0 5px rgba(0, 255, 208, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(0, 255, 208, 0.7)' 
					},
					'100%': { 
						boxShadow: '0 0 5px rgba(0, 255, 208, 0.5)' 
					}
				},
				'gold-pulse': {
					'0%': { 
						boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(255, 215, 0, 0.7)' 
					},
					'100%': { 
						boxShadow: '0 0 5px rgba(255, 215, 0, 0.5)' 
					}
				},
				'magenta-pulse': {
					'0%': { 
						boxShadow: '0 0 5px rgba(227, 78, 255, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(227, 78, 255, 0.7)' 
					},
					'100%': { 
						boxShadow: '0 0 5px rgba(227, 78, 255, 0.5)' 
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
				'glow-pulse': 'glow-pulse 3s infinite',
				'neon-pulse': 'neon-pulse 3s infinite',
				'gold-pulse': 'gold-pulse 3s infinite',
				'magenta-pulse': 'magenta-pulse 3s infinite'
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
				'futuristic-grid': 'linear-gradient(to right, rgba(0, 207, 255, 0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 207, 255, 0.07) 1px, transparent 1px)',
				'tesla-gradient': 'linear-gradient(135deg, rgba(0, 207, 255, 0.05) 0%, rgba(0, 255, 208, 0.05) 100%)',
				'blade-runner-gradient': 'linear-gradient(to right, rgba(227, 78, 255, 0.1) 0%, rgba(0, 207, 255, 0.1) 100%)',
			},
			typography: {
				DEFAULT: {
					css: {
						maxWidth: '100ch',
						color: 'hsl(var(--foreground))',
						'h1, h2, h3, h4, h5, h6': {
							color: 'hsl(var(--foreground))',
							fontWeight: '700',
						},
						a: {
							color: 'hsl(var(--primary))',
							'&:hover': {
								color: 'hsl(var(--primary))',
							},
						},
						strong: {
							color: 'hsl(var(--foreground))',
						},
					},
				},
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
