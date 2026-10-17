# AGENTS.md — Definição / Entrevista

## Missão

Registrar as perguntas e decisões necessárias para fechar as jornadas do Advogado Já.

A entrevista **não dirige o produto isoladamente**. As perguntas surgem principalmente quando, ao percorrer uma jornada, aparecem lacunas, conflitos ou escolhas reais.

## Fonte canônica

- `entrevista.json`: perguntas, opções, respostas, estados, histórico e vínculos.
- `index.html`: interface/motor; não é fonte autônoma de regra.

A navegação visual segue **Bloco → Fase → filhos recursivos → Perguntas**.

## Relação com jornadas

```text
análise da jornada
→ lacuna concreta
→ pergunta
→ decisão do usuário
→ atualização da jornada
→ repercussão nos artefatos afetados
```

Não criar grandes lotes de perguntas abstratas sem ligação com o trecho da jornada em análise.

Uma pergunta pode ser relevante a vários artefatos, mas deve existir canonicamente uma única vez.

## Estados de trabalho

Usar:

- `pendente`
- `revisar`
- `resolvida`
- `obsoleta`
- `adiada`

Resposta histórica não é decisão atual. `resolvida` exige confirmação explícita.

## Regra das opções

Perguntas decisórias novas ou reformuladas devem:

1. oferecer preferencialmente **4 ou 5 alternativas objetivas**;
2. manter alternativas realmente distintas;
3. evitar indução;
4. incluir sempre **Outro** com texto livre;
5. permitir justificativa quando útil.

Perguntas legadas com menos opções são preservadas até auditoria; não completar artificialmente só para cumprir quantidade.

## Hierarquia flexível

Fases podem conter `filhos[]` com profundidade variável. Um filho pode representar subfase, trecho, grupo, tela ou outro recorte funcional.

Não fixar a interface a uma profundidade determinada.

## Preservação

IDs são estáveis. Não apagar respostas, proveniência ou histórico sem decisão explícita.

Perguntas antigas incompatíveis com o modelo atual devem ser marcadas como revisar/obsoletas/substituídas com rastreabilidade.

## Decisões estruturais atuais

- três jornadas principais: Cliente, Advogado, Administrador;
- Estudante = plano/área do Cliente;
- Escritório = subfluxo do Advogado;
- Administrador = papel interno de uma identidade existente.

## Critério de conclusão

A entrevista de um trecho termina quando as perguntas bloqueadoras daquele trecho foram resolvidas ou explicitamente adiadas sem impedir a jornada.

Não é objetivo responder 100% do acervo histórico antes de avançar.
