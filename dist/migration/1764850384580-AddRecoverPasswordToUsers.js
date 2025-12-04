"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddRecoverPasswordToUsers1764850384580 = void 0;
const typeorm_1 = require("typeorm");
class AddRecoverPasswordToUsers1764850384580 {
    async up(queryRunner) {
        await queryRunner.addColumn('users', new typeorm_1.TableColumn({
            name: "recoverPassword",
            type: "varchar",
            isUnique: true,
            isNullable: true,
        }));
        //Ajustar a ordem da coluna
        await queryRunner.query(`ALTER TABLE users MODIFY COLUMN recoverPassword varchar(255) AFTER password`);
    }
    async down(queryRunner) {
        await queryRunner.dropColumn("users", "recoverPassword");
    }
}
exports.AddRecoverPasswordToUsers1764850384580 = AddRecoverPasswordToUsers1764850384580;
