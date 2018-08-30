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
    'mongodb://cafe-user:123456abc@ds035750.mlab.com:35750/cafe_store'

process.env.URLDB = urlDB