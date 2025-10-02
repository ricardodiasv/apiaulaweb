import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { checkPrimeSync } from "crypto";
import { PaginationService } from "../services/PaginationService";
import { ProductCategoria } from "../entity/ProductCategoria";

const router = express.Router();

router.get("/productCategoria", async (req:Request, res:Response) =>{
    console.log("➡️ Entrou na rota /productCategoria");
    try{ 
        const categoriaRepository = AppDataSource.getRepository(ProductCategoria);
        console.log("Repository carregado:", categoriaRepository.metadata.tableName);

        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        console.log(`page=${page}, limite=${limite}`);

        const result = await PaginationService.paginate(categoriaRepository, page, limite, {id: "DESC"});
        console.log("Paginate retornou", result);

        res.status(200).json(result);
        return;
        
    } catch(error){
        console.error("Erro na rota /productCategoria:", error);
        res.status(500).json({
            mensagem: "Erro ao listar categorias!"
        });
        return;
    }
});

router.get("/productCategoria/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const categoriaRepository = AppDataSource.getRepository(ProductCategoria);

        const categoria = await categoriaRepository.findOneBy({id : parseInt(id!)});

        if(!categoria){
            res.status(404).json({
            mensagem: "Categoria não encontrada!"
             });
            return
        }

        res.status(200).json(categoria);
        return

    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao visualizar categoria!"
        });
        return
    }
})

router.post("/productCategoria", async(req:Request, res:Response) =>{
    
    try{
        var data = req.body;

        const categoriaRepository = AppDataSource.getRepository(ProductCategoria);
        const newCategoria= categoriaRepository.create(data);

        await categoriaRepository.save(newCategoria);

        res.status(201).json({
            mensagem : "Categoria cadastrada com sucesso!",
            situation: newCategoria,
        });
    } catch(error){
        console.error("Erro ao cadastrar categoria:", error);
        res.status(500).json({
            mensagem : "Erro ao cadastrar categoria!",
        });
    }
})

router.put("/productCategoria/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        var data = req.body;

        const categoriaRepository = AppDataSource.getRepository(ProductCategoria);

        const categoria = await categoriaRepository.findOneBy({id : parseInt(id!)});

        if(!categoria){
            res.status(404).json({
            mensagem: "Categoria não encontrada!"
             });
            return
        }

        categoriaRepository.merge(categoria, data);

        const updateCategoria = await categoriaRepository.save(categoria);

        res.status(200).json({
            mensagem: "Categoria atualizada com sucesso!",
            situations: updateCategoria,
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao atualizar categoria!"
        });
        return
    }
})

router.delete("/productCategoria/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const categoriaRepository = AppDataSource.getRepository(ProductCategoria);

        const categoria = await categoriaRepository.findOneBy({id : parseInt(id!)});

        if(!categoria){
            res.status(404).json({
            mensagem: "Categoria não encontrada!"
             });
            return
        }

        await categoriaRepository.remove(categoria);

        res.status(200).json({
            mensagem: "Categoria removida com sucesso!",
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao remover categoria!"
        });
        return
    }
})

export default router