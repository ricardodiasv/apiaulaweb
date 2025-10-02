import { DataSource } from "typeorm"
import { Product } from "../entity/Products";
import { ProductCategoria } from "../entity/ProductCategoria"
export default class CreateProductCategoriaSeeds {

  public async run (dataSource: DataSource):Promise<void>{
    console.log("Iniciando o seed para a tabela 'productsCategoria'...")

    const productCategoriaRepository = dataSource.getRepository(ProductCategoria);

    const existingCount = await productCategoriaRepository.count()

    if(existingCount > 0){
      console.log("A tabela 'productsCategoria' já existe dados. Nenhuma alteração foi realizada!");
      return;
    }

   
    const productCategoria = [
      {name: "Teste"},
    ]
    

    await productCategoriaRepository.save(productCategoria);

    console.log("Seed concluido com sucesso: Categorias cadastradas!")


  }

}