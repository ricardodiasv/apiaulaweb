"use strict";
// src\seeds\CreateSituationsSeeds.ts
Object.defineProperty(exports, "__esModule", { value: true });
const Situations_1 = require("../entity/Situations");
class CreateSituationsSeeds {
    async run(dataSource) {
        console.log("Iniciando o seed para a tabela 'situation'...");
        const situationRepository = dataSource.getRepository(Situations_1.Situation);
        const existingCount = await situationRepository.count();
        if (existingCount > 0) {
            console.log("A tabela 'situations' já existe dados. Nenhuma alteração foi realizada!");
            return;
        }
        const situations = [
            { nameSituation: "Ativo" },
            { nameSituation: "Inativo" },
            { nameSituation: "Pendente" },
        ];
        await situationRepository.save(situations);
        console.log("Seed concluido com sucesso: situações cadastradas!");
    }
}
exports.default = CreateSituationsSeeds;
