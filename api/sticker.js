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
    const url = `https://www.flaticon.es/resultados?word=${encodeURIComponent(q)}&type=sticker`
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    })

    const $ = cheerio.load(data)
    const resultados = []

    $('li.icon--item').each((i, el) => {
      const anchor = $(el).find('a.icon--holder')
      const nombre = anchor.attr('aria-label')?.trim() || 'Sticker'
      const url = 'https://www.flaticon.es' + anchor.attr('href')
      const thumbnail = $(el).find('img').attr('data-src') || $(el).find('img').attr('src')
      const autor = $(el).find('.author--name').text().trim() || 'Desconocido'

      if (nombre && url && thumbnail) {
        resultados.push({
          nombre,
          autor,
          url,
          thumbnail
        })
      }
    })

    if (!resultados.length) {
      return res.json({ estado: false, mensaje: 'No se encontraron stickers' })
    }

    return res.json({
      estado: true,
      creador: 'TuNombre',
      resultados
    })

  } catch (error) {
    return res.status(500).json({
      estado: false,
      mensaje: 'Error al buscar en Flaticon',
      error: error.message
    })
  }
})

export default router