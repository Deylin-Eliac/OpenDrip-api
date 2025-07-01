import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'
import { fileURLToPath } from 'url'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())
app.use(express.json())

const apiPath = path.join(__dirname, 'api')

fs.readdirSync(apiPath).forEach(async (file) => {
  if (file.endsWith('.js')) {
    const route = '/api/' + file.replace('.js', '')
    const filePath = path.join(apiPath, file)

    try {
      const module = await import(filePath)
      app.use(route, module.default || module)
      console.log(`✅ Ruta cargada: ${route}`)
    } catch (err) {
      console.error(`❌ Error cargando ${file}:`, err)
    }
  }
})


app.get('/', (req, res) => {
  res.send('🚀 Plataforma de APIs activada')
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`)
})