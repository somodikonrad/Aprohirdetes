import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Advertisements } from "./Advertisements";

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: "varchar", length: 7}) 
  color: string; 

  @OneToMany(() => Advertisements, (advertisement) => advertisement.category)
  advertisements: Advertisements[];
}
