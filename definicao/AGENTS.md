# AGENTS.md — Contrato de manutenção da Entrevista Hierárquica V2

## Escopo obrigatório

Esta pasta é **apenas a Entrevista funcional** do Advogado Já. Não modificar outras abas do `labadv`, jornadas, banco, Inventário, Protótipo, Mapa, Planejamento, frontend React ou Flutter sem pedido explícito.

A arquitetura aprovada para esta entrega consiste em **dois arquivos de execução**:

- `index.html`: motor de interface autocontido, com CSS, JS e componentes internos organizados por blocos lógicos.
- `entrevista.json`: **única fonte canônica de conteúdo**, incluindo árvore, perguntas, opções, respostas, estados de gestão, referências, dependências e histórico.

`README.md` e este `AGENTS.md` são documentação da raiz. Não reintroduzir múltiplos JSONs para a mesma entrevista sem autorização.

## Regras de modelagem

1. Navegação 100% gerada a partir da árvore `areas[] -> filhos[]`. Novos nós raiz criam novas abas; subníveis não têm profundidade fixa. **Nenhuma persona pode estar hardcoded** no JavaScript.
2. Cada pergunta vive no nó a que pertence em `perguntas[]`; sua `resposta` e `gestao` ficam **junto dela**. Não criar tabelas paralelas indexadas apenas por posição.
3. IDs das áreas e das perguntas são **estáveis e únicos**. Reordenar, renomear ou mover uma pergunta **não altera** seu ID nem a resposta/histórico.
4. Catálogos de status e prioridades ficam em `configuracao`; o motor usa seus IDs/regras e não decide semanticamente quais questões são aprovadas.
5. `gestao.respondida` é dado persistido, não uma aprovação. A interface pode manter esse campo sincronizado com as mudanças na resposta, mas deve conservar a distinção entre preenchimento, status da resposta e status da decisão.
6. Estados independentes: `estado_resposta`, `estado_decisao`, `prioridade`, `respondida`, `responsavel` e `referencias` não devem ser fundidos em um status único.
7. **Nunca aprovar automaticamente** uma resposta histórica. A decisão `aprovada` exige ação explícita do operador. Alterar uma resposta aprovada deve exigir nova revisão. Sem resposta, não permitir aprovação.
8. `historico[]` nunca deve ser apagado durante edição/migração. Guardar timestamp apenas de eventos efetivamente observados, sem inventar autores e datas históricas.
9. Registrar proveniência original em `gestao.legado`, inclusive IDs e seções da entrevista anterior. A migração trouxe **683 perguntas e 65 respostas históricas**; ao modificar, garantir que não se percam sem decisão explícita.
10. Perguntas antigas sobre Estudante podem estar desatualizadas. A orientação atual do usuário: **Estudante é plano/área do Cliente**, não tipo independente de cadastro; requer análise na entrevista. Não apagar perguntas anteriores sem rastreabilidade.
11. Escritório é subfluxo do Advogado, não uma persona nova; Administrador é papel interno concedido a identidade existente. Não confundir **área da entrevista** com papel/cadastro real.
12. `referencias` e `dependencias` fazem ligação documental com telas, flow, banco, serviços e Planejamento; não presumir existência de APIs/Firebase ou efeitos reais por haver referência.
13. Questões sem resposta ou seções vazias devem permanecer assim até decisão do usuário. **Não inventar decisões, telas, funções ou pagamentos.**
14. CSS/JS podem ter seções/componentes internos, mas permanecem no mesmo `index.html` neste modelo. Evitar dependências e chamadas externas desnecessárias.
15. O HTML carrega somente `entrevista.json` da mesma pasta. Em GitHub Pages/servidor HTTP, mudanças publicadas no JSON devem aparecer após recarregar a página. Importação/exportação deve trabalhar com **o arquivo inteiro**.
16. Alteração no navegador é local. `localStorage` é apenas rascunho opcional. **Não afirmar que exportação, salvamento local ou atualização de aba produziu commit no GitHub.**
17. Não adicionar token ou segredo de GitHub, Firebase, Google Maps ou qualquer serviço ao HTML ou JSON público.

## Critérios de aceitação para próximas alterações

- JSON válido; IDs únicos; árvore recursiva íntegra; opções/respostas com referências válidas.
- Garantir que as cinco áreas iniciais sejam geradas pelos dados, não pelo motor; ao adicionar `gestor` no JSON, a sexta aba surge sem mudança no HTML.
- Conferir a preservação de 683 perguntas e 65 respostas originais antes de qualquer alteração de conteúdo aprovada.
- Verificar perguntas sem resposta, resposta histórica, revisão, aprovação explícita e reabertura após edição.
- Exercitar importação e exportação (roundtrip) e recuperação opt-in de rascunho local.
- Verificar navegação em desktop e mobile, inclusive sem scroll horizontal inesperado.
- Em mudanças de schema, atualizar a versão, documentar uma migração **sem perdas** e testar com backup.

## Ordem de trabalho funcional

Entrevista de definição das jornadas/usuários → perguntas sobre o compartilhado → Cliente (inclui Área de Estudos) → Advogado (inclui escritório) → Administrador. Cada jornada deve ser fechada por entrevista, revisão de telas e dados, com comparação do legado apenas como referência, antes de atualizar os artefatos relacionados.
