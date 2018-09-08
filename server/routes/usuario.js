const express = require('express')
const bcrypt = require('bcrypt')
const _ = require('underscore')

const Usuario = require('../models/usuario')

const { verificaToken, verificaRole } = require('../middlewares/auth')

const app = express()

app.get('/usuario', verificaToken, (req, res) => {
  let desde = req.query.desde || 0
  desde = Number(desde)

  let limite = req.query.limite || 20
  limite = Number(limite)

  Usuario
    .find({ state: true }, 'name email img role google state')
    .skip(desde)
    .limit(limite)
    .exec((error, usuarios) => {
      if (error) {
        return res.status(400).json({
          ok: false,
          error
        })
      }

      Usuario.count({ state: true }, (error, cantidadUsuarios) => {
        if (error) {
          return res.status(400).json({
            ok: false,
            error
          })
        }

        res.json({
          ok: true,
          users: usuarios,
          cantidadUsuarios
        })
      })
    })
})

app.post('/usuario', [ verificaToken, verificaRole ], (req, res) => {
  const data = req.body

  const usuario = new Usuario({
    name: data.name,
    email: data.email,
    password: bcrypt.hashSync(data.password, 10),
    role: data.role
  })

  usuario.save((error, userDB) => {

    if (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }

    res.json({ ok: true, user: userDB })
  })
})

app.put('/usuario/:id', [ verificaToken, verificaRole ], (req, res) => {
  const { id } = req.params
  const data = _.pick(req.body, ['name', 'email', 'img', 'role', 'state'])

  Usuario.findByIdAndUpdate(id, data, { new: true, runValidators: false }, (error, userDB) => {
    console.log(userDB)
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }

    res.json({
      ok: true,
      user: userDB
    })
  })
})

app.delete('/usuario/:id', [ verificaToken, verificaRole ], (req, res) => {
  const { id } = req.params

  // Se marca el estado del usuario a false
  Usuario.findByIdAndUpdate(id, { state: false }, { new: true }, (error, userDB) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error
      })
    }

    res.json({
      ok: true,
      user: userDB
    })
  })
})

module.exports = app
