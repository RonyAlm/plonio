import app from './app.js'
import config from './utils/config.js'


const PORT = process.env.PORT || 3000;

app.listen(config.PORT, () => {
  console.log(`Server running on port http://localhost:${config.PORT}`)
})
