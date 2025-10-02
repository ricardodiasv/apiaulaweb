import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateProductTable1759347128124 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
                   name: "products",
                   columns: [
                       {
                           name: "id",
                           type: "int",
                           isPrimary: true,
                           isGenerated: true,
                           generationStrategy: "increment"
                       },
                       {
                           name: "nameProduct",
                           type: "varchar"
                       },
                       
                       {
                           name: "productCategoryId",
                           type: "int",
                       },
                       {
                           name: "productSituationId",
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
                   "products",
                   new TableForeignKey({
                       columnNames: ["productCategoryId"],
                       referencedTableName: "productCategoria",
                       referencedColumnNames: ["id"],
                       onDelete: "CASCADE",
                   })
               );
               
               await queryRunner.createForeignKey(
                   "products",
                   new TableForeignKey({
                       columnNames: ["productSituationId"],
                       referencedTableName: "productSituation",
                       referencedColumnNames: ["id"],
                       onDelete: "CASCADE",
                   })
               );
               
   }

   public async down(queryRunner: QueryRunner): Promise<void> {
       const table = await queryRunner.getTable("products");
   
       // Verifica e remove a foreign key de productCategoryId
       const categoryForeignKey = table?.foreignKeys.find((fk) =>
           fk.columnNames.includes("productCategoryId")
       );
       if (categoryForeignKey) {
           await queryRunner.dropForeignKey("products", categoryForeignKey);
       }
   
       // Verifica e remove a foreign key de productSituationId
       const situationForeignKey = table?.foreignKeys.find((fk) =>
           fk.columnNames.includes("productSituationId")
       );
       if (situationForeignKey) {
           await queryRunner.dropForeignKey("products", situationForeignKey);
       }
   
       // Remove a tabela
       await queryRunner.dropTable("products");
   }

}
