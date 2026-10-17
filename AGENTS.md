# AGENTS.md — Advogado Já · Constituição do laboratório

## Missão

Este repositório existe para definir, materializar, implementar e homologar o Advogado Já de forma rastreável, sem inventar produto para preencher lacunas.

A unidade principal de trabalho funcional é a **jornada**.

## Ordem canônica das jornadas

Trabalhar nesta ordem:

1. Cliente
2. Advogado
3. Administrador
4. Consolidação transversal

**Estudante não é jornada independente**. É plano/área do Cliente, condicionado a assinatura/entitlement.
**Escritório não é usuário independente**. É subfluxo do Advogado.
**Administrador é papel interno** de uma identidade existente.

## Ciclo vertical obrigatório por jornada

Não definir todas as jornadas para somente depois implementar.

Cada jornada deve atravessar o ciclo completo antes da próxima:

```text
auditar jornada atual
→ percorrer caminhos
→ revisar telas, ações, estados, campos e dados
→ gerar/reaproveitar perguntas somente onde houver lacuna
→ registrar decisões
→ fechar versão funcional da jornada
→ sincronizar artefatos afetados
→ atualizar modelagem/banco e seus HTMLs
→ atualizar mapa/protótipo e demais representações aplicáveis
→ planejar implementação
→ implementar React + Flutter + Mock Services necessários
→ homologar ponta a ponta
→ concluir/versionar jornada
→ iniciar próxima jornada
```

Uma jornada não é considerada concluída apenas porque o fluxo foi descrito.

## Reabertura e versionamento

Se uma jornada posterior exigir mudança em jornada já concluída:

```text
impacto descoberto
→ reabrir ponto específico
→ registrar nova decisão
→ criar nova revisão da jornada
→ sincronizar artefatos e aplicações afetados
→ validar regressão
→ retornar à jornada em andamento
```

Nunca alterar silenciosamente uma jornada concluída.

## Fontes e responsabilidades

- `orquestracao/`: estado do trabalho, blocos, fases, planejamento, execução, evidências e handoff.
- `jornadas/`: espinha dorsal funcional; descreve caminhos reais do usuário e evolui durante a definição.
- `definicao/`: perguntas, respostas e decisões surgidas da análise das jornadas.
- `modelos/`: dados, entidades, relações, persistência e contratos derivados da jornada.
- `prototipo/`: materialização visual do que já foi definido.
- `referencias/`: material de consulta; nunca vira regra só por existir.
- `legado/`: comparação histórica; nunca prevalece sobre decisão atual.
- `docs/`: documentação técnica viva; pode apoiar auditorias, mas não decide produto.
- `aplicacoes/`: implementação executável React/Node, Flutter e Mock Services.

## Precedência

Quando houver conflito:

1. decisão explícita mais recente do usuário;
2. decisão registrada e aprovada no fluxo atual;
3. jornada vigente/versionada;
4. artefato especialista coerente com a jornada;
5. referência;
6. legado.

HTML, código ou banco existente não se tornam canônicos por existirem.

## Regra anti-invenção

Não criar silenciosamente tela, campo, estado, regra, permissão, integração, tabela, endpoint ou comportamento.

Quando faltar decisão:

- localizar a jornada e o ponto exato;
- formular/reaproveitar pergunta;
- registrar como pendente;
- só continuar após resolução quando o ponto for bloqueador.

## Entrevista

A entrevista é ferramenta da jornada, não eixo separado do produto.

Perguntas novas ou reformuladas devem oferecer preferencialmente **4 ou 5 opções objetivas + Outro com campo livre**. Resposta histórica não é decisão atual. `Resolvida` exige confirmação explícita.

## Método de trabalho

Para qualquer alteração relevante:

```text
auditar → planejar → validar plano → executar → validar resultado → registrar evidência/handoff
```

Inteligência fica na auditoria e no planejamento. Execução não improvisa arquitetura ou produto.

## Contexto

Ler apenas o necessário:

1. este AGENTS;
2. AGENTS da pasta ativa;
3. bloco/fase atual da Orquestração;
4. decisões relacionadas;
5. trechos dos artefatos realmente afetados.

Preferir busca e leitura por trechos a carregar arquivos grandes inteiros.

## Critério de conclusão

O projeto não termina ao fechar documentos. Deve existir equivalência funcional entre jornada aprovada, artefatos de dados/visualização e aplicações implementadas, com homologação ponta a ponta das três jornadas e consolidação transversal.
