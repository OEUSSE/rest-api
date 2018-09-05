/**
 * PORT
 */
process.env.PORT = process.env.PORT || 3000

/**
 * Environment
 */
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

/**
 * DB
 */
let urlDB =
  process.env.NODE_ENV === 'dev' ?
    'mongodb://localhost:27017/cafe_store'
    :
    process.env.MONGO_URI

process.env.URLDB = urlDB

/**
 * Vencimiento del token
 * 60 segundos
 * 60 minutos
 * 24 horas
 * 30 días
 */
process.env.CAUDICAD_TOKEN = 60 * 60 * 24 * 30

/**
 * SEED de autenticación
 */
process.env.SEED = process.env.SEED || 'development-seed'