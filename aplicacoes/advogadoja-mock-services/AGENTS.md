# AGENTS.md — Mock Services

## Missão

Simular a infraestrutura externa necessária para implementar e homologar cada jornada do Advogado Já.

Não é fonte de verdade do produto.

## Trabalho por jornada

Mock Services evolui junto com o lote/jornada que está sendo implementado.

Somente criar endpoint, evento, cenário ou dado quando houver contrato/necessidade funcional rastreável na jornada vigente.

## Estado compartilhado

O ambiente deve suportar múltiplas instâncias/navegadores observando o mesmo estado.

Não usar `localStorage` como fonte de verdade do ambiente compartilhado.

Persistência/deploy definitivos exigem planejamento arquitetural explícito.

## Painel

O painel do mock pode:

- inspecionar estado;
- editar dados fictícios autorizados;
- seed/reset;
- disparar cenários;
- simular falhas;
- mostrar logs/evidências.

Não replicar a UI do Advogado Já.

## Contratos

React e Flutter devem consumir contratos equivalentes.

Mudança de contrato exige auditar consumidores, planejar compatibilidade, atualizar mock/testes e validar as duas aplicações.

Não quebrar contrato silenciosamente.

## Integrações

Google Maps pode ser real quando previsto pela jornada. Outras integrações permanecem simuladas até plano explícito de produção.

## Reabertura/regressão

Se revisão de uma jornada alterar contrato já homologado, atualizar o mock e executar regressão nos consumidores afetados.

## Segurança

Nunca adicionar credenciais ou dados pessoais reais ao ambiente público/repositório.
