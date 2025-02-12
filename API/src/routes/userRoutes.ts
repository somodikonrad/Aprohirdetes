import express, { Request, Response, NextFunction, Router } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entity/User";
import mysql from "mysql2/promise";
import { generatePassword } from "../utils/password";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcrypt";  // bcrypt importálása
import { isAdmin } from "../utils/isAdmin";
const jwt = require('jsonwebtoken');
dotenv.config();
import ejs from "ejs";
import { invalid } from "joi";

const router = Router();



function generateToken(user: any) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, address: user.address, name: user.name},  // 📌 Role is belekerül a tokenbe
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

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

// 📌 Jelszó érvényesítési szabályok
function validatePassword(password: string): boolean {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  return passwordRegex.test(password);
}



// 📌 Regisztráció
router.post("/register", async (req: any, res: any) => {
  let invalidFields = [];  // A hibás mezők tárolása
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      if (!username) invalidFields.push('username');
      if (!email) invalidFields.push('email');
      if (!password) invalidFields.push('password');
      
      return res.status(400).json({ message: "Hiányzó adatok! (username, email, password szükséges)", invalid: invalidFields });
    }

    if (!validatePassword(password)) {
      invalidFields.push('password');
      return res.status(400).json({ message: "A jelszó nem felel meg az erősségi követelményeknek!" });
    }

    const existingUser = await AppDataSource.getRepository(User).findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Ez az e-mail már létezik!", invalid: ['email'] });
    }

    // Jelszó hash-elése bcrypt-tel
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();
    user.name = username;
    user.email = email;
    user.password = hashedPassword;

    await AppDataSource.getRepository(User).save(user);

    res.status(201).json({
      message: "Sikeres regisztráció!",
      user: { name: user.name, email: user.email },
      token: generateToken(user)
    });

  } catch (error) {
    console.error("Hiba a regisztráció során:", error);
    res.status(500).json({ message: "Hiba történt a regisztráció során", error });
  }
});

// 📌 Bejelentkezés
router.post("/login", async (req: any, res: any) => {
  let invalidFields = [];  // A hibás mezők tárolása
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      if (!email) invalidFields.push('email');
      if (!password) invalidFields.push('password');
      
      return res.status(400).json({ message: "Hiányzó adatok! (username, password szükséges)", invalid: invalidFields });
    }

    const user = await AppDataSource.getRepository(User).findOne({ where: { email } });
    if (!user) {
      invalidFields.push('user');
      return res.status(400).json({ message: "Felhasználó nem található!", invalid: invalidFields });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Hibás jelszó!" });
    }

    // A válaszban most már tartalmazza a felhasználó nevét is
    res.status(200).json({
      message: "Sikeres bejelentkezés!",
      token: generateToken(user),
      user: {
        id: user.id,
        email: user.email,
        username: user.name, 
        address: user.address,// Itt a `name` mezőt használjuk, ami a `username`
        role: user.role // Role szintén
      }
    });

  } catch (error) {
    console.error("Hiba a bejelentkezés során:", error);
    res.status(500).json({ message: "Hiba történt a bejelentkezés során", error });
  }
});

// 📌 Felhasználók kilistázása (csak adminoknak)
router.get('/', tokencheck, isAdmin, async (_req: any, res: any) => {
  try {
    const users = await AppDataSource.getRepository(User).find({
      select: ["id", "name", "email",], // Válaszd ki, mely mezőket szeretnél visszakapni
    });
 
    res.status(200).json({ users });
  } catch (error) {
    console.error("Hiba a felhasználók kilistázása során:", error);
    res.status(500).json({ message: "Hiba történt a felhasználók lekérésekor." + error });
  }
});

// Felhasználók id alapján (Csak adminoknak)
router.get("/:id", tokencheck, isAdmin, async (req: any, res: any) => {
  try {
    const userId = req.params.id;

    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
      select: ["id", "name", "email", "role"], // Nem adjuk vissza a jelszót
    });

    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található!" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Hiba a felhasználó lekérése során:", error);
    res.status(500).json({ message: "Hiba történt a felhasználó lekérésekor.", error });
  }
});

// Felhasználó törlése id alapján (Csak adminoknak)
// 📌 Felhasználó törlése ID alapján (csak adminoknak)
router.delete("/:id", tokencheck, isAdmin, async (req: any, res: any) => {
  try {
    const userId = req.params.id;

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ message: "Felhasználó nem található!" });
    }

    await userRepository.remove(user);
    res.status(200).json({ message: `✅ Felhasználó törölve: ${user.email}` });

  } catch (error) {
    console.error("❌ Hiba történt a felhasználó törlése során:", error);
    res.status(500).json({ message: "Hiba történt a felhasználó törlésekor.", error });
  }
});




export default router;
