"use strict";
//src\seeds\CreateProductSeeds.ts
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = require("../entity/Products");
class CreateProductsSeeds {
    async run(dataSource) {
        console.log("Iniciando o seed para a tabela 'products'...");
        const productRepository = dataSource.getRepository(Products_1.Product);
        const existingCount = await productRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'products' já existe dados. Nenhuma alteração foi realizada!");
            return;
        }
        const products = [
            { nameProduct: "Produto1" },
            { productCategoryId: 1 },
            { productSituationId: 1 },
        ];
        await productRepository.save(products);
        console.log("Seed concluido com sucesso: Produtos cadastrados!");
    }
}
exports.default = CreateProductsSeeds;
