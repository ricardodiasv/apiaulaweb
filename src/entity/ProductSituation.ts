// src\entity\ProductSituation.ts

import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Products";

@Entity("productSituation")
export class ProductSituation{
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({unique: true})
  name!: string;

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  createdAt!: Date

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  updatedAt!: Date

  @OneToMany(() => Product, (products) => products.productSituation)
  products!: Product []
}