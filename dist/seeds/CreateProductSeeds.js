"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Products_1 = require("../entity/Products");
const ProductCategoria_1 = require("../entity/ProductCategoria");
const ProductSituation_1 = require("../entity/ProductSituation");
class CreateProductsSeeds {
    async run(dataSource) {
        console.log("Iniciando o seed para a tabela 'products'...");
        const productRepository = dataSource.getRepository(Products_1.Product);
        const productSituationRepository = dataSource.getRepository(ProductSituation_1.ProductSituation);
        const productCategoriaRepository = dataSource.getRepository(ProductCategoria_1.ProductCategoria);
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
                productCategoria: category,
                productSituation: situation,
            }),
            productRepository.create({
                nameProduct: "Curso de Node.js e React",
                slug: "curso-de-nodejs-e-react",
                productCategoria: category,
                productSituation: situation,
            }),
        ];
        // Salvar os registros no banco de dados
        await productRepository.save(products);
        console.log("Seed concluído com sucesso: produtos cadastrados!");
    }
}
exports.default = CreateProductsSeeds;
