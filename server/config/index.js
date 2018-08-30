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