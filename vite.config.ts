import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Vercel/CI ortamında process.env bazen yalnızca build sırasında gelir; import.meta.env'e açıkça aktarırız. */
const VITE_ENV_KEYS = [
  'VITE_EMAILJS_PUBLIC_KEY',
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_TEMPLATE_ID_RESET',
  'VITE_PASSWORD_RESET_SECRET',
  'VITE_SUPPORT_EMAIL',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_API_BASE_URL',
] as const

export default defineConfig(({ mode }) => {
  const fromFile = loadEnv(mode, process.cwd(), '')
  const define: Record<string, string> = {}
  for (const key of VITE_ENV_KEYS) {
    const v = (process.env[key] ?? fromFile[key] ?? '') as string
    define[`import.meta.env.${key}`] = JSON.stringify(v)
  }
  return {
    plugins: [react(), tailwindcss()],
    define,
  }
})
