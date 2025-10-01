"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const Products_1 = require("../entity/Products");
const PaginationService_1 = require("../services/PaginationService");
//entity products
// Criar a Aplicação Express
const router = express_1.default.Router();
//Criar a LISTA
router.get("/products", async (req, res) => {
    try {
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await PaginationService_1.PaginationService.paginate(productRepository, page, limit, { id: "DESC" });
        res.status(200).json(result);
        return;
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao listar a situação!",
        });
        return;
    }
});
//Criar a visualização do item cadastrado em situação
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = await productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        res.status(200).json(product);
        return;
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao visualizar o produto!",
        });
        return;
    }
});
//Criar a rota POST principal
router.post("/situations", async (req, res) => {
    try {
        var data = req.body;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const newProduct = productRepository.create(data);
        await productRepository.save(newProduct);
        res.status(201).json({
            messagem: "Situação cadastrada com sucesso!",
            product: newProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao cadastrar produto!",
        });
    }
});
//====================
//Atualiza os dados do banco de dados
router.put("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        var data = req.body;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = await productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        //Atualiza os dados
        productRepository.merge(product, data);
        //Salvar as alterações de dados
        const updateProduct = await productRepository.save(product);
        res.status(200).json({
            messagem: "Produto atualizado com sucesso!",
            product: updateProduct,
        });
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao atualizar o produto!",
        });
        return;
    }
});
//Remove o item cadastrado no banco de dados
router.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = await productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        //Remover os dados no banco de dados
        await productRepository.remove(product);
        res.status(200).json({
            messagem: "Produto foi removido com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao deletar o produto!",
        });
        return;
    }
});
//Exportar a instrução da rota
exports.default = router;
