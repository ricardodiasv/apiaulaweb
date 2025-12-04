
import { DataSource } from "typeorm";
import { Product } from "../entity/Products";
import { ProductCategoria } from "../entity/ProductCategoria";
import { ProductSituation } from "../entity/ProductSituation";

export default class CreateProductsSeeds {
  public async run(dataSource: DataSource): Promise<void> {
    console.log("Iniciando o seed para a tabela 'products'...");

    const productRepository = dataSource.getRepository(Product);
    const productSituationRepository = dataSource.getRepository(ProductSituation);
    const productCategoriaRepository = dataSource.getRepository(ProductCategoria);

    // Verificar se já existem registros na tabela
    const existingCount = await productRepository.count();
    if (existingCount > 0) {
      console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
      return;
    }

    // Buscar situação e categoria
    const situation = await productSituationRepository.findOne({ where: { id: 1 } });
    if (!situation) {
      console.error("Erro: Nenhuma situação encontrada com ID 1. Verifique se a tabela 'productsituation' está populada.");
      return;
    }

    const category = await productCategoriaRepository.findOne({ where: { id: 1 } });
    if (!category) {
      console.error("Erro: Nenhuma categoria encontrada com ID 1. Verifique se a tabela 'productcategoria' está populada.");
      return;
    }

    // Criar os produtos com os campos corretos
    const products = [
      productRepository.create({
        nameProduct: "Curso de Node.js",
        slug: "curso-de-nodejs",
        description : "No Curso de Node.js é abordado o desenvolvimento...",
        price : 500.50,
        productCategoria: category,
        productSituation: situation,
      }),
      productRepository.create({
        nameProduct: "Curso de Node.js e React",
        slug: "curso-de-nodejs-e-react",
        description : "No Curso de Node.js e React é abordado o desenvolvimento...",
        price : 497.80,
        productCategoria: category,
        productSituation: situation,
      }),
    ];

    // Salvar os registros no banco de dados
    await productRepository.save(products);

    console.log("Seed concluído com sucesso: produtos cadastrados!");
  }
}

