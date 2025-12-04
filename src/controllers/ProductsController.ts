import { error } from "console";
import express, {Request, Response} from "express";
import { AppDataSource } from "../data-source";
import { checkPrimeSync } from "crypto";
import { PaginationService } from "../services/PaginationService";
import { Product } from "../entity/Products";
import * as yup from 'yup';
import slugify from "slugify";
import { Not } from "typeorm";

const router = express.Router();

router.get("/products", async (req:Request, res:Response) =>{
    console.log("Entrou na rota /productproduct");
    try{ 
        const productRepository = AppDataSource.getRepository(Product);
        console.log("Repository carregado:", productRepository.metadata.tableName);

        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;

        console.log(`page=${page}, limite=${limite}`);

        const result = await PaginationService.paginate(productRepository, page, limite, {id: "DESC"}, ["productSituation"]);
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

        const product = await productRepository.findOne({
          relations: ["productSituation"],
          where: { id: parseInt(id!) }
        });

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
    // Receber os dados enviados no corpo da requisição
    var data = req.body;

    // Validar os dados utilizando o yup
    const schema = yup.object().shape({
        name: yup
          .string()
          .required("O campo nome é obrigatório!")
          .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
          .max(255, "O campo nome deve ter no máximo 255 caracteres!"),

        slug: yup
          .string()
          .required("O campo slug é obrigatório!")
          .min(3, "O campo slug deve ter no mínimo 3 caracteres!")
          .max(255, "O campo slug deve ter no máximo 255 caracteres!"),

        description: yup
          .string()
          .required("O campo slug é obrigatório!")
          .min(10, "O campo slug deve ter no mínimo 10 caracteres!"),

        price: yup
          .number()
          .typeError("O preço deve ser um número!")
          .required("O campo preço é obrigatório!")
          .positive("O preço deve ser um valor positivo")
          .test(
              "is-decimal",
              "O preço deve ter no máximo duas casas decimais!",
              (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
          ),

          situation: yup
            .number()
            .typeError("A situação deve ser um número!")
            .required("O campo situação é obrigatório!")
            .integer("O campo situação deve ser um número inteiro!")
            .positive("O campo situação deve ser um valor positivo!"),

            category: yup
              .number()
              .typeError("A categoria deve ser um número!")
              .required("O campo categoria é obrigatório!")
              .integer("O campo categoria deve ser um número inteiro!")
              .positive("O campo categoria deve ser um valor positivo"),
    })

    // Verificar se os dados passaram pela validação
    await schema.validate(data, { abortEarly: false });

    // Gerar slug automaticamente com base no nome
    data.slug = slugify(data.slug, { lower: true, strict: true });

    // Criar uma instância do repositório de Product
    const productRepository = AppDataSource.getRepository(Product);

    // Recuperar o registro do banco de dados com o valor da coluna slug
    const existingProduct = await productRepository.findOne({
      where: { slug: data.slug }
    });

    // Verificar se já existe um produto com o mesmo slug
    if(existingProduct){
      res.status(400).json({
        message: "Já existe um produto cadastrado com esse slug!",
      });
      return;
    }

    // Criar um novo registro
    const newProduct = productRepository.create(data);

    // Salvar o registro no banco de dados
    await productRepository.save(newProduct);

    // Retornar resposta de sucesso
    res.status(201).json({
      message: "Produto cadastrado com sucesso!",
      product: newProduct,
    });
  } catch (error) {
    if(error instanceof yup.ValidationError){
      // Retornar erros de validação
      res.status(400).json({
        message: error.errors
      });
      return;
    }

    // Retornar erro em caso de falha
    res.status(500).json({
      message: "Erro ao cadastrar produto!",
    });
  }
});

// Criar a rota para editar um produto
// Endereço para acessar a API através da aplicação externa com o verbo PUT: http://localhost:8080/products/:id
// A aplicação externa deve indicar que está enviado os dados em formato de objeto: Content-Type: application/json
// Dados em formato de objeto
/*
{
    "name":"Curso de Node.js",
    "description" : "No Curso de Node.js é abordado o desenvolvimento...",
    "price" : 497,
    "situation":1,
    "category": 1
}
*/

router.put("/products/:id", async (req:Request, res:Response) =>{
    try{
      // Obter o ID da situação a partir dos parâmetros da requisição
      const { id } = req.params;

      // Receber os dados enviados no corpo da requisição
      const data = req.body;

      //Validar os dados utilizando o yup
      const schema = yup.object().shape({
        name: yup
        .string()
        .required("O campo nome é obrigatório!")
        .min(3, "O campo nome deve ter no mínimo 3 caracteres!")
        .max(255, "O campo nome deve ter no máximo 255 caracteres!"),

      slug: yup
        .string()
        .required("O campo slug é obrigatório!")
        .min(3, "O campo slug deve ter no mínimo 3 caracteres!")
        .max(255, "O campo slug deve ter no máximo 255 caracteres!"),

      description: yup
        .string()
        .required("O campo slug é obrigatório!")
        .min(10, "O campo slug deve ter no mínimo 10 caracteres!"),

      price: yup
        .number()
        .typeError("O preço deve ser um número!")
        .required("O campo preço é obrigatório!")
        .positive("O preço deve ser um valor positivo")
        .test(
            "is-decimal",
            "O preço deve ter no máximo duas casas decimais!",
            (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")
        ),

        situation: yup
          .number()
          .typeError("A situação deve ser um número!")
          .required("O campo situação é obrigatório!")
          .integer("O campo situação deve ser um número inteiro!")
          .positive("O campo situação deve ser um valor positivo!"),

          category: yup
            .number()
            .typeError("A categoria deve ser um número!")
            .required("O campo categoria é obrigatório!")
            .integer("O campo categoria deve ser um número inteiro!")
            .positive("O campo categoria deve ser um valor positivo"),
      });

      // Verificar se os dados passaram pela validação
      await schema.validate(data, { abortEarly: false });

      // Obter o repositório do entidade Product
      const productRepository = AppDataSource.getRepository(Product);

      // Buscar o produto no banco de dados pelo ID
      const product = await productRepository.findOneBy({ id: parseInt(id!) });

      // Verificar se o produto foi encontrado
      if(!product){
        res.status(404).json({
          message: "Produto não encontrado",
        });
        return;
      }

      // Gerar slug automaticamente com base no nome
      data.slug = slugify(data.slug, { lower: true, strict: true });

      // Recuperar o registro do banco de dados com o valor da coluna email
      const existingProduct = await productRepository.findOne({
        where: {
          slug: data.slug,
          id: Not(parseInt(id!)) // Exclui o próprio registro da busca
        }
      });

      // Verificar se já existe um produto com o mesmo slug
      if(existingProduct){
        res.status(400).json({
            message: "Já existe um produto cadastrado com esse slug!",
        });
        return;
      }

      // Atualizar os dados do produto
      productRepository.merge(product, data);

      // Salvar as alterações no banco de dados
      const updateProduct = await productRepository.save(product);

      // Retornar resposta de sucesso
      res.status(200).json({
        message: "Produto atualizado com sucesso!",
        product: updateProduct,
      });


    } catch(error){
      if(error instanceof yup.ValidationError){
        // Retornar erros de validação
        res.status(400).json({
          message: error.errors
        });
        return;
      }

      // Retornar erro em caso de falha
        res.status(500).json({
            mensagem: "Erro ao atualizar produto!"
        });
    }
});

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

