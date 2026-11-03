# Lolá — Aplicativo Infantil do Lumina

A **Lolá** é uma aplicação web infantil que integra o projeto **Lumina**, um sistema de apoio à terapia fonoaudiológica de crianças com desvio fonológico.

Desenvolvida com uma interface lúdica e elementos de gamificação, a Lolá tem como objetivo proporcionar uma experiência mais atrativa para as crianças, incentivando sua participação nas atividades propostas durante o acompanhamento fonoaudiológico.

A aplicação faz parte de um ecossistema composto por três sistemas:

- **Lumina Dashboard:** painel web utilizado pelos fonoaudiólogos para o gerenciamento de pacientes e atividades.
- **Lumina Backend:** API responsável pela autenticação, gerenciamento dos dados e comunicação com o banco de dados.
- **Lolá:** aplicação infantil destinada aos pacientes cadastrados.

## Acesso à aplicação

A Lolá está disponível em:

**https://my-app-orpin-phi-25.vercel.app/**

Outros serviços do projeto:

- **Lumina Dashboard:** https://lumina-frontend-dashboard-seven.vercel.app
- **Lumina Backend:** https://lumina-backend-6mk6.onrender.com

A aplicação pode ser acessada por navegadores em computadores, tablets e dispositivos móveis com conexão à internet.

## Importante: estado atual da aplicação

Embora o repositório tenha sido denominado `lumina-frontend-pwa`, **a Lolá ainda não está configurada como uma Progressive Web App (PWA)**.

Atualmente, trata-se de uma **aplicação web responsiva**, desenvolvida com foco na experiência de utilização em dispositivos móveis.

Sua interface apresenta características visuais semelhantes às de um aplicativo, mas ainda não foram implementados todos os recursos necessários para disponibilizá-la como um PWA instalável.

Entre as configurações previstas para versões futuras estão:

- Manifesto da aplicação.
- Ícones específicos para instalação.
- Service worker para gerenciamento de cache.
- Configuração da experiência de instalação.
- Estratégias de funcionamento offline.

Portanto, nesta versão, **o acesso à Lolá é realizado pelo navegador**, e não por meio de um aplicativo nativo ou de um PWA completamente implementado.

As funcionalidades que dependem do backend necessitam de conexão com a internet.

## Acesso e credenciais

**O acesso à Lolá é permitido somente para pacientes previamente cadastrados por um fonoaudiólogo no Lumina Dashboard.**

A aplicação não disponibiliza uma funcionalidade de cadastro independente para os pacientes.

Para acessar o sistema, é necessário:

1. O fonoaudiólogo realizar o cadastro do paciente no Lumina Dashboard.
2. O sistema gerar as credenciais de acesso correspondentes.
3. O profissional disponibilizar o nome de usuário e a senha ao paciente ou ao seu responsável.
4. O paciente utilizar essas credenciais para realizar o login na Lolá.

**Importante:** não é possível acessar as funcionalidades autenticadas sem possuir um cadastro válido e as respectivas credenciais.

A autenticação é realizada pelo backend, que verifica as informações fornecidas pelo usuário.

### Alteração de senha

A Lolá disponibiliza uma funcionalidade de alteração de senha na área de **Configurações**.

Para utilizá-la, o paciente deve estar autenticado e informar:

- Senha atual.
- Nova senha.
- Confirmação da nova senha.

A nova senha deve possuir pelo menos oito caracteres.

Após a confirmação, os dados são enviados ao backend, responsável por validar a senha atual e armazenar a nova senha de forma protegida.

## Tecnologias utilizadas

O frontend foi desenvolvido com as seguintes tecnologias:

| Tecnologia | Finalidade |
|---|---|
| Next.js 16 | Framework de desenvolvimento web |
| React 19 | Construção das interfaces |
| JavaScript | Implementação das funcionalidades |
| Tailwind CSS 4 | Estilização e responsividade |
| Framer Motion | Animações e transições |
| Lucide React | Biblioteca de ícones |
| Fetch API | Comunicação com o backend |
| Node.js | Ambiente de desenvolvimento |
| npm | Gerenciamento de dependências |
| Vercel | Hospedagem do frontend |

O frontend não possui conexão direta com o banco de dados. As operações que necessitam de persistência são realizadas por meio da API Lumina.

## Funcionalidades

A aplicação contém interfaces e funcionalidades relacionadas às seguintes áreas:

### Autenticação

- Login utilizando credenciais fornecidas pelo fonoaudiólogo.
- Validação das credenciais pelo backend.
- Gerenciamento da sessão do usuário.
- Alteração de senha nas configurações.
- Encerramento da sessão.

### Página inicial

- Interface infantil com identidade visual própria.
- Personagem Lolá.
- Navegação entre as principais áreas.
- Elementos visuais interativos.

### Atividades e fases

- Visualização das fases disponíveis.
- Navegação entre atividades.
- Interface para execução de atividades.
- Recursos visuais e sonoros.
- Elementos de progressão e conclusão de fases.

### Gamificação

- Representação visual de moedas.
- Interface de loja virtual.
- Itens de personalização.
- Avatar do paciente.
- Elementos visuais de recompensa.

### Perfil e comunicação

- Visualização do perfil.
- Interface de mensagens.
- Área de notificações.
- Configurações da aplicação.

> **Observação:** algumas funcionalidades utilizam dados e estruturas locais do frontend, enquanto outras estão integradas à API. A integração completa de todos os recursos faz parte da continuidade do desenvolvimento.

## Pré-requisitos

Para executar o projeto localmente, é necessário possuir:

- Node.js compatível com Next.js 16, preferencialmente uma versão LTS recente.
- npm.
- Git.
- Um editor de código, como o Visual Studio Code.

Para verificar as instalações:

```bash
node -v
npm -v
git --version
```

## Instalação e execução local

### 1. Clonar o repositório

```bash
git clone <URL_DO_REPOSITORIO>
```

Acesse o diretório da aplicação:

```bash
cd lumina-frontend-pwa/my-app
```

O caminho pode variar conforme o nome utilizado ao clonar o repositório.

### 2. Instalar as dependências

```bash
npm install
```

Esse comando instalará as dependências declaradas no arquivo `package.json`.

### 3. Configuração da API

A Lolá utiliza a API Lumina para realizar a autenticação e as operações integradas ao backend.

Por padrão, a aplicação está configurada para utilizar a API hospedada no Render:

```text
https://lumina-backend-6mk6.onrender.com
```

A URL do backend também pode ser definida por meio da variável de ambiente `NEXT_PUBLIC_API_URL`, permitindo utilizar diferentes ambientes de execução.

A criação de um arquivo `.env.local` é **opcional**, sendo necessária apenas quando se deseja configurar um endereço diferente para a API durante o desenvolvimento local.

Por exemplo, para utilizar o backend localmente, pode-se criar um arquivo `.env.local` na pasta `my-app` com o seguinte conteúdo:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

Nesse caso, o backend deverá estar em execução na porta `4000`.

Caso nenhuma variável seja definida, a aplicação utilizará o endereço padrão configurado no código.

> **Observação:** não adicione `/api` ao final do endereço, pois esse prefixo já é utilizado nas requisições do frontend.

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor está configurado para executar na porta `3001`.

Acesse:

```text
http://localhost:3001
```

### 5. Realizar o login

Para utilizar as funcionalidades autenticadas, informe as credenciais de um paciente cadastrado pelo fonoaudiólogo no Lumina Dashboard.

## Integração com o backend

A Lolá utiliza a API Lumina para autenticação e gerenciamento das informações persistidas.

A arquitetura do sistema é composta por duas interfaces independentes que compartilham o mesmo backend:

```text
       Lumina Dashboard
        (Fonoaudiólogo)
               |
               |
               v
          Lumina Backend
           (Node.js API)
               |
               v
           MongoDB Atlas
               ^
               |
               |
              Lolá
           (Paciente)
```

O backend utiliza Node.js e MongoDB Atlas, sendo responsável por centralizar as operações de autenticação e acesso aos dados.

### Configuração da URL da API

O endereço da API pode ser definido por meio da variável de ambiente:

```javascript
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://lumina-backend-6mk6.onrender.com"
).replace(/\/+$/, "");
```

Dessa forma, a aplicação pode utilizar o backend local ou remoto, conforme a configuração do ambiente.

### Principais endpoints

| Método | Endpoint | Finalidade |
|---|---|---|
| POST | `/api/auth/login` | Autenticação do usuário |
| PUT | `/api/auth/senha` | Alteração de senha |
| GET | `/api/pacientes/meu-perfil` | Consulta do perfil do paciente |
| GET | `/api/app/loja` | Consulta de itens da loja |
| GET | `/api/app/inventario` | Consulta do inventário |
| POST | `/api/app/loja/comprar` | Compra de itens |
| PUT | `/api/app/avatar` | Atualização do avatar |
| GET | `/api/app/mensagens` | Consulta de mensagens |
| POST | `/api/app/mensagens` | Envio de mensagens |

As rotas protegidas exigem autenticação por meio de token.

Para informações detalhadas sobre as rotas e regras de negócio, consulte a documentação do Lumina Backend.

## Estrutura do projeto

A organização principal do frontend é apresentada abaixo:

```text
lumina-frontend-pwa/
└── my-app/
    ├── public/
    │   └── audios/
    │
    ├── src/
    │   ├── app/
    │   │   ├── configuracoes/
    │   │   ├── fases/
    │   │   │   └── jogar/
    │   │   │       └── [id]/
    │   │   ├── home/
    │   │   ├── login/
    │   │   │   └── alterar-senha/
    │   │   ├── loja/
    │   │   ├── mensagens/
    │   │   ├── notificacoes/
    │   │   ├── perfil/
    │   │   ├── favicon.ico
    │   │   ├── globals.css
    │   │   ├── layout.js
    │   │   └── page.js
    │   │
    │   ├── assets/
    │   │   ├── icons/
    │   │   └── loja/
    │   │
    │   └── components/
    │       └── loja/
    │
    ├── .gitignore
    ├── eslint.config.mjs
    ├── jsconfig.json
    ├── next.config.mjs
    ├── package.json
    ├── package-lock.json
    └── README.md
```

### Descrição dos principais diretórios

| Diretório | Descrição |
|---|---|
| `public/audios/` | Arquivos de áudio utilizados nas atividades |
| `src/app/` | Páginas e rotas da aplicação |
| `src/app/login/` | Autenticação e alteração de senha |
| `src/app/home/` | Página inicial do aplicativo |
| `src/app/fases/` | Navegação e execução das fases |
| `src/app/loja/` | Loja e personalização |
| `src/app/mensagens/` | Interface de mensagens |
| `src/app/notificacoes/` | Interface de notificações |
| `src/app/perfil/` | Perfil do paciente |
| `src/app/configuracoes/` | Configurações do aplicativo |
| `src/assets/` | Recursos visuais |
| `src/components/` | Componentes reutilizáveis |

## Scripts disponíveis

Os comandos devem ser executados dentro da pasta `my-app`.

### Desenvolvimento

```bash
npm run dev
```

Inicia o servidor de desenvolvimento na porta `3001`.

### Compilação

```bash
npm run build
```

Gera a versão de produção da aplicação.

### Produção

```bash
npm run start
```

Inicia a aplicação compilada.

### Verificação de código

```bash
npm run lint
```

Executa a verificação de código configurada no projeto.

## Hospedagem e deploy

O frontend da Lolá está hospedado na **Vercel**, enquanto a API Lumina está hospedada no **Render**.

Para realizar o deploy:

1. Publicar o código em um repositório Git.
2. Conectar o repositório à Vercel.
3. Configurar o diretório raiz da aplicação como `my-app`, quando necessário.
4. Adicionar a variável de ambiente `NEXT_PUBLIC_API_URL`.
5. Executar o deployment.
6. Verificar a comunicação com a API.

A variável utilizada em produção deve apontar para:

```env
NEXT_PUBLIC_API_URL=https://lumina-backend-6mk6.onrender.com
```

> **Importante:** variáveis com o prefixo `NEXT_PUBLIC_` ficam disponíveis no navegador. Não utilize esse prefixo para armazenar senhas ou informações secretas.

## Limitações da versão atual

A Lolá encontra-se em desenvolvimento e possui algumas limitações.

### PWA ainda não implementado

Apesar do nome do repositório, a aplicação ainda não está configurada como PWA instalável.

Seu funcionamento atual ocorre pelo navegador, por meio de uma interface web responsiva.

### Dependência de conexão

As funcionalidades integradas ao backend dependem de conexão com a internet.

Não há implementação de funcionamento offline completo.

### Integração gradual

Algumas interfaces e funcionalidades ainda utilizam dados locais ou estruturas definidas no frontend.

A integração completa dessas funcionalidades com a API está prevista para etapas futuras.

### Funcionalidades em desenvolvimento

Algumas opções da interface ainda possuem navegação provisória e poderão ser ampliadas ou integradas em versões futuras.

### Acesso restrito

Somente pacientes cadastrados por um fonoaudiólogo e que possuam credenciais válidas podem acessar as funcionalidades autenticadas da aplicação.
