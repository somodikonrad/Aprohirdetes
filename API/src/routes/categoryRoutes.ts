import { Router } from "express";
import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
import { tokencheck } from "../utils/tokenUtils";


const router = Router();


router.get("/", tokencheck, async (_req: any, res: any) => {
    try {
      const categories = await AppDataSource.getRepository(Category).find();
      res.status(200).json({ categories: categories });
    } catch (error) {
      console.error("Hiba a kategóriák lekérése során:", error);
      res.status(500).json({ message: "Hiba történt a kategóriák lekérésekor.", error });
    }
  });

  export default router;