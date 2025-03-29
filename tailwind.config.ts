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
				border: {
					DEFAULT: "hsl(var(--border))",
					dark: "hsl(var(--border-dark))",
					light: "hsl(var(--border-light))"
				},
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				background: {
					DEFAULT: "hsl(var(--background))",
					secondary: "hsl(var(--background-secondary))"
				},
				foreground: "hsl(var(--foreground))",
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))"
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))"
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))"
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))"
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))"
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))"
				},
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))"
				},
				// Axium Theme System
				axium: {
					// Dark Mode
					blue: {
						DEFAULT: "#38BDF8", 
						light: "#93C5FD",
						dark: "#1E3A8A",
						glow: "rgba(56, 189, 248, 0.3)"
					},
					gold: {
						DEFAULT: "#FFD700",
						light: "#FFEB80",
						dark: "#D4AF37",
						glow: "rgba(255, 215, 0, 0.3)"
					},
					mint: {
						DEFAULT: "#00FFD0",
						light: "#80FFE8",
						dark: "#00B899",
						glow: "rgba(0, 255, 208, 0.3)"
					},
					dark: {
						bg: "#0B0F1A",
						bgAlt: "#0E0F12",
						card: "#111827",
						border: "#1A2747"
					},
					// Light Mode
					light: {
						bg: "#FDFDFD",
						bgAlt: "#F7F8FA",
						card: "#FFFFFF",
						border: "#E5E7EB"
					},
					// Neutral
					gray: {
						100: "#F8F9FA",
						200: "#E9ECEF",
						300: "#DEE2E6",
						400: "#CED4DA",
						500: "#ADB5BD",
						600: "#6C757D",
						700: "#495057",
						800: "#343A40",
						900: "#212529",
					},
					// States
					success: "#10B981",
					warning: "#F59E0B",
					error: "#EF4444",
					positive: "#22C55E",
					negative: "#F43F5E",
				}
			},
			boxShadow: {
				'glass': '0 0 20px rgba(0, 0, 0, 0.05), 0 0 4px rgba(0, 0, 0, 0.1)',
				'glass-strong': '0 0 30px rgba(0, 0, 0, 0.1), 0 0 8px rgba(0, 0, 0, 0.1)',
				'glass-blue': '0 0 20px rgba(56, 189, 248, 0.1), 0 0 4px rgba(56, 189, 248, 0.05)',
				'button': '0 1px 2px rgba(0, 0, 0, 0.05)',
				'button-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
				'glow': '0 0 15px rgba(56, 189, 248, 0.5)',
				'gold-glow': '0 0 15px rgba(255, 215, 0, 0.5)',
				'mint-glow': '0 0 15px rgba(0, 255, 208, 0.5)',
				'light-glow': '0 0 15px rgba(165, 180, 252, 0.5)',
				'light-purple-glow': '0 0 15px rgba(168, 85, 247, 0.4)',
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
				},
				'glow-pulse': {
					'0%': { 
						boxShadow: '0 0 5px rgba(56, 189, 248, 0.5)' 
					},
					'50%': { 
						boxShadow: '0 0 20px rgba(56, 189, 248, 0.7)' 
					},
					'100%': { 
						boxShadow: '0 0 5px rgba(56, 189, 248, 0.5)' 
					}
				},
				'float-slow': {
					'0%, 100%': {
						transform: 'translateY(0)'
					},
					'50%': {
						transform: 'translateY(-10px)'
					}
				},
				'rotate-slow': {
					'0%': {
						transform: 'rotate(0deg)'
					},
					'100%': {
						transform: 'rotate(360deg)'
					}
				},
				'glow-pulse-blue': {
					'0%, 100%': { 
						textShadow: '0 0 5px rgba(56, 189, 248, 0.5)' 
					},
					'50%': { 
						textShadow: '0 0 15px rgba(56, 189, 248, 0.8), 0 0 20px rgba(56, 189, 248, 0.5)' 
					}
				},
				'glow-pulse-gold': {
					'0%, 100%': { 
						textShadow: '0 0 5px rgba(255, 215, 0, 0.5)' 
					},
					'50%': { 
						textShadow: '0 0 15px rgba(255, 215, 0, 0.8), 0 0 20px rgba(255, 215, 0, 0.5)' 
					}
				},
				'glow-pulse-mint': {
					'0%, 100%': { 
						textShadow: '0 0 5px rgba(0, 255, 208, 0.5)' 
					},
					'50%': { 
						textShadow: '0 0 15px rgba(0, 255, 208, 0.8), 0 0 20px rgba(0, 255, 208, 0.5)' 
					}
				},
				'theme-switch': {
					'0%': { transform: 'rotate(0deg)' },
					'50%': { transform: 'rotate(180deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'pulse-glow': {
					'0%, 100%': { 
						opacity: '0.8',
						filter: 'brightness(1)'
					},
					'50%': { 
						opacity: '1',
						filter: 'brightness(1.2)'
					},
				},
				'float-gentle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
				},
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
				'float-slow': 'float-slow 8s ease-in-out infinite',
				'rotate-slow': 'rotate-slow 20s linear infinite',
				'glow-pulse-blue': 'glow-pulse-blue 2s infinite',
				'glow-pulse-gold': 'glow-pulse-gold 2s infinite',
				'glow-pulse-mint': 'glow-pulse-mint 2s infinite',
				'theme-switch': 'theme-switch 0.5s ease-in-out',
				'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
				'float-gentle': 'float-gentle 6s infinite ease-in-out',
			},
			backdropFilter: {
				'none': 'none',
				'blur': 'blur(8px)',
				'blur-sm': 'blur(4px)',
				'blur-md': 'blur(12px)',
				'blur-lg': 'blur(16px)',
				'blur-xl': 'blur(24px)',
				'blur-2xl': 'blur(40px)',
				'blur-3xl': 'blur(64px)',
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
				'glass-gradient': 'linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
				'grid-pattern': 'linear-gradient(to right, rgba(30, 41, 59, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(30, 41, 59, 0.1) 1px, transparent 1px)',
				'grid-pattern-light': 'linear-gradient(to right, rgba(209, 213, 219, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(209, 213, 219, 0.4) 1px, transparent 1px)',
				'noise': 'url("/textures/noise.png")',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
