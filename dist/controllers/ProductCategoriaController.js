"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const PaginationService_1 = require("../services/PaginationService");
const ProductCategoria_1 = require("../entity/ProductCategoria");
const router = express_1.default.Router();
router.get("/productCategoria", async (req, res) => {
    console.log("➡️ Entrou na rota /productCategoria");
    try {
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        console.log("Repository carregado:", categoriaRepository.metadata.tableName);
        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;
        console.log(`page=${page}, limite=${limite}`);
        const result = await PaginationService_1.PaginationService.paginate(categoriaRepository, page, limite, { id: "DESC" });
        console.log("Paginate retornou", result);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("Erro na rota /productCategoria:", error);
        res.status(500).json({
            mensagem: "Erro ao listar categorias!"
        });
        return;
    }
});
router.get("/productCategoria/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const categoria = await categoriaRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }
        res.status(200).json(categoria);
        return;
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar categoria!"
        });
        return;
    }
});
router.post("/productCategoria", async (req, res) => {
    try {
        var data = req.body;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const newCategoria = categoriaRepository.create(data);
        await categoriaRepository.save(newCategoria);
        res.status(201).json({
            mensagem: "Categoria cadastrada com sucesso!",
            situation: newCategoria,
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar categoria:", error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar categoria!",
        });
    }
});
router.put("/productCategoria/:id", async (req, res) => {
    try {
        const { id } = req.params;
        var data = req.body;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const categoria = await categoriaRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }
        categoriaRepository.merge(categoria, data);
        const updateCategoria = await categoriaRepository.save(categoria);
        res.status(200).json({
            mensagem: "Categoria atualizada com sucesso!",
            situations: updateCategoria,
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar categoria!"
        });
        return;
    }
});
router.delete("/productCategoria/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const categoriaRepository = data_source_1.AppDataSource.getRepository(ProductCategoria_1.ProductCategoria);
        const categoria = await categoriaRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Categoria não encontrada!"
            });
            return;
        }
        await categoriaRepository.remove(categoria);
        res.status(200).json({
            mensagem: "Categoria removida com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover categoria!"
        });
        return;
    }
});
exports.default = router;
