//Importar a biblioteca Express
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { PaginationService } from "../services/PaginationService";


//entity products
// Criar a Aplicação Express
const router = express.Router()

//Criar a LISTA
router.get("/products", async(req:Request, res:Response)=>{
  try{
    const productRepository = AppDataSource.getRepository(Product);

    const page = Number(req.query.page) || 1;
  
    const limit = Number(req.query.limit) || 10;

    const result = await PaginationService.paginate(productRepository, page, limit, {id: "DESC"});
    
    res.status(200).json(result);

    return;

  }catch(error){
    res.status(500).json({
      messagem : "Erro ao listar a situação!",
    });
    return
  }
 

});

//Criar a visualização do item cadastrado em situação
router.get("/products/:id", async(req:Request, res:Response)=>{
  try{

    const { id } = req.params;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({id : parseInt(id!)});

    if(!product){
      res.status(404).json({
          messagem : "Situação não encontrada!",
        });
      return
    }

    res.status(200).json(product);
    return

  }catch(error){
    res.status(500).json({
      messagem : "Erro ao visualizar o produto!",
    });
    return
  }
 

});

//Criar a rota POST principal
router.post("/situations", async(req:Request, res:Response)=>{
  
  try{
    var data = req.body;

    const productRepository = AppDataSource.getRepository(Product);

    const newProduct = productRepository.create(data);

    await productRepository.save(newProduct);

    res.status(201).json({
      messagem : "Situação cadastrada com sucesso!",
      product : newProduct, 
    });

  }catch(error){

    res.status(500).json({
      messagem : "Erro ao cadastrar produto!",
    });


  }

});

//====================

//Atualiza os dados do banco de dados
router.put("/products/:id", async(req:Request, res:Response)=>{
  try{

    const { id } = req.params;

    var data = req.body;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({id : parseInt(id!)});

    if(!product){
      res.status(404).json({
          messagem : "Situação não encontrada!",
        });
      return
    }

    //Atualiza os dados
    productRepository.merge(product, data);

    //Salvar as alterações de dados
    const updateProduct = await productRepository.save(product)

    res.status(200).json({
      messagem : "Produto atualizado com sucesso!",
      product: updateProduct, 
    });

  }catch(error){
    res.status(500).json({
      messagem : "Erro ao atualizar o produto!",
    });
    return
  }
 

});

//Remove o item cadastrado no banco de dados
router.delete("/products/:id", async(req:Request, res:Response)=>{
  try{

    const { id } = req.params;

    const productRepository = AppDataSource.getRepository(Product);

    const product = await productRepository.findOneBy({id : parseInt(id!)});

    if(!product){
      res.status(404).json({
          messagem : "Situação não encontrada!",
        });
      return
    }

    //Remover os dados no banco de dados
    await productRepository.remove(product);

    res.status(200).json({
      messagem : "Produto foi removido com sucesso!",
    });

  }catch(error){
    res.status(500).json({
      messagem : "Erro ao deletar o produto!",
    });
    return
  }
 

});


//Exportar a instrução da rota

export default router