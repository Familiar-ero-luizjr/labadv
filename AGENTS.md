# AGENTS.md — Advogado Já · Laboratório Funcional

## Missão

Este repositório existe para **fechar a especificação funcional do Advogado Já antes da construção final das telas e do aplicativo**.

Qualquer agente que editar este repositório deve atuar como mantenedor de especificação, não como inventor de produto.

## Regra principal: não alucinar

Nunca criar uma tela, fluxo, regra, tabela, campo, permissão, estado ou integração apenas porque parece uma boa prática.

Quando uma definição necessária não estiver fechada:

- manter o ponto como **PENDENTE**;
- criar ou ajustar uma pergunta objetiva na entrevista;
- não transformar a hipótese em regra canônica.

## Distinções obrigatórias

Nunca confundir:

- **Tela**: superfície navegável/routeável ou visualmente própria.
- **Componente**: parte reutilizável de uma tela, como menu, header, drawer ou bottom nav.
- **Ação**: comando do usuário/sistema, como enviar, aceitar, recusar, sair ou alterar status.
- **Estado**: condição que muda conteúdo, disponibilidade ou permissões sem criar uma nova tela.

Não criar uma nova tela apenas para representar um estado.

## Hierarquia funcional

Usar a estrutura:

**JORNADA → SUBJORNADA → FLUXO → TELA**

A mesma tela pode participar de múltiplos fluxos ou jornadas.

## Personas/perfis atuais

O laboratório trabalha com quatro experiências:

1. Cliente
2. Advogado
3. Estudante de Direito
4. Administrador

Regras já fechadas:

- uma pessoa = uma identidade;
- a identidade pode acumular perfis;
- Cliente, Advogado e Estudante são perfis públicos;
- Administrador é papel interno, concedido a conta existente;
- o primeiro Administrador nasce por root/bootstrap;
- com 2+ perfis utilizáveis, o seletor de perfil é exibido;
- Escritório é subfluxo do Advogado;
- OAB não pertence ao cadastro nem ao onboarding profissional;
- após onboarding, o Advogado entra na mesma Home Profissional;
- OAB muda capabilities, menu, main e ações, mas não cria outra Home;
- falha técnica de OAB é estado desconhecido e deve ser fail-closed para operações protegidas;
- dados acadêmicos do Estudante são opcionais, sem comprovação obrigatória;
- Advogado e Estudante são perfis pagantes;
- assinatura é contratada/gerida no Advogado Já;
- DMembers não deve ser fonte de verdade do plano; acesso deve ser derivado de estado de assinatura/entitlements do backend.

## Relação entre os artefatos

Os artefatos principais são:

- `jornadas/*.html`
- `definicao/entrevista_funcional_4_jornadas.html`
- `modelos/modelagem_banco_todas_telas.html`

Uma alteração funcional deve ser rastreada entre eles.

### Quando uma pergunta é respondida

Verificar obrigatoriamente:

1. muda alguma tela?
2. muda algum caminho de fluxo?
3. muda ação ou estado?
4. muda dados necessários?
5. exige nova tabela/campo/relação ou elimina algum?
6. afeta outra persona?
7. afeta Map/Flow/Prototype futuramente?

Atualizar somente os artefatos realmente impactados.

### Quando uma tela é proposta

Antes de criá-la:

- confirmar que não é apenas estado;
- confirmar que não é apenas ação;
- confirmar que não é componente;
- procurar tela existente que possa ser reutilizada;
- identificar a pergunta/decisão que justifica sua existência;
- identificar os dados que a tela lê/grava.

### Quando o banco é alterado

Toda tabela/campo/relação precisa ter uma necessidade funcional rastreável.

Não modelar banco apenas pela aparência das telas. Considerar:

- fonte de verdade;
- histórico necessário;
- estados persistentes;
- auditoria;
- relações entre perfis;
- integrações externas.

## Tratamento de conflitos

Se dois artefatos discordarem:

1. não escolher silenciosamente;
2. verificar a decisão explícita mais recente;
3. se a decisão não estiver clara, marcar conflito como pendente;
4. criar pergunta objetiva;
5. só depois sincronizar os artefatos.

**HTML existente não vira canônico por existir.**

## Entrevista funcional

A entrevista é um instrumento de decisão, não um formulário descartável.

Regras:

- preservar IDs existentes;
- não reutilizar ID para outra pergunta;
- acrescentar novas perguntas com novos IDs;
- respostas consolidadas podem ser atualizadas quando uma decisão explícita posterior as substitui;
- permitir desmarcar/alterar respostas;
- não fazer a pergunta desaparecer durante a edição;
- exportação JSON deve preservar perguntas, alternativas e respostas.

## GitHub Pages

O laboratório pode ser publicado como site estático.

Não incluir:

- secrets;
- tokens;
- chaves privadas;
- credenciais;
- dados pessoais reais;
- endpoints privados com credenciais embutidas.

Links internos devem ser relativos para funcionar no GitHub Pages.

## Critério de conclusão desta fase

A fase termina quando for possível percorrer as quatro jornadas ponta a ponta e, para cada etapa:

- saber se é tela, componente, ação ou estado;
- saber o screenKey da tela, quando aplicável;
- saber entrada e saída do fluxo;
- saber regras/guards/capabilities;
- saber os dados mínimos;
- saber persistência necessária;
- saber loading, erro e empty state relevantes;
- saber integrações externas;
- não existir decisão funcional crítica escondida.

Só então a construção final das telas deve ser tratada como próxima etapa.
