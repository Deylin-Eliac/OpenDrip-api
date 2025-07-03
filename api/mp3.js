// api/mp3.js
import express from 'express'
import { exec } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.get('/mp3', async (req, res) => {
  const url = req.query.url
  if (!url) return res.status(400).json({ status: false, error: '❌ Falta el parámetro ?url=' })

  const filename = `audio-${Date.now()}.mp3`
  const output = path.join('/tmp', filename)
  const ytdlpPath = path.join(__dirname, '../bin/yt-dlp')

  const command = `"${ytdlpPath}" -x --audio-format mp3 -o "${output}" "${url}"`

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Error al ejecutar yt-dlp:', stderr)
      return res.status(500).json({ status: false, error: '❌ Error al descargar audio' })
    }

    res.download(output, filename, (err) => {
      if (err) {
        console.error('❌ Error al enviar el archivo:', err)
        res.status(500).json({ status: false, error: '❌ Error al enviar el archivo' })
      }

      // Eliminar archivo temporal después de enviar
      fs.unlink(output, () => {})
    })
  })
})

export default router