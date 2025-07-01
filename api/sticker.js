import express from 'express'
//import puppeteer from 'puppeteer'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.q
  if (!query) return res.status(400).json({ status: false, message: 'Falta el parámetro ?q=' })

  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    await page.goto(`https://sticker.ly/s/${encodeURIComponent(query)}`, { waitUntil: 'networkidle2' })

    const results = await page.evaluate(() => {
      const items = []
      document.querySelectorAll('a[href^="/pack/"]').forEach(el => {
        const name = el.querySelector('h2')?.innerText.trim()
        const author = el.querySelector('p')?.innerText.trim()
        const link = 'https://sticker.ly' + el.getAttribute('href')
        const thumbnail = el.querySelector('img')?.src
        const metaText = el.querySelectorAll('p')?.[1]?.innerText.trim()
        const metaMatch = metaText?.match(/(\d+)\s+Stickers\s+•\s+([\d.k]+)\s+Vistas\s+•\s+([\d.k]+)\s+Exportaciones/i)

        items.push({
          name,
          author,
          stickerCount: metaMatch?.[1] ? parseInt(metaMatch[1]) : null,
          viewCount: metaMatch?.[2] || null,
          exportCount: metaMatch?.[3] || null,
          thumbnail,
          url: link
        })
      })
      return items
    })

    await browser.close()

    res.json({
      status: true,
      creator: "Deylin",
      res: results
    })
  } catch (e) {
    res.status(500).json({ status: false, message: 'Error al obtener datos', error: e.message })
  }
})