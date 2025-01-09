
# OmegaTV

**OmegaTV** é um aplicativo desenvolvido com Angular que tem como objetivo ser uma plataforma de streaming de videos.

## 🚀 Tecnologias

- **Angular** (v18.2.10): Framework principal para desenvolvimento front-end.
- **Auth0 Angular** (v2.2.3): Implementação de autenticação e controle de acesso.
- **PrimeNG** (v17.18.12): Biblioteca de componentes UI.
- **TailwindCSS** (v3.4.15): Framework CSS utilitário para estilização.
- **JSON Server** (v1.0.0-beta.3): Servidor fake para simulação de API.

## 📦 Pré-requisitos

Certifique-se de ter instalado:

- Node.js (v16 ou superior)
- Angular CLI (v18.2.10 ou superior)
- npm (v9 ou superior)

## 🔧 Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/RafaelSd0/OmegaTV
   cd OmegaTV
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure o Auth0 (opcional, se necessário).

## ⚙️ Como executar

- Para iniciar o servidor de desenvolvimento:

  ```bash
  npm start
  ```

  Acesse `http://localhost:4200/` no navegador.

- Para rodar o servidor JSON (simulação de API):

  ```bash
  json-server --watch db.json
  ```

