# AGENTS.md — React + Node + MongoDB

## Escopo

Implementação React/Node do mesmo Advogado Já implementado em Flutter.

## Entrada autorizada

Implementar somente trechos/lotes ligados a uma jornada e revisão aprovadas, depois da sincronização funcional de telas, dados/modelos e contratos necessários.

## Processo

```text
auditar estado atual
→ identificar arquivos/componentes reutilizáveis
→ planejar lote
→ validar contra jornada vigente
→ executar
→ testar/buildar
→ comparar com Flutter
→ homologar com Mock Services
```

Se surgir decisão funcional ausente, bloquear e devolver à jornada. Não decidir dentro do código.

## Frontend

Separar telas de negócio, componentes reutilizáveis, formulários, feedback, estados comuns, layout, tema/tokens, providers/contexto e serviços de API.

Evitar chamadas HTTP em componentes de apresentação quando houver camada de serviço apropriada.

Centralizar loading, erro, alerta, empty state, modal e padrões de formulário quando forem transversais.

## Backend

Preferir responsabilidades claras:

```text
route → controller → service → repository → provider/persistência
```

Não pular camadas por conveniência quando isso misturar HTTP, regra de negócio e persistência.

## Contratos

Frontend consome API/contratos, não MongoDB nem detalhes do Mock diretamente.

Providers podem variar entre homologação e produção sem reescrever a UI.

## Equivalência

Ao concluir o lote, comparar com Flutter em ações, destinos, estados, validações e resultados observáveis.

Diferença técnica do framework é permitida; diferença funcional não.

## Regressão

Mudança em jornada já homologada exige aplicar a revisão e testar os trechos anteriormente concluídos afetados.

## Segurança

Segredos de servidor nunca vão para bundle público ou repositório.
