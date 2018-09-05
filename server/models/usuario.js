const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = mongoose.Schema

const validRoles = {
  values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
  message: '{VALUE} no es un role válido'
}

const usuarioSchema = new Schema({
  name: {
    type: String,
    required: [ true, 'El nombre es necesario' ]
  },
  email: {
    type: String,
    unique: true,
    required: [ true, 'El correo es necesario' ]
  },
  password: {
    type: String,
    required: [ true, 'La contraseña es obligatoria' ]
  },
  google: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'USER_ROLE',
    enum: validRoles
  },
  img: {
    type: String,
    required: false
  },
  state: {
    type: Boolean,
    default: true
  }
})

/**
 * Schema.methods.toJSON()
 * El método .toJSON() es el encargado de devolver el data convertida en JSON
 * Accedemos a modificar este método para eliminar la propiedad password
 * para que este no se muestre en la data que se devuelve como respuesta en la API
 */
usuarioSchema.methods.toJSON = function() {
  const user = this
  const userObj = user.toObject()
  delete userObj.password

  return userObj
}

usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe ser único'
})

module.exports = mongoose.model('Usuario', usuarioSchema)