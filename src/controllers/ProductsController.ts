import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { checkPrimeSync } from "crypto";
import { PaginationService } from "../services/PaginationService";
import { Product } from "../entity/Products";

const router = express.Router();

router.get("/products", async (req:Request, res:Response) =>{
    console.log("Entrou na rota /productproduct");
    try{ 
        const productRepository = AppDataSource.getRepository(Product);
        console.log("Repository carregado:", productRepository.metadata.tableName);

        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        console.log(`page=${page}, limite=${limite}`);

        const result = await PaginationService.paginate(productRepository, page, limite, {id: "DESC"});
        console.log("Paginate retornou", result);

        res.status(200).json(result);
        return;
        
    } catch(error){
        console.error("Erro na rota /product:", error);
        res.status(500).json({
            mensagem: "Erro ao listar produto!"
        });
        return;
    }
});

router.get("/products/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({id : parseInt(id!)});

        if(!product){
            res.status(404).json({
            mensagem: "Produto não encontrado!"
             });
            return
        }

        res.status(200).json(product);
        return

    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao visualizar produto!"
        });
        return
    }
})



router.post("/products", async (req: Request, res: Response) => {
  try {
    const ct = (req.headers["content-type"] || "").toLowerCase();
    if (!ct.includes("application/json")) {
      return res.status(415).json({
        mensagem: "Envie o corpo como JSON (Content-Type: application/json)",
      });
    }

    // Extração e validação
    let { nameProduct, productCategoryId, productSituationId } = req.body ?? {};
    if (typeof nameProduct !== "string" || !nameProduct.trim()) {
      return res.status(400).json({ mensagem: "nameProduct é obrigatório" });
    }
    nameProduct = nameProduct.trim();

    if (productCategoryId === undefined || productSituationId === undefined) {
      return res.status(400).json({
        mensagem: "productCategoryId e productSituationId são obrigatórios",
      });
    }

    productCategoryId = Number(productCategoryId);
    productSituationId = Number(productSituationId);

    if (!Number.isInteger(productCategoryId) || !Number.isInteger(productSituationId)) {
      return res.status(400).json({
        mensagem: "productCategoryId e productSituationId devem ser inteiros",
      });
    }

    const [cat] = await AppDataSource.query(
      "SELECT id FROM productCategoria WHERE id = ? LIMIT 1",
      [productCategoryId]
    );
    if (!cat) {
      return res.status(400).json({ mensagem: "Categoria (productCategoryId) inexistente" });
    }

    const [sit] = await AppDataSource.query(
      "SELECT id FROM productSituation WHERE id = ? LIMIT 1",
      [productSituationId]
    );
    if (!sit) {
      return res.status(400).json({ mensagem: "Situação (productSituationId) inexistente" });
    }

    const productRepository = AppDataSource.getRepository(Product);
    const newProduct = productRepository.create({
      nameProduct,
      productCategoria: { id: productCategoryId } as any,   // relação -> coluna FK
      productSituation: { id: productSituationId } as any,  // relação -> coluna FK
    });

    const saved = await productRepository.save(newProduct);

    return res.status(201).json({
      mensagem: "Produto cadastrado com sucesso!",
      product: saved,
    });
  } catch (error: any) {
    if (error?.errno === 1452) {
      return res.status(400).json({
        mensagem: "Categoria/Situação não encontrada (FK inválida)",
      });
    }
    if (error?.errno === 1062) {
      return res.status(409).json({ mensagem: "Registro duplicado" });
    }
    console.error("Erro ao cadastrar produto:", error);
    return res.status(500).json({ mensagem: "Erro ao cadastrar produto!" });
  }
});

router.put("/products/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        var data = req.body;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({id : parseInt(id!)});

        if(!product){
            res.status(404).json({
            mensagem: "produto não encontrada!"
             });
            return
        }

        productRepository.merge(product, data);

        const updateproduct = await productRepository.save(product);

        res.status(200).json({
            mensagem: "produto atualizada com sucesso!",
            Products: updateproduct,
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao atualizar produto!"
        });
        return
    }
})

router.delete("/products/:id", async (req:Request, res:Response) =>{
    try{

        const {id} = req.params;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({id : parseInt(id!)});

        if(!product){
            res.status(404).json({
            mensagem: "Produto não encontrado!"
             });
            return
        }

        await productRepository.remove(product);

        res.status(200).json({
            mensagem: "produto removido com sucesso!",
        });
    } catch(error){
        res.status(500).json({
            mensagem: "Erro ao remover produto!"
        });
        return
    }
})

export default router