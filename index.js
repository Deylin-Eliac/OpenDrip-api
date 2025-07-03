// index.js
import express from 'express'
import cors from 'cors'
import mp3Route from './api/mp3.js'

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use('/api', mp3Route)

app.get('/', (req, res) => {
  res.send('🧃 API MP3 YouTube by Deylin')
})

app.listen(PORT, () => {
  console.log(`✅ API corriendo en http://localhost:${PORT}`)
})