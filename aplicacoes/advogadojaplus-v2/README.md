# AdvogadoJá Plus — arquitetura reorganizada

Projeto original reconstruído a partir do snapshot `advogadojaplus-v2_arvore.html`. A migração estrutural mantém as URLs, os contratos da API e a regra **frontend → API → repositório → mock/MongoDB Atlas**.

## Executar

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
npm run dev:api
# Em outro terminal:
npm run dev:web
```

O modo inicial da API é **mock** (persistente em arquivo local) e a troca para Atlas é feita pelo backend (`DATA_PROVIDER=mongo`, `MONGODB_URI`). Não há dados mock importados pelo frontend. A API precisa estar rodando para que login, cadastro, onboarding e Home funcionem.

## Organização

- `apps/web/src/app`: roteamento Next.js, sem código de páginas duplicado.
- `apps/web/src/views/pages`: uma pasta por tela. Evita o reservado `src/pages` do Next.js.
- `apps/web/src/components`: componentes comuns de apresentação, layout, formulários e feedback.
- `apps/web/src/themes`: tokens CSS centralizados e contrato do `styled-components`.
- `apps/web/src/context`: sessão, jornada, feedback e modais.
- `apps/web/src/services`: consumo HTTP **exclusivo** da API.
- `apps/api/src/routes`: contratos HTTP organizados por domínio.
- `apps/api/src/controllers`: adaptadores HTTP pequenos.
- `apps/api/src/services`: regras de negócio.
- `apps/api/src/repositories`: contrato único + provedores mock/mongo.
- `apps/api/src/models`: um schema Mongoose por entidade.

## Escopo preservado

Jornada até a Home da cliente; usuário advogado e funcionalidades posteriores à Home direcionados a Em construção. Não copiar o HTML legado como implementação React. O visual continua sendo transposição aproximada, sem comprovação pixel a pixel.

## Validação

```bash
npm run check:structure
npm run typecheck:web
npm run typecheck:api
npm run test:api
```

`check:structure` não substitui compilação e testes de integração. Para Atlas, configure suas próprias credenciais no `.env` da API; nunca exponha em variáveis `NEXT_PUBLIC_*`.

Documentação da refatoração: `docs/architecture/ARVORE_OTIMIZADA.md`.
