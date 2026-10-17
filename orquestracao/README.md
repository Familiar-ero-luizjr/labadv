# Orquestração — Advogado Já

Esta pasta substitui a função operacional da antiga `planejamento/`.

A Orquestração possui três sub-abas, todas alimentadas pelo **mesmo** `orquestracao.json`:

- **Planejamento** — auditoria, contexto, decisões aplicáveis, escopo, estratégia, tarefas concretas e critérios de saída.
- **Execução** — pacote gerado do planejamento. O executor marca estado, evidência, resultado e bloqueios; não redefine a arquitetura.
- **Regras** — constituição operacional e protocolos usados para auditar e planejar.

## Arquivos

- `orquestracao.json` — fonte de dados única do módulo.
- `index.html` — estrutura visual das três sub-abas.
- `estilos.css` — apresentação.
- `app.js` — leitura, edição, ordenação, geração da execução, importação/exportação e validações locais.
- `AGENTS.md` — regras obrigatórias para agentes.

## Identidade e ordem

O número mostrado no card é calculado pela posição. Ele **não é identidade**.

Cada card tem `id` técnico estável. Reordenar um card em Planejamento reordena o mesmo objeto em Execução. Não existem `F00`, `F01A` ou renumerações de IDs.

## Edição e persistência

A página carrega `orquestracao.json`. Alterações ficam em memória até **Exportar JSON editado**. O navegador não grava no GitHub automaticamente.

Também é possível importar outro JSON compatível ou usar o editor do JSON completo.

## Migração do Planejamento V1

Os registros do antigo `planejamento/registros.csv` e a estrutura anterior foram preservados dentro do `orquestracao.json` para auditoria da migração.

Não apagar `planejamento/` antes de verificar a nova aba no GitHub Pages. Depois da validação, a pasta antiga pode ser removida para evitar duas fontes concorrentes.
