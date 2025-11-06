"use strict";
//src\migration\1759253309031-CreateProductCategoriaTable.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateProductCategoriaTable1759253309031 = void 0;
const typeorm_1 = require("typeorm");
class CreateProductCategoriaTable1759253309031 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "productCategoria",
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
        await queryRunner.dropTable("productCategoria");
    }
}
exports.CreateProductCategoriaTable1759253309031 = CreateProductCategoriaTable1759253309031;
