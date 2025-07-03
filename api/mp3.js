import express from 'express'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(cors())

app.get('/api/ytmp3', async (req, res) => {
  const videoUrl = req.query.url
  if (!videoUrl) {
    return res.status(400).json({ error: '❌ Falta el parámetro ?url=' })
  }

  const id = Date.now()
  const outputPath = path.join('/tmp', `audio-${id}.m4a`)
  const ytdlpPath = path.join(__dirname, 'bin/yt-dlp')

  const command = `"${ytdlpPath}" -x --audio-format best -o "${outputPath}" "${videoUrl}"`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ yt-dlp error:\n', stderr)
      return res.status(500).json({ error: '❌ Error al descargar el audio' })
    }

    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Content-Disposition', `attachment; filename="audio-${id}.m4a"`)

    const fileStream = fs.createReadStream(outputPath)
    fileStream.pipe(res)

    fileStream.on('end', () => fs.unlink(outputPath, () => {}))
    fileStream.on('error', err => {
      console.error('❌ Error al leer el archivo:', err)
      res.status(500).json({ error: '❌ Error al enviar el archivo' })
    })
  })
})

app.get('/', (req, res) => {
  res.send('🧃 API de descarga MP3 directa con yt-dlp - sin APIs externas')
})

app.listen(port, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${port}`)
})
