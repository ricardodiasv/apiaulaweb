"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductCategoria_1 = require("../entity/ProductCategoria");
class CreateProductCategoriaSeeds {
    async run(dataSource) {
        console.log("Iniciando o seed para a tabela 'productsCategoria'...");
        const productCategoriaRepository = dataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const existingCount = await productCategoriaRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'productsCategoria' já existe dados. Nenhuma alteração foi realizada!");
            return;
        }
        const productCategoria = [
            { name: "Teste" },
        ];
        await productCategoriaRepository.save(productCategoria);
        console.log("Seed concluido com sucesso: Categorias cadastradas!");
    }
}
exports.default = CreateProductCategoriaSeeds;
