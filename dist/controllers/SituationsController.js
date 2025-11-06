"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Importar a biblioteca Express
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const Situations_1 = require("../entity/Situations");
const PaginationService_1 = require("../services/PaginationService");
const yup = __importStar(require("yup"));
const typeorm_1 = require("typeorm");
// Criar a Aplicação Express
const router = express_1.default.Router();
//Criar a LISTA
router.get("/situations", async (req, res) => {
    try {
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const result = await PaginationService_1.PaginationService.paginate(situationRepository, page, limit, { id: "DESC" });
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
router.get("/situations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id) });
        if (!situation) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        res.status(200).json(situation);
        return;
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao visualizar a situação!",
        });
        return;
    }
});
//Criar a rota POST principal
router.post("/situations", async (req, res) => {
    try {
        var data = req.body;
        const schema = yup.object().shape({
            nameSituation: yup.string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
        });
        await schema.validate(data, { abortEarly: false });
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const existingSituation = await situationRepository.findOne({
            where: { nameSituation: data.nameSituation }
        });
        if (existingSituation) {
            res.status(400).json({
                messagem: "Já existe uma situação cadastrada com esse nome!"
            });
            return;
        }
        const newSituation = situationRepository.create(data);
        await situationRepository.save(newSituation);
        res.status(201).json({
            messagem: "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                messagem: error.errors
            });
            return;
        }
        res.status(500).json({
            messagem: "Erro ao cadastrar situação!",
        });
    }
});
//Atualiza os dados do banco de dados
router.put("/situations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        var data = req.body;
        const schema = yup.object().shape({
            nameSituation: yup.string()
                .required("O campo nome é obrigatório!")
                .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
        });
        await schema.validate(data, { abortEarly: false });
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id) });
        if (!situation) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        const existingSituation = await situationRepository.findOne({
            where: {
                nameSituation: data.nameSituation,
                id: (0, typeorm_1.Not)(parseInt(id)),
            }
        });
        if (existingSituation) {
            res.status(400).json({
                messagem: "Já existe uma situação cadastrada com esse nome!"
            });
            return;
        }
        //Atualiza os dados
        situationRepository.merge(situation, data);
        //Salvar as alterações de dados
        const updateSituation = await situationRepository.save(situation);
        res.status(200).json({
            messagem: "Situação atualizada com sucesso!",
            situation: updateSituation,
        });
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                messagem: error.errors
            });
            return;
        }
        res.status(500).json({
            messagem: "Erro ao atualizar a situação!",
        });
    }
});
//Remove o item cadastrado no banco de dados
router.delete("/situations/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const situationRepository = data_source_1.AppDataSource.getRepository(Situations_1.Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id) });
        if (!situation) {
            res.status(404).json({
                messagem: "Situação não encontrada!",
            });
            return;
        }
        //Remover os dados no banco de dados
        await situationRepository.remove(situation);
        res.status(200).json({
            messagem: "Situação foi removida com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            messagem: "Erro ao deletar a situação!",
        });
        return;
    }
});
//Exportar a instrução da rota
exports.default = router;
