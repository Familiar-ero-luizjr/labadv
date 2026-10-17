# Advogado Já — Laboratório Funcional

Este repositório é um **laboratório de definição do produto**, preparado para ser publicado diretamente no GitHub Pages.

O objetivo desta fase **não é construir o aplicativo final**. O objetivo é fechar, de forma rastreável, quais telas, ações, estados, componentes, regras e dados realmente precisam existir antes da implementação.

## Como usar

Abra `index.html` no GitHub Pages. A partir do hub, trabalhe em três frentes que devem permanecer coerentes entre si:

1. **Jornadas** — mostram a experiência ponta a ponta de Cliente, Advogado, Estudante de Direito e Administrador.
2. **Entrevista funcional** — registra decisões já fechadas e perguntas pendentes. As respostas ficam salvas no navegador e podem ser exportadas/importadas em JSON.
3. **Modelo de banco** — verifica quais entidades e relacionamentos são necessários para sustentar as telas e estados definidos.

O arquivo em `referencias/` é uma visão integrada auxiliar. Ele não substitui as quatro jornadas individuais.

## Estrutura

```text
/
├── index.html
├── README.md
├── AGENTS.md
├── jornadas/
│   ├── cliente_maria.html
│   ├── advogado_joao.html
│   ├── estudante_ana.html
│   └── administrador.html
├── definicao/
│   └── entrevista_funcional_4_jornadas.html
├── modelos/
│   └── modelagem_banco_todas_telas.html
└── referencias/
    └── mapa_aplicacao_todas_jornadas.html
```

## Ciclo de trabalho

Quando surgir uma dúvida, mudança ou tela nova:

**Jornada → Pergunta/decisão → Dados necessários → Revisão cruzada → Atualização dos artefatos afetados.**

Uma resposta na entrevista não deve ficar isolada. Se ela alterar o comportamento de uma tela, a jornada correspondente deve ser revisada. Se alterar persistência, estado, histórico ou vínculo entre entidades, o modelo do banco também deve ser revisado.

Da mesma forma, uma nova tabela ou campo não deve ser criado sem uma necessidade funcional identificável.

## Estado atual do produto

As quatro experiências consideradas são:

- **Cliente**
- **Advogado**
- **Estudante de Direito**
- **Administrador**

Regras estruturais já consolidadas incluem:

- Uma pessoa possui uma única identidade e pode acumular perfis.
- Cliente, Advogado e Estudante de Direito são perfis públicos; Administrador é um papel interno.
- Com dois ou mais perfis utilizáveis, há seleção de perfil.
- Escritório é subfluxo do Advogado, não uma persona independente.
- Validação da OAB é posterior ao onboarding do Advogado.
- O Advogado possui uma única Home; o estado da OAB altera capabilities.
- Dados acadêmicos do Estudante são opcionais e não exigem comprovação.
- Advogado e Estudante de Direito são os perfis pagantes.
- O consumo de cursos pode ocorrer no DMembers, mas acesso deve derivar da identidade/assinatura/entitlements controlados pelo backend do Advogado Já.

## GitHub Pages

Este pacote é estático. Para publicar:

1. Envie o conteúdo desta pasta para a raiz do repositório.
2. No GitHub, abra **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch desejada e a pasta `/ (root)`.
5. Salve.

Não coloque chaves de API, senhas, tokens, segredos, credenciais ou dados pessoais reais neste repositório público.

## Autoridade dos artefatos

Nenhum HTML é automaticamente “verdade” apenas porque existe. Ele representa o estado atual da especificação.

A autoridade funcional é:

1. decisão explícita mais recente do produto;
2. decisão consolidada e não conflitante na entrevista;
3. jornadas atualizadas;
4. modelo de banco;
5. referências e materiais legados.

Conflitos devem ser expostos e resolvidos; nunca corrigidos silenciosamente por suposição.

## Protótipo navegável unificado (4 jornadas)

Na aba **Protótipo** do `index.html`, é possível escolher Cliente, Advogado, Estudante ou Administrador e navegar pelos caminhos atualmente documentados. Consulte `prototipo/README.md` para execução local, limites de interatividade e manutenção dos snapshots.
