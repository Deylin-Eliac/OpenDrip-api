// api/mp3.js
import express from 'express'
import ytdl from 'ytdl-core'

const router = express.Router()

router.get('/mp3', async (req, res) => {
  const url = req.query.url
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).json({ status: false, error: '❌ URL inválida de YouTube' })
  }

  try {
    const info = await ytdl.getInfo(url)
    const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' })

    res.setHeader('Content-Disposition', `attachment; filename="${info.videoDetails.title}.mp3"`)
    res.setHeader('Content-Type', 'audio/mpeg')

    ytdl(url, { format: audioFormat, filter: 'audioonly' }).pipe(res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ status: false, error: '❌ Error al procesar el audio' })
  }
})

export default router