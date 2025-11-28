"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./data-source");
const CreateProductCategoriaSeeds_1 = __importDefault(require("./seeds/CreateProductCategoriaSeeds"));
const CreateProductSeeds_1 = __importDefault(require("./seeds/CreateProductSeeds"));
const CreateProductSituationSeeds_1 = __importDefault(require("./seeds/CreateProductSituationSeeds"));
const CreateSituationsSeeds_1 = __importDefault(require("./seeds/CreateSituationsSeeds"));
const CreateUsersSeed_1 = __importDefault(require("./seeds/CreateUsersSeed"));
const runSeeds = async () => {
    console.log("Conectando ao banco de dados...");
    await data_source_1.AppDataSource.initialize();
    console.log("Banco de dados conectado!");
    try {
        //Cria a instancia da classes de seed
        const situationsSeeds = new CreateSituationsSeeds_1.default();
        const userSeed = new CreateUsersSeed_1.default();
        const productCategoriaSeeds = new CreateProductCategoriaSeeds_1.default();
        const productSituationSeeds = new CreateProductSituationSeeds_1.default();
        const productSeeds = new CreateProductSeeds_1.default();
        //Executa as Seeds
        await situationsSeeds.run(data_source_1.AppDataSource);
        await userSeed.run(data_source_1.AppDataSource);
        await productCategoriaSeeds.run(data_source_1.AppDataSource);
        await productSituationSeeds.run(data_source_1.AppDataSource);
        await productSeeds.run(data_source_1.AppDataSource);
    }
    catch (error) {
        console.log("Erro ao executar o seed:", error);
    }
    finally {
        await data_source_1.AppDataSource.destroy();
        console.log("Conexão com o banco de dados encerrada.");
    }
};
runSeeds();
