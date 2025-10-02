import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { checkPrimeSync } from "crypto";
import { PaginationService } from "../services/PaginationService";
import { ProductSituation } from "../entity/ProductSituation";

const router = express.Router();

router.get("/productSituation", async (req:Request, res:Response) =>{
    console.log("Entrou na rota /productCategoria");
    try{ 
        const situationRepository = AppDataSource.getRepository(ProductSituation);
        console.log("Repository carregado:", situationRepository.metadata.tableName);

        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        console.log(`page=${page}, limite=${limite}`);

        const result = await PaginationService.paginate(situationRepository, page, limite, {id: "DESC"});
        console.log("Paginate retornou", result);

        res.status(200).json(result);
        return;
        
    } catch(error){
        console.error("Erro na rota /productCategoria:", error);
        res.status(500).json({
            mensagem: "Erro ao listar situações!"
        });
        return;
    }
});

router.get("/productSituation/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const situationRepository = AppDataSource.getRepository(ProductSituation);

        const situation = await situationRepository.findOneBy({id : parseInt(id!)});

        if(!situation){
            res.status(404).json({
            mensagem: "Situação não encontrada!"
             });
            return
        }

        res.status(200).json(situation);
        return

    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao visualizar situação!"
        });
        return
    }
})

router.post("/productSituation", async(req:Request, res:Response) =>{
    
    try{
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(ProductSituation);
        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);

        res.status(201).json({
            mensagem : "Situação cadastrada com sucesso!",
            situation: newSituation,
        });
    } catch(error){
        console.error("Erro ao cadastrar situação:", error);
        res.status(500).json({
            mensagem : "Erro ao cadastrar situação!",
        });
    }
})

router.put("/productSituation/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        var data = req.body;

        const situationRepository = AppDataSource.getRepository(ProductSituation);

        const categoria = await situationRepository.findOneBy({id : parseInt(id!)});

        if(!categoria){
            res.status(404).json({
            mensagem: "Situação não encontrada!"
             });
            return
        }

        situationRepository.merge(categoria, data);

        const updateCategoria = await situationRepository.save(categoria);

        res.status(200).json({
            mensagem: "Situação atualizada com sucesso!",
            situations: updateCategoria,
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao atualizar situação!"
        });
        return
    }
})

router.delete("/productSituation/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const situationRepository = AppDataSource.getRepository(ProductSituation);

        const categoria = await situationRepository.findOneBy({id : parseInt(id!)});

        if(!categoria){
            res.status(404).json({
            mensagem: "Situação não encontrada!"
             });
            return
        }

        await situationRepository.remove(categoria);

        res.status(200).json({
            mensagem: "Situação removida com sucesso!",
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao remover situação!"
        });
        return
    }
})

export default router