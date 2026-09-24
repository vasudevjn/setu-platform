import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Vercel's Supabase integration names its variables NEXT_PUBLIC_*. Allow both.
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
  server: { host: true, port: 5173 },
  preview: { host: true, port: 4173 },
})
