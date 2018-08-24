require('./config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app
  // parse application/x-www-form-urlenconded
  .use(bodyParser.urlencoded({ extended: false }))
  // parse application/json
  .use(bodyParser.json())
  .get('/usuario/:id', function(req, res) {
    const id = req.params.id
    res.json({
      id
    })
  })
  .post('/usuario', function(req, res) {
    const data = req.body
    if (!data.name) {
      res.status(400).json({
        ok: false,
        message: 'name is required'
      })
    } else {
      res.json({
        person: data
      })
    }
  })
  .put('/usuario/:id', function (req, res) {
    res.json('😊 PUT usuario')
  })
  .delete('/usuario/:id', function (req, res) {
    res.json('😎 DELETE (Change state) usuario')
  })
  .listen(process.env.PORT, err => {
    if (err) console.log(err)
    console.log(`API escuchando en el puerto ${process.env.PORT}`)
  })