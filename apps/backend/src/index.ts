import app from './app.js'
import { AppDataSource } from './utils/conexionDB.js';
import config from './utils/config.js'
import "reflect-metadata";

async function main() {

  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    app.listen(config.PORT, () => {
      console.log(`Server running on port http://localhost:${config.PORT}`)
    })

  } catch (error) {
    if (error instanceof Error)
      console.log(error.message);
  }

}

main()

