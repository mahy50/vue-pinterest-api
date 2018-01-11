// process.env.NODE_ENV
const NODE_ENV = process.env.NODE_ENV
module.exports = require(`./env/${NODE_ENV}.js`)
