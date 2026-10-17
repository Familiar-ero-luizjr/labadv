# AGENTS.md — Planejamento legado

## Estado

Esta pasta pertence ao sistema de planejamento anterior e foi **substituída operacionalmente por `orquestracao/`**.

Não criar novo planejamento autoritativo aqui.

## Uso permitido

- consulta histórica;
- comparação durante migração;
- preservação de decisões/registros ainda não incorporados;
- apoio a auditoria quando a Orquestração solicitar.

## Uso proibido

- iniciar nova fase;
- registrar como fonte principal o estado atual do projeto;
- sobrescrever decisão mais recente da Orquestração/jornada;
- reativar o fluxo antigo por conveniência.

## Precedência

`/AGENTS.md` → `orquestracao/` → jornada/decisão vigente → esta pasta como legado.

## Remoção

Não apagar esta pasta apenas por estar substituída. A remoção deve ocorrer em tarefa explícita, após confirmar que registros necessários foram migrados e que nenhum link/publicação depende dela.
