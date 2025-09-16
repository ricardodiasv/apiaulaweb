"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUsersTable1757955546919 = void 0;
const typeorm_1 = require("typeorm");
class CreateUsersTable1757955546919 {
    async up(queryRunner) {
        await queryRunner.createTable(new typeorm_1.Table({
            name: "users",
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
                    type: "varchar"
                },
                {
                    name: "email",
                    type: "varchar",
                    isUnique: true,
                },
                {
                    name: "situationId",
                    type: "int",
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
        //CRIAR CHAVE ESTRANGEIRA
        await queryRunner.createForeignKey("users", new typeorm_1.TableForeignKey({
            columnNames: ["situationId"],
            referencedTableName: "situations",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        const table = await queryRunner.getTable("users");
        const foreignKey = table?.foreignKeys.find((fk) => fk.columnNames.includes("situationId"));
        if (foreignKey) {
            await queryRunner.dropForeignKey("users", foreignKey);
        }
        await queryRunner.dropTable("users");
    }
}
exports.CreateUsersTable1757955546919 = CreateUsersTable1757955546919;
