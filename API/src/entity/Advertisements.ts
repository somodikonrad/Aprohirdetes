import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { Category } from "./Category";

@Entity()
export class Advertisements extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => User, (user) => user.advertisements, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userID" })
  user: User;

  @Column()
  date: Date;

  @ManyToOne(() => Category, (category) => category.advertisements, { nullable: false })
  @JoinColumn({ name: "categoryID" })
  category: Category; // Kategória kapcsolat

  @Column()
  title: string;
  
  @Column("text")
  description: string;

  @Column()
  price: number;

  @Column("blob", { nullable: true }) // Kép opcionálisan lehet null
  image: Buffer;
}
