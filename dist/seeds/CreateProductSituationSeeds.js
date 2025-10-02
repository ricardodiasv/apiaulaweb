"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ProductSituation_1 = require("../entity/ProductSituation");
class CreateSituationCategoriaSeeds {
    async run(dataSource) {
        console.log("Iniciando o seed para a tabela 'productsSituation'...");
        const productSituationRepository = dataSource.getRepository(ProductSituation_1.ProductSituation);
        const existingCount = await productSituationRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'productSituation' já existe dados. Nenhuma alteração foi realizada!");
            return;
        }
        const productSituation = [
            { name: "Ativo" },
        ];
        await productSituationRepository.save(productSituation);
        console.log("Seed concluido com sucesso: Situações dos produtos cadastradas!");
    }
}
exports.default = CreateSituationCategoriaSeeds;
