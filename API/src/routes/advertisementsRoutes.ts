import express, { Request, Response, NextFunction, Router } from "express";
import { AppDataSource } from "../data-source";
import { Advertisements } from "../entity/Advertisements";
import { User } from "../entity/User";
import jwt from "jsonwebtoken";
import { Category } from "../entity/Category";

const app = express();

// Képfeltöltés
const multer = require('multer');
import path from 'path';
import { tokencheck } from "../utils/tokenUtils";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalname = file.originalname.replace(' ', '_');
    const name = originalname.substring(0, originalname.lastIndexOf('.'));
    const ext = originalname.substring(originalname.lastIndexOf('.'));
    cb(null, name + '-' + timestamp + ext);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req: any, file: any, cb: any) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Csak képfájlok engedélyezettek!"), false);
    }
  }
});


const router = Router();
app.use(express.json()); // Biztosítja a JSON-ként érkező kérés feldolgozását



// 📌 Hirdetés létrehozása
router.post("/", async (req: any, res: any) => {
  console.log(req.body); 
  

  const { categoryID, title, description, price, image } = req.body;


  if (!categoryID || !title || !description || !price) {
    return res.status(400).json({ message: "Minden mező kitöltése kötelező!" });
  } 

const user = await AppDataSource.getRepository(User).findOne({ where: { id: req.user?.userId } });
    if (!user) {
      //invalidFields.push('user');
      return res.status(404).json({ message: "Felhasználó nem található!"});
    }
/*
  const categoryEntity = await Category.findOne({ where: { id: categoryID } });
  if (!categoryEntity) {
    return res.status(400).json({ message: "Érvénytelen kategória!" });
*/

  const newAd = new Advertisements();
  newAd.user = user;
  newAd.date = new Date();
  newAd.category = categoryID;
  newAd.title = title;
  newAd.description = description;
  newAd.price = price;
  newAd.imagefilename = image;

  await AppDataSource.getRepository(Advertisements).save(newAd);

  res.status(201).json({ message: "Hirdetés sikeresen létrehozva!", advertisement: newAd });
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
      ad.imagefilename = image || ad.imagefilename;
  
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

// 📌 Hirdetések lekérése adott kategóriában
router.get("/category/:categoryName", async (req: any, res: any) => {
  try {
    const { categoryName } = req.params;

    const ads = await AppDataSource.getRepository(Advertisements)
      .createQueryBuilder("ad")
      .where("ad.category = :categoryName", { categoryName })  // 📌 Javított where feltétel
      .getMany();

    if (ads.length === 0) {
      return res.status(404).json({ message: `Nincsenek hirdetések ebben a kategóriában: ${categoryName}` });
    }

    res.status(200).json({ advertisements: ads });

  } catch (error) {
    console.error("❌ Hiba a kategória szerinti szűrés során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetések lekérésekor.", error });
  }
});

// Képfeltöltés
// 📌 Képfeltöltés (bejelentkezett felhasználóknak)
router.post('/uploads', upload.single('file'), (req: any, res: any) => {
  if (!req.file) {
    return res.status(500).json({ message: 'Hiba történt a feltöltéskor!' });
  }
  res.status(200).json({ message: 'Sikeres képfeltöltés!', file: req.file });
});


export default router;
