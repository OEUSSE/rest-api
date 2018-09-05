const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {
  const data = req.body

  Usuario.findOne({ email: data.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (!userDB) {
      return res.status(400).json({
        message: "(Usuario) o contraseña incorrectos"
      })
    }

    if (!bcrypt.compareSync(data.password, userDB.password)) {
      return res.status(400).json({
        message: "Usuario o (contraseña) incorrectos"
      })
    }

    const token = jwt.sign({
      usuario: userDB
    }, process.env.SEED, { expiresIn: process.env.CAUDICAD_TOKEN })

    res.json({
      ok: true,
        usuario: userDB,
        token
     })
  })
})

module.exports = app
