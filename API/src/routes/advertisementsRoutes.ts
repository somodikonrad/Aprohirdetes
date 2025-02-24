import express, { Request, Response, NextFunction, Router } from "express";
import { AppDataSource } from "../data-source";
import { Advertisements } from "../entity/Advertisements";
import { User } from "../entity/User";
import multer from 'multer';
import { tokencheck } from "../utils/tokenUtils";
import cron from "node-cron";
import { Category } from "../entity/Category";
import path from "path";

const app = express();



// ----------------------------Multer(Képfeltöltés)----------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');  // Make sure 'uploads/' directory exists
  },
  filename: function (req, file, cb) {
    const timestamp = Date.now();
    const originalname = file.originalname.replace(' ', '_');
    const name = originalname.substring(0, originalname.lastIndexOf('.'));
    const ext = originalname.substring(originalname.lastIndexOf('.'));
    cb(null, name + '-' + timestamp + ext);
  }
});

const upload = multer({ storage: storage });

const router = Router();
app.use(express.json()); // Biztosítja a JSON-ként érkező kérés feldolgozását

// 1 hét utáni törlő függvény
export const deleteExpiredAds = async () => {
  const adRepository = AppDataSource.getRepository(Advertisements);

  // Határidő kiszámítása: 7 nappal ezelőtti dátum
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    // Hirdetések törlése egy SQL lekérdezéssel
    const result = await adRepository
      .createQueryBuilder()
      .delete()
      .from(Advertisements)
      .where("date < :oneWeekAgo", { oneWeekAgo })
      .execute();

    if (result.affected && result.affected > 0) {
      console.log(`🗑️ ${result.affected} lejárt hirdetés törölve!`);
    } else {
      console.log("✅ Nincs lejárt hirdetés.");
    }
  } catch (error) {
    console.error("❌ Hiba a lejárt hirdetések törlése során:", error);
  }
};

// ----------------------------Hirdetés műveletek----------------------------
// Hirdetés létrehozása
router.post("/", upload.single('image'), async (req: any, res: any) => {
  const invalidFields: string[] = [];
  console.log(req.body);

  const { categoryID, title, description, price, image } = req.body;

  // Ellenőrizzük az összes mezőt
  console.log("Küldött adatok:", { categoryID, title, description, price, image });
  
  // Ha vannak hibás mezők
  if (invalidFields.length > 0) {
    return res.status(400).json({
      message: "Kérem, töltse ki az összes mezőt!",
      invalidFields,
    });
  }

  // Ellenőrizd, hogy a felhasználó létezik-e
  const user = await AppDataSource.getRepository(User).findOne({
    where: { id: req.user?.userId },
  });
  if (!user) {
    return res.status(404).json({ message: "Felhasználó nem található!" });
  }

  // Ellenőrizd, hogy a kategória létezik-e
  const category = await AppDataSource.getRepository(Category).findOne({
    where: { id: categoryID },
  });
  if (!category) {
    return res.status(404).json({ message: "Kategória nem található!" });
  }

  const newAd = new Advertisements();
  newAd.user = user;
  newAd.date = new Date();
  newAd.category = category;
  newAd.title = title;
  newAd.description = description;
  newAd.price = price;
  newAd.imagefilename = req.file.filename;

  try {
    await AppDataSource.getRepository(Advertisements).save(newAd);
    res.status(201).json({ message: "Hirdetés sikeresen létrehozva!", advertisement: newAd });
  } catch (error) {
    console.error("Hiba a hirdetés mentése során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetés mentésekor.", error });
  }
});


// Hirdetés módosítása (Csak a saját hirdetést módosíthatja)
// Hirdetés módosítása (Csak a saját hirdetést módosíthatja)
router.patch("/:id", tokencheck, upload.single('image'), async (req: any, res: any) => {
  console.log("Request Params:", req.params);  // Az id ellenőrzése
  console.log("Request Body:", req.body);      // A módosított mezők

  try {
    const { id } = req.params;  // Kivesszük az id-t a paraméterekből
    const { categoryID, title, description, price } = req.body;  // A body-ban kapott mezők
    const image = req.file ? req.file.filename : undefined; // Ha van új fájl, akkor az elérési útja

    console.log("Querying with ID:", id);  // Id logolása a lekérdezés előtt

    // Lekérdezzük a hirdetést az adatbázisból az ID alapján
    const adRepository = AppDataSource.getRepository(Advertisements);
    const ad = await adRepository.findOne({ where: { id }, relations: ["user", "category"] });

    if (!ad) {
      console.log("Hirdetés nem található!");
      return res.status(404).json({ message: "Hirdetés nem található!" });
    }

    console.log("Found Ad:", ad);  // Ellenőrizzük, hogy találtunk adatot

    // Csak akkor engedjük módosítani, ha a felhasználó jogosult rá
    if (ad.user.id !== req.user.id) {
      return res.status(403).json({ message: "Nincs jogosultságod ezt a hirdetést módosítani!" });
    }

    // Ha van módosított mező, frissítjük azt
    if (categoryID !== undefined) {
      // Ha nincs kategória, akkor új kategóriát rendelünk hozzá
      const categoryRepository = AppDataSource.getRepository(Category);
      const category = await categoryRepository.findOne({ where: { id: categoryID } });

      if (!category) {
        return res.status(404).json({ message: "Kategória nem található!" });
      }

      ad.category = category;  // Frissítjük a kategóriát
    }

    if (title !== undefined) ad.title = title;
    if (description !== undefined) ad.description = description;
    if (price !== undefined) ad.price = price;
    if (image !== undefined) ad.imagefilename = image; // Új kép fájl elérési útja

    // Az adatok mentése az adatbázisba
    await adRepository.save(ad);

    res.status(200).json({ message: "Hirdetés sikeresen módosítva!", advertisement: ad });

  } catch (error) {
    console.error("Hiba a hirdetés módosítása során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetés módosításakor.", error });
  }
});


// Hirdetés törlése (Csak a saját hirdetését törölheti)
router.delete("/:id", tokencheck, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const adRepository = AppDataSource.getRepository(Advertisements);
    const ad = await adRepository.findOne({ where: { id }, relations: ["user"] });

    if (!ad) {
      return res.status(404).json({ message: "Hirdetés nem található!" });
    }

    if (ad.user.id !== req.user.id) {
      return res.status(403).json({ message: "Nincs jogosultságod ezt a hirdetést törölni!" });
    }

    await adRepository.remove(ad);

    res.status(200).json({ message: "Hirdetés sikeresen törölve✅!" });

  } catch (error) {
    console.error("Hiba a hirdetés törlése során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetés törlésekor.", error });
  }
});

// Hirdetések lekérése (Mindenki számára elérhető)
router.get("/", tokencheck, async (_req: Request, res: Response) => {
  try {
    // Lekérjük a hirdetéseket, és a kapcsolódó felhasználó adatokat is
    const ads = await AppDataSource.getRepository(Advertisements)
      .createQueryBuilder("ad")
      .leftJoinAndSelect("ad.user", "user")  // Felhasználó adatainak lekérése
      .leftJoinAndSelect("ad.category", "category")  // Kategória adatainak lekérése
      .getMany();

    // Válasz visszaküldése a felhasználó nevével és ID-jával
    res.status(200).json({
      advertisements: ads.map(ad => ({
        id: ad.id,
        title: ad.title,
        price: ad.price,
        description: ad.description,
        category: { 
          id: ad.category.id, // Kategória ID
          name: ad.category.name, // Kategória név
          color: ad.category.color // Kategória szín (ha szükséges)
        },  // Kategória neve
        imageUrl: ad.imagefilename,  // Kép URL-je
        user: {
          id: ad.user.id,           // Felhasználó ID-ja
          name: ad.user.name,       // Felhasználó neve
        }

      })),
    });
  } catch (error) {
    console.error("Hiba a hirdetések lekérése során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetések lekérésekor.", error });
  }
});

// Hirdetések lekérése ID szerint
router.get("/:id", tokencheck, async (req: any, res: any) => {
  try {
    const adId = req.params.id;
    const ad = await AppDataSource.getRepository(Advertisements)
      .createQueryBuilder("ad")
      .leftJoinAndSelect("ad.user", "user")
      .leftJoinAndSelect("ad.category", "category")  // Kategória összekapcsolása
      .where("ad.id = :id", { id: adId })
      .getOne();
    
    if (!ad) {
      return res.status(404).json({ message: "Hirdetés nem található" });
    }
    
    // Kategória részleteinek visszaküldése
    res.status(200).json({
      id: ad.id,
      title: ad.title,
      price: ad.price,
      description: ad.description,
      category: { 
        id: ad.category.id, // Kategória ID
        name: ad.category.name, // Kategória név
        color: ad.category.color // Kategória szín (ha szükséges)
      },
      imageUrl: ad.imagefilename,
      user: {
        id: ad.user.id,
        name: ad.user.name,
        email: ad.user.email,
        address: ad.user.address
      }
    });
  } catch (error) {
    console.error("Hiba a hirdetés lekérése során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetés lekérésekor.", error });
  }
});



// Hirdetések lekérése adott kategóriában
router.get("/category/:categoryName", async (req: any, res: any) => {
  try {
    const { categoryName } = req.params;

    // Először keresd meg a kategóriát a neve alapján
    const category = await AppDataSource.getRepository(Category)
      .createQueryBuilder("category")
      .where("category.name = :categoryName", { categoryName })
      .getOne();

    // Ha nem található a kategória
    if (!category) {
      return res.status(404).json({ message: `Nincs ilyen kategória: ${categoryName}` });
    }

    // Keressük meg az összes hirdetést a kategóriához
    const ads = await AppDataSource.getRepository(Advertisements)
      .createQueryBuilder("ad")
      .where("ad.categoryId = :categoryId", { categoryId: category.id })
      .getMany();

    // Ha nincsenek hirdetések ebben a kategóriában
    if (ads.length === 0) {
      return res.status(404).json({ message: `Nincsenek hirdetések ebben a kategóriában: ${categoryName}` });
    }

    // Kategória név és a hozzá tartozó hirdetések visszaküldése
    res.status(200).json({
      category: category.name,
      advertisements: ads
    });

  } catch (error) {
    console.error("❌ Hiba a kategória szerinti szűrés során:", error);
    res.status(500).json({ message: "Hiba történt a hirdetések lekérésekor.", error });
  }
});

// Képfeltöltés (bejelentkezett felhasználóknak)


// Hirdetés autodelete 1 hét után
cron.schedule("* * * * *", async () => { // Naponta éjfélkor fut
  console.log("🔄 Hirdetések ellenőrzése...");

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  try {
    const adRepository = AppDataSource.getRepository(Advertisements);

    const oldAds = await adRepository
      .createQueryBuilder("ad")
      .where("ad.date < :oneWeekAgo", { oneWeekAgo })
      .getMany();

    if (oldAds.length > 0) {
      await adRepository.remove(oldAds);
      console.log(`✅ ${oldAds.length} régi hirdetés törölve.`);
    } else {
      console.log("ℹ️ Nincsenek lejárt hirdetések.");
    }
  } catch (error) {
    console.error("❌ Hiba a lejárt hirdetések törlése során:", error);
  }
});


export default router;
