import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateUsersTable1757955546919 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.createTable(new Table({
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

                await queryRunner.createForeignKey(
                    "users",
                    new TableForeignKey({
                        columnNames: ["situationId"],
                        referencedTableName: "situations",
                        referencedColumnNames: ["id"],
                        onDelete: "CASCADE",

                    })
                )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("users");
        const foreignKey = table?.foreignKeys.find((fk)=>fk.columnNames.includes("situationId"))
        if(foreignKey){
            await queryRunner.dropForeignKey("users", foreignKey)
        }
        await queryRunner.dropTable("users")
    }

}
