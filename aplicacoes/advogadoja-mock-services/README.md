# AdvogadoJá+ Mock Services

Aplicação React + servidor HTTP local para simular o backend e as integrações do AdvogadoJá+.

## O ponto principal

O painel React e um aplicativo Flutter externo podem conversar com **a mesma Mock API**. A API mantém o estado em memória, executa handlers, aplica cenários e injeta falhas. Assim o cliente não precisa saber se a resposta veio do Firebase/Stripe/Maps reais ou do laboratório mock — desde que o contrato usado pelo cliente seja equivalente.

## Dados incorporados

O pacote materializa os dados fictícios fornecidos na base `dados_previstos_no_banco`, preservando os conjuntos previstos para usuários, clientes, advogados, escritórios, solicitações, assinaturas, pagamentos, suporte, denúncias, privacidade, notificações e outros.

Também estão representadas as operações encontradas no inventário legado, mas isso **não decide** que elas serão Cloud Functions no MVP final.

## Rodar

```bash
npm install
npm run validate
npm run validate:imports
npm run typecheck
npm test
```

### Terminal 1 — servidor mock

```bash
npm run mock:api
```

A API sobe por padrão em `http://localhost:8787`.

### Terminal 2 — painel React

```bash
npm run dev
```

O painel usa `VITE_MOCK_API_URL=http://localhost:8787`.

## Endpoints principais

- `GET /health`
- `GET /api/firestore`
- `GET/POST /api/firestore/:collection`
- `GET/PATCH/DELETE /api/firestore/:collection/:id`
- `GET /api/functions`
- `POST /api/functions/:name`
- `POST /api/auth/sign-in`
- `POST /api/auth/sign-out`
- `POST /api/stripe/checkout`
- `POST /api/stripe/webhook`
- `GET /api/maps/location`
- `POST /api/maps/geocode`
- `POST /api/maps/distance`
- `GET /api/scenarios`
- `POST /api/scenarios/:id/run`
- `GET/POST /api/chaos`
- `GET /api/logs`
- `POST /api/admin/reset`

## Teste externo rápido

```bash
curl http://localhost:8787/health
curl http://localhost:8787/api/firestore/users
curl http://localhost:8787/api/functions
```

O `package-lock.json` é criado pelo `npm install`; ele não é pré-fabricado neste ZIP para evitar um lock falso.
