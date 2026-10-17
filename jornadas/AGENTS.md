# AGENTS.md — Jornadas

## Missão

`jornadas/` é a **espinha dorsal funcional** do Advogado Já.

Aqui o produto é percorrido como experiência real: caminhos, bifurcações, telas, ações, estados, campos e dados necessários.

## Ordem de trabalho

Cliente → Advogado → Administrador.

Uma jornada deve ser fechada, sincronizada, implementada e homologada antes de iniciar a próxima, salvo tarefa preparatória explicitamente autorizada.

## Como definir uma jornada

Trabalhar caminho por caminho.

Para cada trecho/tela, verificar:

- por que existe;
- de onde entra;
- ações possíveis;
- destinos;
- estados e guards;
- campos exibidos/coletados;
- dados lidos/gravados;
- integrações;
- loading/erro/vazio/sucesso;
- impactos em outros trechos.

Quando surgir lacuna, criar/reaproveitar pergunta em `definicao/`. Não preencher por suposição.

## Relação com a entrevista

A jornada gera perguntas; a decisão volta e altera a jornada.

Não transformar `definicao/` em roteiro abstrato separado da jornada.

## Telas

Antes de criar tela nova, confirmar que não é apenas componente, ação ou estado de tela existente.

A mesma tela pode participar de mais de um fluxo.

## Fechamento da jornada

Uma versão funcional só pode ser marcada fechada quando os caminhos necessários forem percorríveis ponta a ponta e não existirem decisões bloqueadoras escondidas.

Depois do fechamento funcional, a Orquestração deve sincronizar modelos/banco, HTMLs/mapa/protótipo e demais artefatos, implementar React/Flutter/Mock e homologar.

## Revisões

Jornada concluída é versionada, não imutável.

Impacto posterior exige reabrir ponto específico, registrar motivo/decisão, gerar nova revisão e sincronizar/regredir tudo que foi afetado.

## Autoridade

Jornada vigente é a principal representação funcional do comportamento aprovado, subordinada apenas à decisão explícita mais recente do usuário e à Orquestração ativa.
