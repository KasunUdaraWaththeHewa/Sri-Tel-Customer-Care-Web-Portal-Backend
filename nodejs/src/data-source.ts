import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Products } from "./entity/Products"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "postgres-1",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "nodejs",
    synchronize: true,
    logging: true,
    entities: [User,Products],
    migrations: [],
    subscribers: [],
})


AppDataSource.initialize()
  .then(async () => {
    console.log("Connection initialized with database...");
  })
  .catch((error) => console.log(error));

// export const getDataSource = (delay = 3000): Promise<DataSource> => {
//   if (AppDataSource.isInitialized) return Promise.resolve(AppDataSource);

//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       if (AppDataSource.isInitialized) resolve(AppDataSource);
//       else reject("Failed to create connection with database");
//     }, delay);
//   });
// };
