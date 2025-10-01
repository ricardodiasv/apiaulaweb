import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./Products";

@Entity("productCategoria")
export class ProductCategoria{

  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique: true})
  nameCategoria!: string;

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  updatedAt!: Date;

  @OneToMany(() => Product, (products) => products.productCategoria)
  products!: Product []

}