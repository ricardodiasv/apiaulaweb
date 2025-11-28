"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSlugToProducts1764181321423 = void 0;
const typeorm_1 = require("typeorm");
class AddSlugToProducts1764181321423 {
    async up(queryRunner) {
        await queryRunner.addColumn(`products`, new typeorm_1.TableColumn({
            name: "slug",
            type: "varchar",
            isUnique: true,
            isNullable: false,
        }));
        // Ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE products MODIFY COLUMN slug varchar(255) AFTER nameProduct`);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("products", "slug");
    }
}
exports.AddSlugToProducts1764181321423 = AddSlugToProducts1764181321423;
