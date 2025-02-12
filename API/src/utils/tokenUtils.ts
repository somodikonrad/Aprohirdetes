import { NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";  // Ensure you set this in your .env

// Function to generate JWT
export const generateToken = (userId: number, email: string) => {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "1h" });  // Token expires in 1 hour
};

// Function to verify JWT
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export function tokencheck(req: any, res: any, next: NextFunction) {
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
