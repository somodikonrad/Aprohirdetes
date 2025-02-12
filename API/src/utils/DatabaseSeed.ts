import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";
 
// 🔹 Don't reinitialize AppDataSource in the seedDatabase!
async function seedDatabase() {
    try {
      const categoryRepository = AppDataSource.getRepository(Category);
 
      // A kérdések, amiket hozzá akarunk adni
      const categories = [
        {name: "Ingatlan"},
        {name: "Gépjármű"},
        {name: "Háztartási gép"},
        {name: "Játék"},
        {name: "Ruházat"},
        {name: "Elektronika"},
        {name: "Szolgáltatás"},
        {name: "Sport és szabadidő"},
        {name: "Állat"},
        {name: "Egyéb"},
        
      ];
 
      for (const newCategory of categories) {
        // Ellenőrizzük, hogy már létezik-e ugyanolyan kérdés az adatbázisban
        const existingCategories = await categoryRepository.findOne({ where: { name: newCategory.name } });
        if (!existingCategories) {
          // Ha nem létezik, hozzáadjuk
          await categoryRepository.save(newCategory);
          console.log(`✅ Question added: "${newCategory.name}"`);
        } else {
          console.log(`⚠️ Question already exists: "${newCategory.name}", skipping.`);
        }
      }
 
    } catch (error) {
      console.error("❌ Error occurred during seeding:", error);
    }
}
 
export { seedDatabase }