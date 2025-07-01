import express from 'express'
import fs from 'fs'
import path from 'path'
import cors from 'cors'

const app = express()
const __dirname = path.resolve()

app.use(cors())
app.use(express.json())


const apiPath = path.join(__dirname, 'api')
fs.readdirSync(apiPath).forEach(file => {
  if (file.endsWith('.js')) {
    const route = '/api/' + file.replace('.js', '')
    import(path.join(apiPath, file)).then(module => {
      app.use(route, module.default || module)
      console.log(`✅ Ruta cargada: ${route}`)
    }).catch(err => {
      console.error(`❌ Error cargando ${file}:`, err)
    })
  }
})


app.get('/', (req, res) => {
  res.send('🚀 Plataforma de APIs activada')
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`🟢 Servidor escuchando en http://localhost:${PORT}`)
})