//Importar a biblioteca Express
import express from "express";
// Importar variáveis de ambiente
import dotenv from "dotenv";
// Carregando as variaveis do .env
dotenv.config();

// Criar a Aplicação Express
const app = express();

//Criar um middleware para receber os dados no corpo da requisição
app.use(express.json());

//Incluir as Controllers
import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";
import ProductCategoriaController from "./controllers/ProductCategoriaController"
import ProductSituationController from "./controllers/ProductSituationController"
import ProductsController from "./controllers/ProductsController"


//Criar as rotas
app.use('/', AuthController)
app.use('/', SituationsController)
app.use('/', ProductCategoriaController);
app.use('/', ProductSituationController);
app.use('/', ProductsController)

//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, ()=>{
  console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});