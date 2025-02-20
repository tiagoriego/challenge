## Setup do projeto de backend

### Pré-requisitos

O que você precisa para configurar o projeto:

- [NPM](https://www.npmjs.com/)
- [Node](https://nodejs.org/en/) `>=22.0.0` (Instale usando [NVM](https://github.com/nvm-sh/nvm))
- [Docker Compose](https://docs.docker.com/compose/)

### Setup

1. **Instale o Docker e o Docker Compose**, caso ainda não tenha.
2. Suba os serviços necessários (PostgreSQL e Redis) com:
   ```bash
   docker-compose up -d
   ```
3. Instale as dependências do projeto:
   ```bash
   nvm use && npm install
   ```
4. Configure o banco de dados:
   ```bash
   npm run db:migrate && npm run db:seed
   ```
5. Inicie o servidor:
   ```bash
   npm run start:dev
   ```
6. Acesse o **Playground do GraphQL**:
   - 👉 [http://localhost:3000/graphql](http://localhost:3000/graphql)

### Tests

Para rodar os testes:

```bash
npm run test
```

e2e:

```bash
npm run test:e2e
```

### Migrations

Caso precise criar novas migrations, utilize o comando:

```bash
npm run db:create_migration --name=create-xpto-table
```

### Refactoring and Implementation

Agora ao rodar o arquivo `test\seed.ts` em ambiente local será apagado todos dados das tabelas: `companies, contents e users`.

REFC 01

- Modifiquei a classe `ContentRepository`, alterei o nome do método `findOne` para `findById` e a forma de buscar os dados utilizando o **TypeORM**.
  O nome do método foi alterado para seguir com o padrão para "não confundir" com o método do **TypeORM** e a remoção da forma de buscar os dados no banco.Estava **SQL puro** e dessa forma corremos um risco de **SQL Injection** (Sobre: https://en.wikipedia.org/wiki/SQL_injection).

REFC/IMPL 02:

- Melhorei a classe `ContentService` o método `provision` adicionando o suporte à documento do tipo texto, retirei as repetições e criei alguns métodos de apoio. Deixei eles com públicos para serem testados, inclusive o método `generateSignedUrl`.

REFC 04:

- Devido as alterações foi necessário mexer em alguns testes modificando ou adicionando novos métodos para manter o covarage em até 80%.

IMPL 05:

- Adicionei o teste e2e.

IMPL 06:

- Adicionei mais uma linha de inserção no arquivo `seed.ts` para contemplar o documento do tipo texto para testes a limpeza das tabelas.
