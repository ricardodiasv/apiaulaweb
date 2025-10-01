import { Entity, PrimaryGeneratedColumn, Column, OneToMany, JoinColumn, ManyToMany, ManyToOne } from "typeorm"
import { ProductCategoria } from "./ProductCategoria";
import { ProductSituation } from "./ProductSituation";

@Entity("products")
export class Product{
  @PrimaryGeneratedColumn()
  id!: number

  @Column({unique: true})
  nameProduct!: string;

  @ManyToOne(() => ProductCategoria, (productCategoria) => productCategoria.products)
  @JoinColumn({name: "productCategoryId" })
  productCategoria!: ProductCategoria;

  @ManyToOne(() => ProductSituation, (productSituation) => productSituation.products)
  @JoinColumn({name: "productSituationId"})
  productSituation!: ProductSituation;


  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  createdAt!: Date;

  @Column({type: "timestamp", default:() => "CURRENT_TIMESTAMP"})
  updatedAt!: Date;
}