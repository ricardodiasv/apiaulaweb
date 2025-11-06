// src\seeds\CreateProductSituationSeeds.ts

import { DataSource } from "typeorm"
import { Product } from "../entity/Products";
import { ProductCategoria } from "../entity/ProductCategoria"
import { ProductSituation } from "../entity/ProductSituation";
export default class CreateSituationCategoriaSeeds {

  public async run (dataSource: DataSource):Promise<void>{
    console.log("Iniciando o seed para a tabela 'productsSituation'...")

    const productSituationRepository = dataSource.getRepository(ProductSituation);

    const existingCount = await productSituationRepository.count()

    if(existingCount > 0){
      console.log("A tabela 'productSituation' já existe dados. Nenhuma alteração foi realizada!");
      return;
    }

   
    const productSituation = [
      {name: "Ativo"},
    ]
    

    await productSituationRepository.save(productSituation);

    console.log("Seed concluido com sucesso: Situações dos produtos cadastradas!")


  }

}