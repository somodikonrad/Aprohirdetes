import express, { Request, Response, NextFunction, Router } from "express";
import { AppDataSource } from "../data-source";
import { Advertisements } from "../entity/Advertisements";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";

const router = Router();


function tokencheck(req: any, res: any, next: NextFunction) {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(400).send("Jelentkezz be!");
    }
  
    const token = authHeader.split(" ")[1]; // A Bearer token kinyerése
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded token:", decoded);  // 📌 Itt ellenőrizheted, hogy benne van-e a `role`
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(400).send("Hibás vagy lejárt token!");
    }
  }



// 📌 Hirdetés létrehozása
router.post("/", tokencheck, async (req: any, res: any) => {
    try {
      const { category, title, description, price, image } = req.body;
      
      if (!category || !title || !description || !price) {
        return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
      }
  
      const newAd = new Advertisements();
      newAd.user = req.user.id; // A hirdetéshez kapcsolódó felhasználó azonosítója
      newAd.date = new Date();
      newAd.category = category;
      newAd.title = title;
      newAd.description = description;
      newAd.price = price;
      newAd.image = image;
  
      await AppDataSource.getRepository(Advertisements).save(newAd);
  
      res.status(201).json({ message: "Hirdetés sikeresen létrehozva!", advertisement: newAd });
  
    } catch (error) {
      console.error("Hiba a hirdetés létrehozása során:", error);
      res.status(500).json({ message: "Hiba történt a hirdetés létrehozásakor.", error });
    }
  });
  


// 📌 Hirdetés módosítása (Csak a saját hirdetést módosíthatja)
router.put("/:id", tokencheck, async (req: any, res: any) => {
    try {
      const { id } = req.params;
      const { category, title, description, price, image } = req.body;
  
      const adRepository = AppDataSource.getRepository(Advertisements);
      const ad = await adRepository.findOne({ where: { id }, relations: ["user"] });
  
      if (!ad) {
        return res.status(404).json({ message: "Hirdetés nem található!" });
      }
  
      if (ad.user.id !== req.user.id) {  // Itt ellenőrizzük, hogy a felhasználó azonos-e
        return res.status(403).json({ message: "Nincs jogosultságod ezt a hirdetést módosítani!" });
      }
  
      ad.category = category || ad.category;
      ad.title = title || ad.title;
      ad.description = description || ad.description;
      ad.price = price || ad.price;
      ad.image = image || ad.image;
  
      await adRepository.save(ad);
  
      res.status(200).json({ message: "Hirdetés sikeresen módosítva!", advertisement: ad });
  
    } catch (error) {
      console.error("Hiba a hirdetés módosítása során:", error);
      res.status(500).json({ message: "Hiba történt a hirdetés módosításakor.", error });
    }
  });
  


// 📌 Hirdetés törlése (Csak a saját hirdetését törölheti)
router.delete("/:id", tokencheck, async (req: any, res: any) => {
    try {
      const { id } = req.params;
  
      const adRepository = AppDataSource.getRepository(Advertisements);
      const ad = await adRepository.findOne({ where: { id }, relations: ["user"] });
  
      if (!ad) {
        return res.status(404).json({ message: "Hirdetés nem található!" });
      }
  
      if (ad.user.id !== req.user.id) {  // Itt is a user.id-t kell ellenőrizni
        return res.status(403).json({ message: "Nincs jogosultságod ezt a hirdetést törölni!" });
      }
  
      await adRepository.remove(ad);
  
      res.status(200).json({ message: "Hirdetés sikeresen törölve!" });
  
    } catch (error) {
      console.error("Hiba a hirdetés törlése során:", error);
      res.status(500).json({ message: "Hiba történt a hirdetés törlésekor.", error });
    }
  });
  

// 📌 Hirdetések lekérése (Mindenki számára elérhető)
router.get("/", async (_req: Request, res: Response) => {
  try {
    const ads = await AppDataSource.getRepository(Advertisements).find();
    res.status(200).json({ advertisements: ads });
  } catch (error) {
    console.error("Hiba a hirdetések lekérése során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetések lekérésekor.", error });
  }
});

export default router;
