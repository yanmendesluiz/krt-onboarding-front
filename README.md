# KRT Onboarding Front

Front-end em Angular 11.1 para consumir a API `Krt.Onboarding.Api`.

## Versões esperadas

- Node.js: 16.14.2
- Angular CLI: 11.1.4
- Angular: 11.1.2
- TypeScript: 4.1.6

## Funcionalidades

- Listagem de contas
- Cadastro de conta
- Edição de conta
- Exclusão de conta
- Validação de CPF com 11 dígitos
- Integração com a API via `HttpClient`
- Proxy local para evitar problema de CORS em desenvolvimento

## Como rodar

Na raiz do projeto:

```bash
nvm use
npm install
npm start
```

O front sobe normalmente em:

```text
http://localhost:4200
```

## API esperada

O projeto espera que a API esteja rodando em:

```text
https://localhost:7158
```

O proxy está configurado no arquivo:

```text
proxy.conf.json
```

Qualquer chamada para `/api` será redirecionada para a API .NET.

## Endpoints consumidos

```text
GET    /api/accounts
GET    /api/accounts/{id}
POST   /api/accounts
PUT    /api/accounts/{id}
DELETE /api/accounts/{id}
```

## Estrutura

```text
src/app
├── core
│   ├── models
│   └── services
└── features
    └── accounts
        ├── account-list
        └── account-form
```

## Observação sobre Node 16 e Angular 11

O projeto foi montado com as versões solicitadas. Caso ocorra algum problema de compatibilidade de dependências antigas, rode:

```bash
npm install --legacy-peer-deps
```

