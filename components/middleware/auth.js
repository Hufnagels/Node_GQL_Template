const { AuthenticationError } = require('apollo-server-express')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET

module.exports = (context) => {

  const authHeader = context.req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split('Bearer')[1]
    if (token) {
      try {
        const user = jwt.verify(token, JWT_SECRET)
        return user
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token')
      }
    }
    throw new Error('Authentication token must be Bearer type')
  }
  throw new Error('Authentication header must be provided')
}