import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import { AppDataSource } from "./data-source";


const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);



// 🔹 Nem inicializáljuk újra az AppDataSource-t a seedDatabase-ben!


// 🔹 Az AppDataSource-t itt inicializáljuk, ÉS csak egyszer!
AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Adatbázis sikeresen csatlakoztatva!");

    

    app.listen(4000, () => {
      console.log(`🚀 Server running at http://localhost:4000`);
    });
  })
  .catch((err) => {
    console.error("❌ Hiba történt az adatbázis kapcsolat során:", err);
  });
