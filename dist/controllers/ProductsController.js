"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("../data-source");
const PaginationService_1 = require("../services/PaginationService");
const Products_1 = require("../entity/Products");
const yup = __importStar(require("yup"));
const slugify_1 = __importDefault(require("slugify"));
const typeorm_1 = require("typeorm");
const router = express_1.default.Router();
router.get("/products", async (req, res) => {
    console.log("Entrou na rota /productproduct");
    try {
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        console.log("Repository carregado:", productRepository.metadata.tableName);
        const page = Number(req.query.page) || 1;
        const limite = Number(req.query.limite) || 10;
        console.log(`page=${page}, limite=${limite}`);
        const result = await PaginationService_1.PaginationService.paginate(productRepository, page, limite, { id: "DESC" }, ["productSituation", "productCategoria"]);
        console.log("Paginate retornou", result);
        res.status(200).json(result);
        return;
    }
    catch (error) {
        console.error("Erro na rota /product:", error);
        res.status(500).json({
            mensagem: "Erro ao listar produto!"
        });
        return;
    }
});
router.get("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = await productRepository.findOne({
            relations: ["productSituation", "productCategoria"],
            where: { id: parseInt(id) }
        });
        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }
        res.status(200).json(product);
        return;
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao visualizar produto!"
        });
        return;
    }
});
/*
{
    "name":"Curso de Node.js",
    "description" : "No Curso de Node.js é abordado o desenvolvimento...",
    "price" : 497,
    "situation":1,
    "category": 1
}
*/
router.post("/products", async (req, res) => {
    try {
        // Receber os dados enviados no corpo da requisição
        var data = req.body;
        // Validar os dados utilizando o yup
        const schema = yup.object().shape({
            nameProduct: yup
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
                .required("O campo description é obrigatório!")
                .min(10, "O campo description deve ter no mínimo 10 caracteres!"),
            price: yup
                .number()
                .typeError("O preço deve ser um número!")
                .required("O campo preço é obrigatório!")
                .positive("O preço deve ser um valor positivo")
                .test("is-decimal", "O preço deve ter no máximo duas casas decimais!", (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")),
            productSituation: yup
                .number()
                .typeError("A situação deve ser um número!")
                .required("O campo situação é obrigatório!")
                .integer("O campo situação deve ser um número inteiro!")
                .positive("O campo situação deve ser um valor positivo!"),
            productCategoria: yup
                .number()
                .typeError("A categoria deve ser um número!")
                .required("O campo categoria é obrigatório!")
                .integer("O campo categoria deve ser um número inteiro!")
                .positive("O campo categoria deve ser um valor positivo"),
        });
        // Verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });
        // Gerar slug automaticamente com base no nome
        data.slug = (0, slugify_1.default)(data.slug, { lower: true, strict: true });
        // Criar uma instância do repositório de Product
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        // Recuperar o registro do banco de dados com o valor da coluna slug
        const existingProduct = await productRepository.findOne({
            where: { slug: data.slug }
        });
        // Verificar se já existe um produto com o mesmo slug
        if (existingProduct) {
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
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
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
router.put("/products/:id", async (req, res) => {
    try {
        // Obter o ID da situação a partir dos parâmetros da requisição
        const { id } = req.params;
        // Receber os dados enviados no corpo da requisição
        const data = req.body;
        //Validar os dados utilizando o yup
        const schema = yup.object().shape({
            nameProduct: yup
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
                .test("is-decimal", "O preço deve ter no máximo duas casas decimais!", (value) => /^\d+(\.\d{1,2})?$/.test(value?.toString() || "")),
            productSituation: yup
                .number()
                .typeError("A situação deve ser um número!")
                .required("O campo situação é obrigatório!")
                .integer("O campo situação deve ser um número inteiro!")
                .positive("O campo situação deve ser um valor positivo!"),
            productCategoria: yup
                .number()
                .typeError("A categoria deve ser um número!")
                .required("O campo categoria é obrigatório!")
                .integer("O campo categoria deve ser um número inteiro!")
                .positive("O campo categoria deve ser um valor positivo"),
        });
        // Verificar se os dados passaram pela validação
        await schema.validate(data, { abortEarly: false });
        // Obter o repositório do entidade Product
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        // Buscar o produto no banco de dados pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id) });
        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado",
            });
            return;
        }
        // Gerar slug automaticamente com base no nome
        data.slug = (0, slugify_1.default)(data.slug, { lower: true, strict: true });
        // Recuperar o registro do banco de dados com o valor da coluna email
        const existingProduct = await productRepository.findOne({
            where: {
                slug: data.slug,
                id: (0, typeorm_1.Not)(parseInt(id)) // Exclui o próprio registro da busca
            }
        });
        // Verificar se já existe um produto com o mesmo slug
        if (existingProduct) {
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
    }
    catch (error) {
        if (error instanceof yup.ValidationError) {
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
router.delete("/products/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const productRepository = data_source_1.AppDataSource.getRepository(Products_1.Product);
        const product = await productRepository.findOneBy({ id: parseInt(id) });
        if (!product) {
            res.status(404).json({
                mensagem: "Produto não encontrado!"
            });
            return;
        }
        await productRepository.remove(product);
        res.status(200).json({
            mensagem: "produto removido com sucesso!",
        });
    }
    catch (error) {
        res.status(500).json({
            mensagem: "Erro ao remover produto!"
        });
        return;
    }
});
exports.default = router;
