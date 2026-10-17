# Estrutura do `orquestracao.json`

```text
meta
contexto_atual
jornadas
modelo_acesso
registros[]
fases[]
  id
  titulo
  status
  protocolo_id
  planejamento
    revisao
    objetivo
    estrategia
    auditoria
    escopo
    contexto
    validacoes
    criterios_saida
    tarefas_execucao[]
  execucao
    status
    revisao_plano
    gerada_em
    itens[]
    bloqueios[]
    resultado
    handoff
regras
  globais[]
  protocolos[]
historico[]
legado_planejamento
```

A ordem de `fases[]` é a ordem única exibida nas abas Planejamento e Execução.
