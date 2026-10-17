# AdvogadoJá+ — Flutter

## Estado atual

O conteúdo de front e `lib/` foi removido intencionalmente para a reconstrução.
Não há telas, rotas, ponto de entrada ou integração ativa nesta etapa.

Os arquivos Flutter/Firebase, Rules e Functions remanescentes são obsoletos e
não são fonte de verdade. Eles ficam apenas como insumos provisórios para
refinamento futuro; não devem orientar decisões, ser copiados ou conectados.

## Como a reconstrução será feita

Cada tela será primeiro definida e fechada no construtor e no mapa, com sua
especificação, ações e integração. Só então será implementada no Flutter; por
último, o mock será adaptado para reproduzir o contrato e comportamento
fechados.

O Flutter dependerá apenas de contratos/interfaces de dados. O mock em
`../advogadoja-mock-services/` será a primeira implementação desses contratos;
uma implementação Firebase futura substituirá somente esse adaptador, sem
alterar as telas.

A primeira sequência prevista é splash, boas-vindas e login. Ela ainda será
especificada no construtor/mapa. Em particular, credenciais, Google e Apple/iOS
do login não podem ser implementados no Flutter ou no mock antes desse
fechamento.

As regras operacionais completas estão em [`../AGENTS.md`](../AGENTS.md).

## Referências

- [Arquitetura atual](docs/ARQUITETURA.md)
- [Árvore histórica removida](docs/ARVORE_LIB_HISTORICA.html)
- [Mock Services](../advogadoja-mock-services/README.md)
