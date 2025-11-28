"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPasswordToUsers1764181904283 = void 0;
const typeorm_1 = require("typeorm");
class AddPasswordToUsers1764181904283 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: "password",
            type: "varchar",
            isNullable: false,
        }));
        //Ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE users MODIFY COLUMN password varchar(255) AFTER email`);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("users", "password");
    }
}
exports.AddPasswordToUsers1764181904283 = AddPasswordToUsers1764181904283;
