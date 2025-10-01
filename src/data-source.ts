import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { Situation } from "./entity/Situations";
import { User } from "./entity/Users";

// Importar variáveis de ambiente
import dotenv from "dotenv";
import { Product } from "./entity/Products";
import { ProductSituation } from "./entity/ProductSituation";
import { ProductCategoria } from "./entity/ProductCategoria";
// Carregando as variaveis do .env
dotenv.config();

  const dialect = process.env.DB_DIALECT ?? "mysql"
export const AppDataSource = new DataSource({
  type: dialect as "mysql" | "mariadb" | "postgres" | "mongodb",
  host: process.env.DB_HOST!,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_DATABASE!,
  synchronize: false,
  logging: true,
  entities: [Situation, User, ProductCategoria, ProductSituation, Product],
  subscribers: [],
  
migrations: [
  // aceita rodar tanto em src (.ts) quanto em dist (.js)
  path.join(__dirname, "migration", "*.{js,ts}").replace(/\\/g, "/"),
],

});

//Inicializar a conexão com BD

AppDataSource.initialize().then(()=>{
  console.log("Conexão do banco de dados realizado com sucesso!")
}).catch((error)=>{
  
  console.log("Erro na conexão com o banco de dados!", error)
})
