// api/stickerly.js
import express from 'express'
import fetch from 'node-fetch'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.q
  if (!query) return res.status(400).json({ status: false, message: '❌ Falta el parámetro ?q=' })

  try {
    const apiUrl = `https://hercai.onrender.com/stickerly?q=${encodeURIComponent(query)}`
    const response = await fetch(apiUrl)
    const data = await response.json()

    if (!data || !data.res?.length) {
      return res.status(404).json({ status: false, message: '⚠️ No se encontraron resultados.' })
    }

    return res.json({
      status: true,
      total: data.res.length,
      results: data.res.map(pack => ({
        name: pack.name,
        author: pack.author,
        stickerCount: pack.stickerCount,
        viewCount: pack.viewCount,
        exportCount: pack.exportCount,
        isPaid: pack.isPaid,
        thumbnail: pack.thumbnail,
        url: pack.url
      }))
    })
  } catch (e) {
    res.status(500).json({
      status: false,
      message: '❌ Error al buscar stickers',
      error: e.message || e
    })
  }
})

export default router