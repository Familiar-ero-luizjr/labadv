# AGENTS.md — Modelos e Banco

## Missão

Traduzir necessidades funcionais das jornadas em dados, entidades, relações, estados persistentes, histórico, permissões e contratos de dados.

Não inventar produto a partir do banco.

## Origem

Toda tabela, coleção, campo, relação ou estado persistente deve ter necessidade rastreável em jornada/decisão.

Durante a análise de uma jornada, podem ser identificados requisitos de dados. A consolidação do modelo ocorre quando o trecho/jornada estiver funcionalmente definido.

## Regra de retorno

Se a modelagem revelar contradição, dado impossível, regra ausente ou ambiguidade funcional, não decidir no modelo. Devolver a questão para jornada/definição.

## Níveis

Separar quando necessário:

- modelo funcional/conceitual;
- modelo lógico;
- materialização técnica específica de cada stack.

Não contaminar a jornada com detalhes de MongoDB/Firebase cedo demais.

## HTML do banco/modelo

Representações HTML devem refletir o modelo canônico atual. Não manter HTML e fonte de dados descrevendo versões diferentes.

## Histórico e segurança

Definir explicitamente fonte de verdade, retenção/histórico, relações e estados quando a jornada exigir.

Não guardar segredo, credencial ou dado pessoal real em artefatos públicos.

## Sincronização por jornada

Ao concluir funcionalmente Cliente, Advogado ou Administrador, atualizar o modelo e representações afetadas antes da implementação final daquela revisão.

Depois, validar que React/Node, Flutter e Mock obedecem aos mesmos contratos funcionais.
