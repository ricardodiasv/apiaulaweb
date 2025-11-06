//src\seeds\CreateProductSeeds.ts

import { DataSource } from "typeorm"
import { Product } from "../entity/Products";
export default class CreateProductsSeeds {

  public async run (dataSource: DataSource):Promise<void>{
    console.log("Iniciando o seed para a tabela 'products'...")

    const productRepository = dataSource.getRepository(Product);

    const existingCount = await productRepository.count()

    if(existingCount > 0){
      console.log("A tabela 'products' já existe dados. Nenhuma alteração foi realizada!");
      return;
    }

    const products = [
      {nameProduct: "Produto1"},
      {productCategoryId: 1},
      {productSituationId: 1},
    ]

    await productRepository.save(products);

    console.log("Seed concluido com sucesso: Produtos cadastrados!")


  }

}