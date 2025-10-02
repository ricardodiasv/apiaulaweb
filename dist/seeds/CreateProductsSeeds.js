"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Ajuste os caminhos conforme sua estrutura:
const Products_1 = require("../entity/Products");
const ProductCategoria_1 = require("../entity/ProductCategoria");
const ProductSituation_1 = require("../entity/ProductSituation");
class CreateProductsSeeds {
    async run(dataSource) {
        console.log("Iniciando o seed para a tabela 'products'...");
        const productRepo = dataSource.getRepository(Products_1.Product);
        const categoryRepo = dataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const situationRepo = dataSource.getRepository(ProductSituation_1.ProductSituation);
        // Seed idempotente
        if (await productRepo.count()) {
            console.log("A tabela 'products' já possui dados. Nenhuma alteração foi realizada!");
            return;
        }
        // Helper para garantir number (sem undefined) vindos de Map.get
        const mustGet = (map, key) => {
            const v = map.get(key);
            if (v == null) {
                throw new Error(`Valor não encontrado no Map para a chave: '${key}'. Verifique se os seeds de categoria/situação rodaram.`);
            }
            return v;
        };
        // 1) Categorias mínimas
        const categoriasDesejadas = ["Padrão", "Ferramentas", "Eletrônicos"];
        // Use a propriedade da ENTIDADE (nameCategoria), não "name"
        const categoriasExistentes = await categoryRepo
            .createQueryBuilder("c")
            .where("c.nameCategoria IN (:...names)", { names: categoriasDesejadas })
            .getMany();
        const nomesCategoriasExistentes = new Set(categoriasExistentes.map((c) => c.nameCategoria));
        const novasCategorias = categoriasDesejadas
            .filter((n) => !nomesCategoriasExistentes.has(n))
            .map((n) => categoryRepo.create({ nameCategoria: n }));
        if (novasCategorias.length) {
            await categoryRepo.save(novasCategorias);
        }
        // Recarrega categorias com ids
        const categorias = await categoryRepo.find();
        const catPorNome = new Map(categorias.map((c) => [c.nameCategoria, c.id]));
        // 2) Situações mínimas
        const situacoesDesejadas = ["Ativo", "Inativo"];
        // Use a propriedade da ENTIDADE (nameProductSituation), não "name"
        const situacoesExistentes = await situationRepo
            .createQueryBuilder("s")
            .where("s.nameProductSituation IN (:...names)", { names: situacoesDesejadas })
            .getMany();
        const nomesSituacoesExistentes = new Set(situacoesExistentes.map((s) => s.nameProductSituation));
        const novasSituacoes = situacoesDesejadas
            .filter((n) => !nomesSituacoesExistentes.has(n))
            .map((n) => situationRepo.create({ nameProductSituation: n }));
        if (novasSituacoes.length) {
            await situationRepo.save(novasSituacoes);
        }
        // Recarrega situações com ids
        const situacoes = await situationRepo.find();
        const sitPorNome = new Map(situacoes.map((s) => [s.nameProductSituation, s.id]));
        // 3) Resolve IDs (com checagem)
        const idFerramentas = catPorNome.has("Ferramentas")
            ? mustGet(catPorNome, "Ferramentas")
            : mustGet(catPorNome, "Padrão");
        const idEletronicos = catPorNome.has("Eletrônicos")
            ? mustGet(catPorNome, "Eletrônicos")
            : mustGet(catPorNome, "Padrão");
        const idAtivo = mustGet(sitPorNome, "Ativo");
        const idInativo = mustGet(sitPorNome, "Inativo");
        // 4) Cria produtos (IDs numéricos nas FKs)
        const produtosData = [
            { nameProduct: "Produto1", productCategoria: idFerramentas, productSituationId: idAtivo },
            { nameProduct: "Produto2", productCategoria: idFerramentas, productSituationId: idAtivo },
            { nameProduct: "Produto3", productCategoria: idEletronicos, productSituationId: idInativo },
        ];
        const produtos = productRepo.create(produtosData);
        await productRepo.save(produtos);
        console.log("Seed concluído com sucesso: 'products' cadastrados!");
    }
}
exports.default = CreateProductsSeeds;
