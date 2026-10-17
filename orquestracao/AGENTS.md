# AGENTS.md — Orquestração

## Missão

Coordenar o Advogado Já por **blocos e fases**, com contexto mínimo, decisões rastreáveis e execução mecânica.

`orquestracao.json` é a fonte canônica desta pasta.

## Hierarquia

```text
Bloco → Fase → Planejamento → Execução
```

IDs internos são estáveis. B1/F1 são apenas posições visuais.

## Regra máxima

```text
auditar → planejar → validar plano → gerar execução → executar → validar → handoff
```

Não executar escrita de produto durante auditoria. Não improvisar quando o estado real divergir do plano.

## Estratégia por jornada

Depois dos blocos preparatórios, o trabalho funcional ocorre verticalmente:

```text
Cliente completo
→ Advogado completo
→ Administrador completo
→ Consolidação transversal
```

Um bloco de jornada só pode ser concluído quando tiver passado por definição funcional, sincronização dos artefatos dependentes, implementação nas aplicações pertinentes e homologação ponta a ponta.

Não adiar toda implementação para depois das três jornadas.

## Fases de uma jornada

A Orquestração pode adaptar a quantidade de fases, mas deve cobrir, sem pular responsabilidades:

- auditoria do estado atual;
- percurso dos caminhos e telas;
- identificação de lacunas;
- perguntas/decisões;
- consolidação da jornada;
- telas/campos/estados/dados;
- modelagem e contratos;
- protótipo/mapa/HTMLs afetados;
- planejamento técnico;
- implementação React + Flutter + Mock;
- homologação;
- regressão;
- conclusão/versionamento.

## Perguntas

Perguntas surgem da análise concreta da jornada. A Orquestração aponta para perguntas canônicas de `definicao/`; não duplica conteúdo.

Se uma fase descobrir nova lacuna, registrar a pergunta no ponto correto antes de assumir comportamento.

## Tarefas executáveis

Toda tarefa deve informar alvo, tipo de ação, precondições, referências, instruções em ordem, resultado esperado e validações.

Evitar verbos vagos sem critério objetivo.

Uma execução deve poder ser seguida sem tomar decisões de arquitetura, escopo ou produto.

## Reabertura de jornada

Impacto em jornada já concluída exige nova revisão. Preservar a revisão anterior, registrar motivo, sincronizar todos os artefatos/aplicações afetados e executar regressão antes de retornar à jornada corrente.

## Contexto

Antes de uma fase:

1. ler `/AGENTS.md`;
2. ler este arquivo;
3. localizar `contexto_atual`;
4. ler somente bloco/fase ativos;
5. carregar AGENTS da pasta especialista;
6. ler apenas fontes necessárias;
7. usar handoff anterior.

Não carregar o repositório inteiro por padrão.

## Persistência e histórico

A interface pode editar em memória, mas a persistência canônica ocorre no repositório após exportação/validação/diff.

Bloco ou fase com histórico não deve ser apagado. Decisão substituída e execução antiga permanecem rastreáveis.

## Schema

Esperado: `advogadoja.orquestracao.v2`.

Não reintroduzir `fases[]` na raiz.
