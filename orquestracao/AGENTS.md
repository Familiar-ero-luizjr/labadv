# AGENTS.md — Orquestração

## Missão

Orquestrar o trabalho do projeto Advogado Já com contexto mínimo, decisões rastreáveis e execução mecânica.

`orquestracao.json` é a fonte única desta pasta. HTML, CSS e JavaScript são apenas interface/motor.

## Três responsabilidades

1. **Planejamento** pensa: audita, encontra fatos, decide contexto, organiza escopo, produz tarefas concretas e valida o plano.
2. **Execução** faz: segue o pacote gerado, registra evidências e bloqueia quando a instrução é insuficiente.
3. **Regras** governam: definem método, limites e protocolos reutilizáveis.

## Regra obrigatória de trabalho

```text
auditar → planejar → validar o plano → gerar execução → executar → validar → handoff
```

Não começar a escrever código durante auditoria ou antes de o plano estar suficientemente específico.

## Contexto e economia de tokens

Antes de qualquer etapa:

1. ler `AGENTS.md` raiz;
2. ler este arquivo;
3. localizar o card ativo e suas regras/protocolo;
4. carregar apenas `contexto.ler_obrigatorio`;
5. respeitar `contexto.nao_ler`;
6. buscar trechos específicos antes de abrir arquivos grandes por inteiro.

Não reler todo o repositório por padrão.

## Qualidade do planejamento

Uma tarefa só é executável quando especifica:

- alvo/caminho;
- precondições;
- decisões/referências;
- instruções em ordem;
- resultado esperado;
- validação.

Evitar verbos genéricos como “ajustar”, “melhorar” ou “organizar” sem dizer exatamente o que deve mudar.

A pergunta de controle é: **uma IA com pouca capacidade de raciocínio conseguiria executar sem escolher arquitetura ou inventar requisito?** Se não, o planejamento ainda não está pronto.

## Execução

A execução não pode reinterpretar o plano.

Se encontrar:

- arquivo diferente do previsto;
- conflito arquitetural;
- requisito ausente;
- instrução ambígua;
- risco não previsto;

marcar a tarefa como `bloqueado`, registrar o impedimento e devolver ao Planejamento.

Nunca improvisar para manter o checklist avançando.

## Revisões e histórico

- IDs internos não mudam quando a ordem muda.
- Uma execução gerada corresponde a uma revisão do plano.
- Se o plano mudar depois da geração, a execução fica desatualizada e deve ser regenerada.
- A versão anterior deve permanecer no histórico.
- Decisão que muda de significado preserva o registro anterior e aponta sua substituição.

## Reordenação

A ordem do array `fases` é a ordem de trabalho.

Planejamento e Execução mostram os mesmos cards; portanto, mover em uma aba move na outra.

Não usar números visuais como IDs permanentes.

## Relação com aplicações

React/Node/Mongo e Flutter são duas implementações do mesmo Advogado Já. O planejamento técnico deve produzir tarefas específicas para cada tecnologia preservando equivalência funcional.

`advogadoja-mock-services` é infraestrutura externa simulada compartilhada. Ele deve ser planejado como parte dos lotes quando contratos ou cenários exigirem.

## Persistência

Edições feitas pela página não alteram o repositório. Para persistir:

1. exportar `orquestracao.json`;
2. substituir o arquivo no repositório;
3. revisar diff;
4. commitar somente depois de validar o JSON.
