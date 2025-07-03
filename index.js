// index.js
import express from 'express'
import cors from 'cors'
import mp3Route from './api/mp3.js'

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Asegurar permisos del binario yt-dlp
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const ytdlpPath = path.join(__dirname, 'bin/yt-dlp')

try {
  fs.accessSync(ytdlpPath, fs.constants.X_OK)
  console.log('✅ Permisos de ejecución para yt-dlp verificados')
} catch {
  try {
    execSync(`chmod +x ${ytdlpPath}`)
    console.log('🔧 Permisos de ejecución para yt-dlp aplicados')
  } catch (err) {
    console.error('❌ No se pudo aplicar chmod al binario yt-dlp:', err)
  }
}

// Inicializar servidor
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use('/api', mp3Route)

app.get('/', (req, res) => {
  res.send('🧃 API para descargar MP3 de YouTube by Deylin')
})

app.listen(PORT, () => {
  console.log(`✅ Servidor iniciado en http://localhost:${PORT}`)
})