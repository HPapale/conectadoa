# ConectaDoa

Sistema de gestão de doações para uma ONG.

Projeto Integrador Extensionista · ADS.

## Requisitos

- Git
- Vite+ (comando vp): https://viteplus.dev
- MariaDB

## Como rodar

1. Clone o repositório e entre na pasta:

   git clone https://github.com/HPapale/conectadoa.git
   cd conectadoa

2. Instale as dependências: vp install
3. Copie .env.example para .env e preencha as credenciais do banco
4. Crie o banco e as tabelas (pode ser executado quantas vezes quiser, ele recria tudo):

   mariadb -u root -p -e "source database/schema.sql"

5. Terminal 1, inicie a API: vp run api
6. Terminal 2, inicie o frontend: vp dev
7. Abra http://localhost:5173
