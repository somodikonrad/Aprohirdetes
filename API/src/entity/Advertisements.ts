import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Advertisements extends BaseEntity {
  @PrimaryGeneratedColumn("uuid") // UUID alapú azonosító
  id: string;

  @ManyToOne(() => User, (user) => user.advertisements, { onDelete: "CASCADE" }) 
  @JoinColumn({ name: "userID" }) // Külső kulcs neve az adatbázisban
  user: User; // Ez a kapcsolatot jelöli

  @Column()
  date: Date;

  @Column()
  category: string;

  @Column()
  title: string;
  
  @Column("text")
  description: string;

  @Column()
  price: number;

  @Column("blob")
  image: Buffer;
}
