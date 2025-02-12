import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import advertisementsRoutes from "./routes/advertisementsRoutes";
import { AppDataSource } from "./data-source";
import { Category } from "./entity/Category";
import { seedDatabase } from "./utils/DatabaseSeed";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", userRoutes);
app.use("/ads", advertisementsRoutes);

// 🔹 Kategóriák seedelése

// 🔹 Az AppDataSource-t itt inicializáljuk, ÉS csak egyszer!
AppDataSource.initialize()
  .then(async () => {
    console.log("✅ Adatbázis sikeresen csatlakoztatva!");

    await seedDatabase(); 

    app.listen(4000, () => {
      console.log(`🚀 Server running at http://localhost:4000`);
    });
  })
  .catch((err) => {
    console.error("❌ Hiba történt az adatbázis kapcsolat során:", err);
  });
