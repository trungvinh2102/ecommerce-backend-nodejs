require('dotenv').config()
const app = require('./src/app')

const PORT = process.env.PORT

const server = app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
})

process.on('SIGINT', () => {
  server.close(() => console.log(`Exit Server Express`))
})