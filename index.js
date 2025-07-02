// index.js
import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

const app = express()
app.use(cors())
app.use(express.json())

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const apiPath = path.join(__dirname, 'api')

// Cargar dinámicamente todas las rutas de la carpeta /api
fs.readdirSync(apiPath).forEach(async (file) => {
  if (file.endsWith('.js')) {
    const route = '/' + file.replace('.js', '')
    const module = await import(path.join(apiPath, file))
    app.use(route, module.default)
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`✅ API lista en http://localhost:${PORT}`))