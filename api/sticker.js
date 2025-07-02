// api/stickerly.js
import express from 'express'
import puppeteer from 'puppeteer'

const router = express.Router()

router.get('/', async (req, res) => {
  const query = req.query.q
  if (!query) return res.status(400).json({ status: false, message: '❌ Falta el parámetro ?q=palabra' })

  let browser
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })
    const page = await browser.newPage()
    await page.goto(`https://sticker.ly/s/es/search/${encodeURIComponent(query)}`, { waitUntil: 'networkidle2' })
    await page.waitForSelector('.Discover_pack__1cdN5', { timeout: 8000 })

    const results = await page.evaluate(() => {
      const packs = [...document.querySelectorAll('.Discover_pack__1cdN5')]
      return packs.slice(0, 10).map(el => {
        const name = el.querySelector('.Discover_title__uQ7ol')?.innerText
        const author = el.querySelector('.Discover_author__3zj3v')?.innerText
        const thumbnail = el.querySelector('img')?.src
        const url = el.querySelector('a')?.href
        return { name, author, thumbnail, url }
      })
    })

    res.json({
      status: true,
      total: results.length,
      results
    })
  } catch (err) {
    res.status(500).json({
      status: false,
      message: '❌ Error al buscar stickers',
      error: err.message
    })
  } finally {
    if (browser) await browser.close()
  }
})

export default router