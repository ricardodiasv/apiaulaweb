"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const PaginationService_1 = require("../services/PaginationService");
const ProductSituation_1 = require("../entity/ProductSituation");
const router = express_1.default.Router();
router.get("/productSituation", async (req, res) => {
    console.log("Entrou na rota /productCategoria");
    try {
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        console.log("Repository carregado:", situationRepository.metadata.tableName);
        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;
        console.log(`page=${page}, limite=${limite}`);
        const result = await PaginationService_1.PaginationService.paginate(situationRepository, page, limite, { id: "DESC" });
        console.log("Paginate retornou", result);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("Erro na rota /productCategoria:", error);
        res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });
        return;
    }
});
router.get("/productSituation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id) });
        if (!situation) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }
        res.status(200).json(situation);
        return;
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar situação!"
        });
        return;
    }
});
router.post("/productSituation", async (req, res) => {
    try {
        var data = req.body;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const newSituation = situationRepository.create(data);
        await situationRepository.save(newSituation);
        res.status(201).json({
            mensagem: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    }
    catch (error) {
        console.error("Erro ao cadastrar situação:", error);
        res.status(500).json({
            mensagem: "Erro ao cadastrar situação!",
        });
    }
});
router.put("/productSituation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        var data = req.body;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const categoria = await situationRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }
        situationRepository.merge(categoria, data);
        const updateCategoria = await situationRepository.save(categoria);
        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situations: updateCategoria,
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao atualizar situação!"
        });
        return;
    }
});
router.delete("/productSituation/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(ProductSituation_1.ProductSituation);
        const categoria = await situationRepository.findOneBy({ id: parseInt(id) });
        if (!categoria) {
            res.status(404).json({
                mensagem: "Situação não encontrada!"
            });
            return;
        }
        await situationRepository.remove(categoria);
        res.status(200).json({
            mensagem: "Situação removida com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover situação!"
        });
        return;
    }
});
exports.default = router;
