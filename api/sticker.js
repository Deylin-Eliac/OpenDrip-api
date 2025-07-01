import axios from 'axios'
import cheerio from 'cheerio'

export async function buscarStickers(query) {
  try {
    const res = await axios.get(`https://sticker.ly/s/es?q=${encodeURIComponent(query)}`)
    const $ = cheerio.load(res.data)
    const resultados = []

    $('.sticker-pack__details').each((i, el) => {
      const name = $(el).find('.sticker-pack__name').text().trim()
      const author = $(el).find('.sticker-pack__author').text().trim()
      const stickerCount = parseInt($(el).find('.sticker-pack__count').text().trim()) || 0
      const link = 'https://sticker.ly' + $(el).parent().attr('href')
      const thumbnail = $(el).parent().find('img').attr('src') || ''

      const viewCount = Math.floor(Math.random() * 5000 + 100) // Datos simulados
      const exportCount = Math.floor(Math.random() * 800 + 50)

      resultados.push({ name, author, stickerCount, viewCount, exportCount, thumbnail, url: link })
    })

    return {
      status: true,
      creator: "Deylin",
      results: resultados
    }

  } catch (e) {
    return {
      status: false,
      message: "Error al buscar stickers",
      error: e.message
    }
  }
}