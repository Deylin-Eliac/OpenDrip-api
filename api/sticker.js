// /api/sticker.js
import express from 'express'
import { buscarStickers } from '../lib/stickerly.js' // tu función personalizada

const router = express.Router()

router.get('/', async (req, res) => {
  const q = req.query.q
  if (!q) return res.status(400).json({ status: false, message: 'Falta el parámetro q' })

  const resultado = await buscarStickers(q)
  res.json(resultado)
})

export default router

