const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })

    res.json({
      ok: true,
      usuario: userDB,
      token
    })
  })
})

// Configuraciones de Google
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return {
    name: payload.name,
    email: payload.email,
    picture: payload.picture,
    google: true
  }
}

// Google
app.post('/google', async (req, res) => {
  const token = req.body.idtoken

  const googleUser = await verify(token).catch(err => {
    return res.status(403).json({
      ok: false,
      err
    })
  })

  Usuario.findOne({ email: googleUser.email }, (err, userDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      })
    }

    if (userDB) {
      if (!userDB.google) {
        return res.status(400).json({
          ok: false,
          err: {
            message: 'Debe ser su autenticación normal'
          }
        })
      } else {
        const token = jwt.sign({
          usuario: userDB
        }, process.env.SEED, {
          expiresIn: process.env.CAUDICAD_TOKEN
        })

        return res.status(200).json({
          ok: true,
          user: userDB,
          token,
        })
      }
    } else {
      let usuario = new Usuario()

      usuario.name = googleUser.name
      usuario.email = googleUser.email
      usuario.img = googleUser.picture
      usuario.state = true
      usuario.password = ':)'

      usuario.save((err, userDB) => {
        if (err)
          return res.status(400).json({
            ok: true,
            err
          })

        const token = jwt.sign({
          usuario: userDB
        }, process.env.SEED, {
          expiresIn: process.env.CAUDICAD_TOKEN
        })

        return res.status(200).json({
          ok: true,
          user: userDB,
          token,
        })
      })
    }
  })
})

module.exports = app
