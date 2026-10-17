# AGENTS.md — Aplicações

## Missão

Implementar o Advogado Já executável sem inventar produto.

`advogadojaplus-v2/` e `flutter/` representam a mesma aplicação em tecnologias diferentes. `advogadoja-mock-services/` fornece o ambiente externo simulado para desenvolvimento/homologação.

## Implementação vertical por jornada

Não esperar as três jornadas ficarem prontas para começar código.

Depois que uma jornada estiver funcionalmente fechada e seus artefatos dependentes sincronizados:

```text
planejar lote técnico
→ implementar React/Node
→ implementar Flutter
→ adaptar Mock Services
→ validar equivalência
→ homologar ponta a ponta
→ concluir revisão da jornada
```

Só então a Orquestração segue para a próxima jornada.

## Equivalência

React e Flutter devem ser equivalentes em comportamento observável:

- telas;
- ações e destinos;
- estados;
- regras e guards;
- validações;
- contratos;
- cenários homologados.

Arquitetura interna pode ser idiomática para cada stack.

## Fronteira funcional

Código não resolve dúvida de produto.

Se faltar comportamento, campo, estado, regra ou destino, bloquear o ponto e devolver à jornada/definição.

## Trabalho por lotes

Cada lote deve declarar telas/trechos, jornada/revisão de origem, contratos, dados, estados, navegação, componentes reutilizáveis, impacto no mock, validações e critérios de conclusão.

## Contratos

Preferir:

```text
UI → contrato funcional → adapter/provider
                     ├─ Mock Services
                     └─ produção
```

Não acoplar telas diretamente à infraestrutura quando o contrato puder isolar a implementação.

## Reabertura

Se Advogado ou Administrador exigir mudança no Cliente já homologado, não corrigir apenas uma aplicação. Reabrir a revisão da jornada afetada, sincronizar artefatos, aplicar a mudança em todas as implementações pertinentes e rodar regressão.

## Autoridade local

Ao trabalhar aqui:

1. `/AGENTS.md`;
2. `/orquestracao/AGENTS.md` e plano ativo;
3. `/aplicacoes/AGENTS.md`;
4. AGENTS da aplicação específica.

## Segurança

Nunca commitar segredos, tokens, credenciais ou dados pessoais reais.
