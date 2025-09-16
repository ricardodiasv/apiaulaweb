import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

// Importar variáveis de ambiente
import dotenv from "dotenv";
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
  entities: [],
  subscribers: [],
  
migrations: [
  // aceita rodar tanto em src (.ts) quanto em dist (.js)
  path.join(__dirname, "migration", "*.{js,ts}").replace(/\\/g, "/"),
],

})