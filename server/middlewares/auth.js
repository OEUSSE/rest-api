const jwt = require('jsonwebtoken')

const verificaToken = (req, res, next) => {
  const token = req.get('Authorization')

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err
      })
    }

    req.usuario = decoded.usuario
    next()
  })
}

const verificaRole = (req, res, next) => {
  const role = req.usuario.role

  if (role !== 'ADMIN_ROLE') {
    return res.status(401).json({
      ok: false,
      message: "No tienes autorización para hacer esta acción."
    })
  }

  next()
}

module.exports = {
  verificaToken,
  verificaRole
}
