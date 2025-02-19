import { AppDataSource } from "../data-source";
import { Category } from "../entity/Category";

// 🔹 Kategóriák seedelése (hozzáadás + törlés)
async function seedDatabase() {
  try {
    const categoryRepository = AppDataSource.getRepository(Category);

    // 🔹 Az aktuálisan kívánt kategóriák listája, színnel együtt
    const categories = [
      { name: "Ingatlan", color: "#FF5733" }, // Orange
      { name: "Gépjármű", color: "#007BFF" }, // Blue
      { name: "Háztartási gép", color: "#28A745" }, // Green
      { name: "Játék", color: "#FFC107" }, // Yellow
      { name: "Ruházat", color: "#6F42C1" }, // Purple
      { name: "Elektronika", color: "#17A2B8" }, // Teal
      { name: "Szolgáltatás", color: "#FF6F61" }, // Coral
      { name: "Sport és szabadidő", color: "#20C997" }, // Light Green
      { name: "Állat", color: "#FD7E14" }, // Orange Red
      { name: "Egyéb", color: "#6C757D" }, // Grey
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

    // 🔹 Új kategóriák hozzáadása vagy frissítésük, ha nincs színük
    for (const newCategory of categories) {
      const existingCategory = await categoryRepository.findOne({ where: { name: newCategory.name } });
      if (!existingCategory) {
        // Save new category with color
        await categoryRepository.save(newCategory);
        console.log(`✅ Hozzáadva: "${newCategory.name}"`);
      } else {
        // If the category already exists and has no color, update it
        if (!existingCategory.color) {
          existingCategory.color = newCategory.color; // Set default color
          await categoryRepository.save(existingCategory);
          console.log(`✅ Szín hozzáadva: "${existingCategory.name}" - "${existingCategory.color}"`);
        } else {
          console.log(`⚠️ Már létezik: "${existingCategory.name}", kihagyva.`);
        }
      }
    }

  } catch (error) {
    console.error("❌ Hiba történt a seedelés során:", error);
  }
}

export { seedDatabase };
