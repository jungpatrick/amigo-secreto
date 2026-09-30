# 🎁 Amigo Secreto

Aplicação web **Full Stack** para criação e gerenciamento de sorteios de Amigo Secreto, permitindo cadastrar grupos, participantes, realizar o sorteio de forma individual por grupo e compartilhar o resultado de maneira privada por WhatsApp e e-mail.

🔗 **Aplicação:** https://amigosecreto.codestation.pro

---

## 📌 Sobre o projeto

O **Amigo Secreto** foi desenvolvido como uma aplicação web completa, desde a interface e regras de negócio até persistência de dados, autenticação, controle de acesso, sorteio e publicação em produção.

A aplicação permite que um usuário:

* crie uma conta;
* faça login;
* crie e gerencie grupos de Amigo Secreto;
* cadastre participantes;
* realize o sorteio de cada grupo;
* compartilhe individualmente o resultado por WhatsApp;
* envie os resultados por e-mail;
* disponibilize um link privado para cada participante descobrir quem tirou;
* cadastre uma lista de desejos após descobrir seu amigo secreto.

O projeto também implementa mecanismos de segurança no banco de dados utilizando **Row Level Security (RLS)** e funções **RPC** do PostgreSQL para operações que não devem ficar diretamente expostas ao cliente.

---

## ✨ Funcionalidades

### 👤 Autenticação

* Cadastro de usuários
* Login
* Logout
* Recuperação/redefinição de senha
* Gerenciamento de sessão utilizando Supabase Auth

### 🎲 Grupos

* Criação de grupos
* Nome, descrição e data do evento
* Listagem dos grupos do usuário
* Acesso aos detalhes de cada grupo
* Edição das informações do grupo

### 👥 Participantes

* Cadastro de participantes
* Nome, e-mail e telefone
* Inclusão automática do criador como participante
* Adição e remoção de participantes antes do sorteio
* Visualização dos participantes cadastrados

### 🔀 Sorteio

* Sorteio realizado individualmente por grupo
* Distribuição aleatória dos participantes
* Cada participante recebe apenas uma pessoa
* Geração de token individual para acesso ao resultado
* Controle para evitar alterações indevidas após a realização do sorteio

### 🔐 Resultado privado

Cada participante recebe um link exclusivo para consultar seu resultado:

```text
/reveal/{token}
```

O participante não precisa estar autenticado para acessar o resultado.

O sistema utiliza uma função RPC protegida no PostgreSQL para recuperar somente as informações necessárias para o participante.

### 🎁 Lista de desejos

Após descobrir seu amigo secreto, o participante pode cadastrar suas preferências de presentes.

* Campo de texto para sugestões
* Limite de 300 caracteres
* Informações vinculadas ao participante sorteado
* Consulta através de função RPC

### 📱 WhatsApp

Após o sorteio, é possível enviar individualmente o resultado de cada participante pelo WhatsApp.

A mensagem contém o link privado para acesso ao resultado.

### 📧 E-mail

Também é possível enviar os resultados dos participantes por e-mail através de uma **Supabase Edge Function**.

A função utiliza credenciais armazenadas como variáveis de ambiente, mantendo informações sensíveis fora do código-fonte.

### 📱 Responsividade

A interface foi desenvolvida para funcionar em:

* Desktop
* Tablet
* Smartphones

O cabeçalho possui navegação adaptada para dispositivos móveis.

---

## 🛠️ Tecnologias utilizadas

### Front-end

* **React**
* **Vite**
* **JavaScript (ES6+)**
* **HTML5**
* **CSS3**

### Back-end / Dados

* **Supabase**
* **PostgreSQL**
* **Supabase Auth**
* **Row Level Security (RLS)**
* **PostgreSQL RPC**
* **Supabase Edge Functions**

### Integrações

* WhatsApp via compartilhamento de links
* Serviço de envio de e-mails através de Edge Function

### Deploy

* **Hostinger**
* Vite Build
* Apache
* `.htaccess` para suporte a SPA Routing

### Controle de versão

* **Git**
* **GitHub**

---

## 🏗️ Arquitetura

A aplicação utiliza uma arquitetura baseada em React no cliente e Supabase como plataforma de backend.

```text
┌─────────────────────────────────────┐
│             USUÁRIO                 │
│        Desktop / Mobile             │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│          React + Vite               │
│                                     │
│  Pages / Components / Context       │
│  Routing / Services / UI            │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│             Supabase                │
│                                     │
│  ┌─────────────┐  ┌──────────────┐ │
│  │ Auth        │  │ PostgreSQL   │ │
│  │             │  │              │ │
│  │ Usuários    │  │ Groups       │ │
│  │ Sessões     │  │ Participants │ │
│  └─────────────┘  │ Profiles     │ │
│                   └──────┬───────┘ │
│                          │         │
│                    RLS + RPC      │
│                          │         │
│                   ┌──────▼──────┐  │
│                   │ Edge        │  │
│                   │ Functions   │  │
│                   └─────────────┘  │
└─────────────────────────────────────┘
                   │
          ┌────────┴─────────┐
          ▼                  ▼
      WhatsApp             E-mail
```

---

## 🔐 Segurança

Um dos objetivos do projeto foi evitar que informações privadas do sorteio ficassem disponíveis diretamente para usuários não autorizados.

### Row Level Security

As tabelas do Supabase utilizam **Row Level Security (RLS)** para controlar o acesso aos dados.

Isso permite que as operações sejam restringidas de acordo com o usuário autenticado e as regras definidas para cada tabela.

### Sorteio privado

Os resultados do sorteio não são disponibilizados através de uma consulta pública direta à tabela de participantes.

O acesso ao resultado utiliza um **token individual** associado ao participante.

A aplicação utiliza uma função PostgreSQL:

```text
get_secret_reveal()
```

para retornar somente os dados necessários para a página de revelação.

### Lista de desejos

A gravação da lista de desejos também utiliza uma função RPC:

```text
save_secret_wishlist()
```

com limite de 300 caracteres aplicado no banco.

### Variáveis de ambiente

Informações sensíveis utilizadas pela aplicação e pelas Edge Functions não são armazenadas diretamente no código-fonte.

O projeto utiliza variáveis de ambiente para configurações como:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_APP_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
```

O arquivo `.env` utilizado no ambiente local não faz parte do repositório.

Um arquivo `.env.example` é disponibilizado apenas como referência para configuração do ambiente.

---

## 📂 Estrutura principal

```text
amigo-secreto/
│
├── public/
│   ├── favicon.svg
│   ├── icons.svg
│   └── share-preview.jpg
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   ├── functions/
│   │   └── send-emails/
│   ├── config.toml
│   └── .gitignore
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

---

## 🔄 Fluxo principal

```text
Cadastro / Login
       │
       ▼
    Dashboard
       │
       ▼
  Criar grupo
       │
       ▼
Adicionar participantes
       │
       ▼
 Realizar sorteio
       │
       ▼
Gerar tokens individuais
       │
       ├───────────────┐
       ▼               ▼
   WhatsApp          E-mail
       │               │
       └───────┬───────┘
               ▼
        Link individual
               │
               ▼
       Revelação do amigo
               │
               ▼
        Lista de desejos
```

---

## 🌐 Rotas principais

| Rota               | Descrição                          |
| ------------------ | ---------------------------------- |
| `/`                | Página inicial                     |
| `/login`           | Login                              |
| `/cadastro`        | Cadastro                           |
| `/dashboard`       | Dashboard do usuário               |
| `/group/:id`       | Detalhes do grupo                  |
| `/reveal/:token`   | Revelação privada do amigo secreto |
| `/minha-conta`     | Conta do usuário                   |
| `/redefinir-senha` | Redefinição de senha               |

---

## 🚀 Execução local

### 1. Clonar o repositório

```bash
git clone https://github.com/jungpatrick/amigo-secreto.git
cd amigo-secreto
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as variáveis necessárias.

Utilize o arquivo:

```text
.env.example
```

como referência.

### 4. Executar em desenvolvimento

```bash
npm run dev
```

A aplicação será disponibilizada pelo Vite em ambiente local.

---

## 📦 Build de produção

Para gerar a versão de produção:

```bash
npm run build
```

O resultado será criado no diretório:

```text
dist/
```

Para testar a versão de produção localmente:

```bash
npm run preview
```

---

## 🎯 Objetivos técnicos do projeto

Além da construção da interface, o projeto teve como objetivos práticos:

* desenvolver uma aplicação React completa;
* trabalhar com autenticação real;
* integrar React com PostgreSQL através do Supabase;
* aplicar regras de acesso utilizando RLS;
* utilizar funções RPC para operações específicas;
* trabalhar com tokens para acesso privado;
* integrar serviços externos;
* criar uma Edge Function;
* tratar rotas privadas e públicas;
* implementar responsividade;
* configurar uma aplicação SPA para produção;
* realizar deploy em hospedagem real;
* utilizar Git e GitHub para versionamento.

---

## 📚 Conceitos praticados

Durante o desenvolvimento foram trabalhados conceitos como:

* React Hooks
* Context API
* React Router
* Componentização
* Estado e ciclo de vida
* Formulários
* Autenticação
* CRUD
* PostgreSQL
* Relacionamentos entre tabelas
* RLS
* RPC
* Edge Functions
* Variáveis de ambiente
* Tokens
* Integrações externas
* SPA Routing
* Deploy
* Git
* GitHub

---

## 📸 Preview

A aplicação possui uma interface responsiva desenvolvida especificamente para o fluxo de criação, gerenciamento e revelação do Amigo Secreto.

> Screenshots da aplicação podem ser adicionados posteriormente nesta seção.

---

## 📄 Status do projeto

**MVP concluído e publicado em produção.**

O projeto foi desenvolvido como aplicação prática de estudo e portfólio, abrangendo desde o desenvolvimento do front-end até backend, banco de dados, segurança, integrações e deploy.

---

## 👨‍💻 Desenvolvedor

**Patrick Jungles**

Desenvolvedor de Soluções Web e Inteligência Artificial.

* GitHub: https://github.com/jungpatrick
* Aplicação: https://amigosecreto.codestation.pro
