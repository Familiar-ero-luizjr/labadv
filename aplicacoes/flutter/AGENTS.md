# AGENTS.md — Flutter

## Escopo

Implementação Flutter do mesmo Advogado Já implementado em React/Node.

## Entrada autorizada

Implementar somente trechos/lotes ligados a uma jornada e revisão aprovadas, depois da sincronização funcional dos artefatos necessários.

## Processo

```text
auditar lib/ e arquitetura existente
→ identificar reutilização
→ comparar jornada e lote com React
→ planejar
→ validar plano
→ executar
→ flutter analyze/test/build pertinentes
→ validar comportamento
→ homologar com Mock Services
```

Se faltar decisão funcional, interromper o ponto e devolver à jornada/definição.

## Organização

Preferir arquitetura clara por feature/responsabilidade. Não criar arquivos avulsos só para concluir rapidamente uma tela.

Reutilizar bibliotecas transversais para loading, erro, alerta, feedback, empty state, formulários, diálogo, tema, layout, navegação e estados comuns.

## UI e infraestrutura

Widgets de apresentação não devem conter detalhes de Firebase, HTTP do mock ou persistência.

A UI depende de contratos/interfaces. Adapters implementam Mock Services ou serviço de produção autorizado.

Trocar provider não deve exigir reescrever telas.

## Equivalência com React

Não copiar arquitetura React; comparar produto observável.

Mesmas ações/estados/regras devem produzir resultados equivalentes nas duas aplicações.

## Legado

Código legado não é fonte de verdade. Não restaurar rotas, Functions, Rules ou padrões antigos apenas porque existem.

## Regressão

Mudança em jornada já concluída exige nova revisão e regressão dos trechos afetados.
