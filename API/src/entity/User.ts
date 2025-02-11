import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, BeforeInsert, OneToMany } from "typeorm";
import * as bcrypt from "bcrypt";
import { Advertisements } from "./Advertisements";

export enum UserRole {
    ADMIN = "admin",
    USER = "user"
}

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") // UUID alapú azonosító
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ unique: true }) // E-mail egyedi kell legyen
  email: string;

  @Column()
  password: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER, 
  })
  role: UserRole;

  // 📌 Egy felhasználó több hirdetést is feladhat
  @OneToMany(() => Advertisements, (advertisement) => advertisement.user)
  advertisements: Advertisements;

  
}
