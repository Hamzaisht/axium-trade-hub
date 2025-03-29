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
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				accent: 'hsl(var(--accent) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background) / <alpha-value>)',
					foreground: 'hsl(var(--sidebar-foreground) / <alpha-value>)',
					primary: 'hsl(var(--sidebar-primary) / <alpha-value>)',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground) / <alpha-value>)',
					accent: 'hsl(var(--sidebar-accent) / <alpha-value>)',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground) / <alpha-value>)',
					border: 'hsl(var(--sidebar-border) / <alpha-value>)',
					ring: 'hsl(var(--sidebar-ring) / <alpha-value>)'
				},
				// Custom Axium colors
				axium: {
					blue: '#0050FF',
					'blue-light': '#3B82F6',
					'blue-dark': '#1E3A8A',
					gray: {
						100: '#F8F9FA',
						200: '#E9ECEF',
						300: '#DEE2E6',
						400: '#CED4DA',
						500: '#ADB5BD',
						600: '#6C757D',
						700: '#495057',
						800: '#343A40',
						900: '#212529',
					},
					'success': '#10B981',
					'warning': '#F59E0B',
					'error': '#EF4444',
					'positive': '#22C55E',
					'negative': '#F43F5E',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
				'ticker': 'ticker 30s linear infinite'
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
			boxShadow: {
				'glass': '0 0 20px rgba(0, 0, 0, 0.05), 0 0 4px rgba(0, 0, 0, 0.1)',
				'glass-strong': '0 0 30px rgba(0, 0, 0, 0.1), 0 0 8px rgba(0, 0, 0, 0.1)',
				'glass-blue': '0 0 20px rgba(0, 80, 255, 0.1), 0 0 4px rgba(0, 80, 255, 0.05)',
				'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
				'button-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
