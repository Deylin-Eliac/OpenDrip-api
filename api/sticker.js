import express from 'express'
const router = express.Router()

router.get('/', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ status: false, message: 'Falta el parámetro ?q=' })

  res.json({
    status: true,
    creator: 'TuNombre',
    results: [
      {
        name: 'Ejemplo Sticker Pack',
        author: 'DemoUser',
        stickerCount: 10,
        viewCount: 1500,
        exportCount: 230,
        thumbnail: 'https://sticker.ly/s/sample.jpg',
        url: 'https://sticker.ly/s/12345678'
      }
    ]
  })
})

export default router