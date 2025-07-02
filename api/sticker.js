// sticker.js
import stickerly from 'sticker.ly'

export async function buscarStickers(query = '') {
  if (!query) throw '❌ Debes escribir una palabra clave para buscar stickers.'

  try {
    const resultados = await stickerly.search(query, { limit: 10 }) // puedes cambiar el límite

    const stickers = resultados.map(pack => ({
      name: pack.name,
      author: pack.author,
      stickerCount: pack.stickers.length,
      viewCount: pack.viewCount,
      exportCount: pack.exportCount,
      isPaid: pack.isPaid,
      thumbnail: pack.cover,
      url: `https://sticker.ly/s/${pack.id}`
    }))

    return {
      status: true,
      total: stickers.length,
      results: stickers
    }
  } catch (e) {
    return {
      status: false,
      message: '❌ Error al buscar stickers',
      error: e.message || e
    }
  }
}