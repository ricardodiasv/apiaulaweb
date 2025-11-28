import { AppDataSource } from "./data-source"
import CreateProductCategoriaSeeds from "./seeds/CreateProductCategoriaSeeds";
import CreateProductsSeeds from "./seeds/CreateProductSeeds";
import CreateSituationCategoriaSeeds from "./seeds/CreateProductSituationSeeds";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateUsersSeeds from "./seeds/CreateUsersSeed";

const runSeeds = async() =>{
  console.log("Conectando ao banco de dados...")

  await AppDataSource.initialize();
  console.log("Banco de dados conectado!")

  try{
    //Cria a instancia da classes de seed
    const situationsSeeds = new CreateSituationsSeeds();
    const userSeed = new CreateUsersSeeds();
    const productCategoriaSeeds = new CreateProductCategoriaSeeds();
    const productSituationSeeds = new CreateSituationCategoriaSeeds();
    const productSeeds = new CreateProductsSeeds();

    //Executa as Seeds
    await situationsSeeds.run(AppDataSource);
    await userSeed.run(AppDataSource);
    await productCategoriaSeeds.run(AppDataSource);
    await productSituationSeeds.run(AppDataSource);
    await productSeeds.run(AppDataSource);
    

  }catch(error){

      console.log("Erro ao executar o seed:", error);

  }finally{

    await AppDataSource.destroy();
    console.log("Conexão com o banco de dados encerrada.");

  }
};

runSeeds();