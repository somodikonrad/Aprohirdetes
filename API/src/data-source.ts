import { DataSource } from "typeorm";
import { User } from "./entity/User"; // Az adatbázis entity-k importálása
import { Advertisements } from "./entity/Advertisements";
import { Category } from "./entity/Category";

export const AppDataSource = new DataSource({
  type: "mysql", // MySQL adatbázis típusa
  host: "localhost", // Az adatbázis hostja
  port: 3306, // Az adatbázis portja (default 3306 MySQL esetén)
  username: "root", // Adatbázis felhasználónév
  password: "", // Adatbázis jelszó
  database: "13a_aprohirdetes", // Az adatbázis neve, amit használsz
  synchronize: true, // Az entitások automatikus szinkronizálása (development módban jó)
  logging: false, // Hibaüzenetek logolása
  entities: [User, Advertisements, Category], // Az entity-k listája, pl. User
  migrations: [],
  subscribers: [],
});
