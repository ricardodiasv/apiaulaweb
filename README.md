## Requisitos
* Node.js 22 ou superior

## Sequiencia para criar projeto

Criar o arquivo package
---

npm init
---

Instalar o Express para gerenciar as requisições, rotas e URLs, entre outras funcionalidade.
---

npm i express
---

Instalar os pacotes para suporte ao TypeScript
---

npm i --save-dev @types/express
npm i --save-dev @types/node
---

Instalar o compilador do projeto com TypeScript e reiniciar o projeto quando o arquivo é modificado
---

npm i --save-dev ts-node
---

Compilar o arquivo TypeScript
---

npx tsc
---

Executar o arquivo gerado com o Node.js
---

node dist/index.js
---

Instalar a dependência para rodar processos simultâneo.
---

npm i --save-dev concurrently
---

Compilar o arquivo TypeScript. Executar o arquivo gerado.
---

npm run start:watch
---

criar base de dados no mysql

CREATE DATABASE nodeapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

Instalar a dependência para conectar o Node.js (TS) com BD.

npm install typeorm

npm install reflect-metadata

npm install mysql2
---

Manipular variáveis de ambiente.
---

npm i dotenv --save
---

Instalar os tipos de variáveis para o TypeScript
---

npm i --save-dev @types/dotenv

---

Criar a migração que será usada para criar a tabela no banco de dados
---
npx typeorm migration:create src/migration/CreateSituationTable
---

npx typeorm migration:create src/migration/CreateUsersTable
---

npx typeorm migration:create src/migration/AddSlugToProducts
---

npx typeorm migration:create src/migration/AddPasswordToUsers
---

Executar as migrations para criar as tabelas no banco de dados.
---

npx typeorm migration:run -d dist/data-source.js
---

Executar as seeds para cadastrar registro de teste nas tabelas no banco de dados.
---
node dist/run-seeds.js

Validar formulário
---
npm i yup
---

Permitir requisição externa
---

npm i cors
npm install --save-dev @types/cors