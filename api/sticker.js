import express from 'express'
import fetch from 'node-fetch'
import cheerio from 'cheerio'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.q
  if (!query) return res.status(400).json({ status: false, message: 'Falta el parámetro ?q=' })

  try {
    const url = `https://sticker.ly/s/${encodeURIComponent(query)}`
    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    const results = []

    $('a[href^="/pack/"]').each((i, el) => {
      const name = $(el).find('h2').text().trim()
      const author = $(el).find('p').first().text().trim()
      const link = 'https://sticker.ly' + $(el).attr('href')
      const thumbnail = $(el).find('img').attr('src')

      const metaText = $(el).find('p').eq(1).text().trim() // Contiene algo como "12 Stickers • 1.2k Vistas • 340 Exportaciones"
      const metaMatch = metaText.match(/(\d+)\s+Stickers\s+•\s+([\d.k]+)\s+Vistas\s+•\s+([\d.k]+)\s+Exportaciones/i)

      const stickerCount = metaMatch?.[1] || null
      const viewCount = metaMatch?.[2] || null
      const exportCount = metaMatch?.[3] || null

      results.push({
        name,
        author,
        stickerCount: parseInt(stickerCount),
        viewCount,
        exportCount,
        thumbnail,
        url: link
      })
    })

    res.json({
      status: true,
      creator: "I'm Fz ~",
      res: results
    })
  } catch (e) {
    res.status(500).json({ status: false, message: 'Error al obtener datos', error: e.message })
  }
})

export default router