//Importar a biblioteca Express
import express from "express";
// Importar variáveis de ambiente
import dotenv from "dotenv";

//Importar a biblioteca para permitir conexão externa
import cors from 'cors';

// Carregando as variaveis do .env
dotenv.config();

// Criar a Aplicação Express
const app = express();

//Criar um middleware para receber os dados no corpo da requisição
app.use(express.json());

//Criar o middleware pare permitir requisição externa
app.use(cors());

//Incluir as Controllers
import TestConnectionController from "./controllers/TestConnectionController";
import AuthController from "./controllers/AuthController";
import UsersController from "./controllers/UsersControllers";
import SituationsController from "./controllers/SituationsController";
import ProductCategoriaController from "./controllers/ProductCategoriaController"
import ProductSituationController from "./controllers/ProductSituationController"
import ProductsController from "./controllers/ProductsController"


//Criar as rotas
app.use('/', TestConnectionController);
app.use('/', AuthController);
app.use('/', UsersController);
app.use('/', SituationsController);
app.use('/', ProductCategoriaController);
app.use('/', ProductSituationController);
app.use('/', ProductsController);

//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, ()=>{
  console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});