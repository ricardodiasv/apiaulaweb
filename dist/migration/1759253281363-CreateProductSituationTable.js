"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductSituationTable1759253281363 = void 0;
const typeorm_1 = require("typeorm");
class CreateProductSituationTable1759253281363 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "productSituation",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment"
                },
                {
                    name: "name",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "createdAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP"
                },
                {
                    name: "updatedAt",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                    onUpdate: "CURRENT_TIMESTAMP"
                }
            ]
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("productSituation");
    }
}
exports.CreateProductSituationTable1759253281363 = CreateProductSituationTable1759253281363;
