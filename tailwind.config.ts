
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
				// Custom colors for Vibe Coded Caos
				'vibe-neon': '#00ff8c',
				'vibe-pink': '#ff00dd',
				'vibe-blue': '#0066ff',
				'vibe-yellow': '#ffcc00',
				'vibe-red': '#ff3366',
				'vibe-dark': '#0a0a0a',
				'vibe-light': '#f0f0f0',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				'glitch': {
					'0%': { 
						transform: 'translate(0)',
						textShadow: '0.4389924193300864px 0 1px rgba(0,30,255,0.5), -0.4389924193300864px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'5%': {
						transform: 'translate(5px, 2px)',
						textShadow: '2.392931020904767px 0 1px rgba(0,30,255,0.5), -2.392931020904767px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'10%': {
						transform: 'translate(-3px, -5px)',
						textShadow: '-0.6046736746745998px 0 1px rgba(0,30,255,0.5), 0.6046736746745998px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'15%': {
						transform: 'translate(0)',
						textShadow: '0.40159532181293335px 0 1px rgba(0,30,255,0.5), -0.40159532181293335px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'20%': {
						transform: 'translate(1px, 0)',
						textShadow: '3.4794037899852017px 0 1px rgba(0,30,255,0.5), -3.4794037899852017px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'25%': {
						transform: 'translate(-3px, 1px)',
						textShadow: '1.6125630401149584px 0 1px rgba(0,30,255,0.5), -1.6125630401149584px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'30%': {
						transform: 'translate(3px, 3px)',
						textShadow: '0.7517342035095177px 0 1px rgba(0,30,255,0.5), -0.7517342035095177px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'35%': {
						transform: 'translate(-5px, -1px)',
						textShadow: '-0.5896915264028741px 0 1px rgba(0,30,255,0.5), 0.5896915264028741px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'40%': {
						transform: 'translate(0)',
						textShadow: '2.54145887145853px 0 1px rgba(0,30,255,0.5), -2.54145887145853px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'45%': {
						transform: 'translate(0)',
						textShadow: '2.54145887145853px 0 1px rgba(0,30,255,0.5), -2.54145887145853px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'50%': {
						transform: 'translate(-3px, 0)',
						textShadow: '0.24234679863612959px 0 1px rgba(0,30,255,0.5), -0.24234679863612959px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'55%': {
						transform: 'translate(0)',
						textShadow: '-1.9307125654086838px 0 1px rgba(0,30,255,0.5), 1.9307125654086838px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'60%': {
						transform: 'translate(3px, -2px)',
						textShadow: '-0.5896915264028741px 0 1px rgba(0,30,255,0.5), 0.5896915264028741px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'65%': {
						transform: 'translate(0)',
						textShadow: '0.24234679863612959px 0 1px rgba(0,30,255,0.5), -0.24234679863612959px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'70%': {
						transform: 'translate(-2px, 5px)',
						textShadow: '-0.5896915264028741px 0 1px rgba(0,30,255,0.5), 0.5896915264028741px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'75%': {
						transform: 'translate(0)',
						textShadow: '0.7517342035095177px 0 1px rgba(0,30,255,0.5), -0.7517342035095177px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'80%': {
						transform: 'translate(0)',
						textShadow: '0.7517342035095177px 0 1px rgba(0,30,255,0.5), -0.7517342035095177px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'85%': {
						transform: 'translate(0)',
						textShadow: '0.7517342035095177px 0 1px rgba(0,30,255,0.5), -0.7517342035095177px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'90%': {
						transform: 'translate(0)',
						textShadow: '0.24234679863612959px 0 1px rgba(0,30,255,0.5), -0.24234679863612959px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'95%': {
						transform: 'translate(-1px, 2px)',
						textShadow: '0.24234679863612959px 0 1px rgba(0,30,255,0.5), -0.24234679863612959px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					},
					'100%': {
						transform: 'translate(0)',
						textShadow: '-0.5896915264028741px 0 1px rgba(0,30,255,0.5), 0.5896915264028741px 0 1px rgba(255,0,80,0.3), 0 0 3px'
					}
				},
				'noise': {
					'0%': { backgroundPosition: '0% 0%' },
					'100%': { backgroundPosition: '100% 100%' }
				},
				'float': {
					'0%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' },
					'100%': { transform: 'translateY(0px)' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
					'20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
				},
				'pulse-neon': {
					'0%, 100%': { 
						boxShadow: '0 0 5px #00ff8c, 0 0 10px #00ff8c, 0 0 15px #00ff8c, 0 0 20px #00ff8c' 
					},
					'50%': { 
						boxShadow: '0 0 15px #00ff8c, 0 0 25px #00ff8c, 0 0 35px #00ff8c, 0 0 45px #00ff8c'
					}
				},
				'slide-right': {
					'0%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(5px)' },
					'100%': { transform: 'translateX(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glitch': 'glitch 2.5s infinite',
				'noise': 'noise 8s linear infinite',
				'float': 'float 6s ease-in-out infinite',
				'shake': 'shake 0.5s ease-in-out',
				'pulse-neon': 'pulse-neon 2s infinite',
				'slide-right': 'slide-right 1s ease-in-out infinite'
			},
			fontFamily: {
				'glitch': ['"VT323"', 'monospace'],
				'hand': ['"Permanent Marker"', 'cursive'],
				'code': ['"Fira Code"', 'monospace']
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
