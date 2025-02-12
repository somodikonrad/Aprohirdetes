import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
 
// 🔹 Kategóriák seedelése (hozzáadás + törlés)
async function seedDatabase() {
    try {
      const categoryRepository = AppDataSource.getRepository(Category);
 
      // 🔹 Az aktuálisan kívánt kategóriák listája
      const categories = [
        { name: "Ingatlan" },
        { name: "Gépjármű" },
        { name: "Háztartási gép" },
        { name: "Játék" },
        { name: "Ruházat" },
        { name: "Elektronika" },
        { name: "Szolgáltatás" },
        { name: "Sport és szabadidő" },
        { name: "Állat" },
        { name: "Egyéb" }, 
        
      ];

      // 🔹 Megnézzük, mi van jelenleg az adatbázisban
      const existingCategories = await categoryRepository.find();

      // 🔹 Töröljük azokat a kategóriákat, amelyek nincsenek a listában
      for (const existingCategory of existingCategories) {
        if (!categories.some(c => c.name === existingCategory.name)) {
          await categoryRepository.remove(existingCategory);
          console.log(`🗑️ Törölve: "${existingCategory.name}"`);
        }
      }

      // 🔹 Új kategóriák hozzáadása
      for (const newCategory of categories) {
        const existingCategory = await categoryRepository.findOne({ where: { name: newCategory.name } });
        if (!existingCategory) {
          await categoryRepository.save(newCategory);
          console.log(`✅ Hozzáadva: "${newCategory.name}"`);
        } else {
          console.log(`⚠️ Már létezik: "${newCategory.name}", kihagyva.`);
        }
      }

    } catch (error) {
      console.error("❌ Hiba történt a seedelés során:", error);
    }
}
 
export { seedDatabase };
