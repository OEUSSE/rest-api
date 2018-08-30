require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const morgan = require('morgan')

const app = express()

// parse application/x-www-form-urlenconded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
// Watch in console http methods log
app.use(morgan('dev'))
// Obtener las rutas
app.use(require('./routes/usuario'))

mongoose.connect(process.env.URLDB, (err, res) => {
  if (err)
    throw err

  console.log('Base de datos corriendo...')
})

app.listen(process.env.PORT, err => {
  if (err) console.log(err)
  console.log(`API escuchando en el puerto ${process.env.PORT}`)
})

/**
  Object.seal()
  Object.freeze()
  Object.defineProperty()
  Object.defibeProperties()
 */

