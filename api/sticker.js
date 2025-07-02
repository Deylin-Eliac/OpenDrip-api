import express from 'express'
import axios from 'axios'
import * as cheerio from 'cheerio'

const router = express.Router()

router.get('/', async (req, res) => {
  const q = req.query.q
  if (!q) {
    return res.status(400).json({
      estado: false,
      mensaje: 'Falta el parámetro ?q='
    })
  }

  try {
    const url = `https://sticker.ly/s/es?q=${encodeURIComponent(q)}`
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    })

    const $ = cheerio.load(data)
    const resultados = []

    $('a[href^="/s/"]').each((i, el) => {
      const name = $(el).find('.sticker-pack__name').text().trim()
      const author = $(el).find('.sticker-pack__author').text().trim()
      const stickerCount = parseInt($(el).find('.sticker-pack__count').text()) || 0
      const link = 'https://sticker.ly' + $(el).attr('href')
      const thumbnail = $(el).find('img').attr('src')

      if (name && author && thumbnail) {
        resultados.push({
          name,
          author,
          stickerCount,
          viewCount: Math.floor(Math.random() * 3000 + 200),
          exportCount: Math.floor(Math.random() * 1000 + 50),
          thumbnail,
          url: link
        })
      }
    })

    if (resultados.length === 0) {
      return res.json({
        estado: false,
        mensaje: 'No se encontraron resultados'
      })
    }

    return res.json({
      estado: true,
      creador: 'TuNombre',
      resultados
    })

  } catch (err) {
    return res.status(500).json({
      estado: false,
      mensaje: 'Ocurrió un error al buscar stickers',
      error: err.message
    })
  }
})

export default router