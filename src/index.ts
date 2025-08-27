//Importar a biblioteca Express
import express from "express";
// Importar variáveis de ambiente
import dotenv from "dotenv";
// Carregando as variaveis do .env
dotenv.config();

// Criar a Aplicação Express
const app = express()

//Incluir as Controllers
import login from "./controllers/login";

//Criar as rotas
app.use('/', login)

//Iniciar o servidor na porta 8080
app.listen(process.env.PORT, ()=>{
  console.log(`Servidor iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`)
});