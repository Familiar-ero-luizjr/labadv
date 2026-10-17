# Advogado Já Plus — Entrevista Hierárquica V2

## Objetivo

Laboratório **funcional e documental** para definir o Advogado Já antes da implementação. Esta pasta substitui a organização da entrevista em três JSONs por **um JSON hierárquico**, sem alterar as outras abas do `labadv`.

```text
entrevista/
├── index.html         # HTML único: CSS + JavaScript + componentes internos
├── entrevista.json     # Fonte de dados: árvore, perguntas, respostas e gestão
├── README.md           # Uso, contratos e instalação
└── AGENTS.md           # Regras para agentes/Codex
```

O HTML **não precisa de bibliotecas externas**, porém **o conteúdo reside em `entrevista.json`**, lido por `fetch`. Portanto, use um servidor HTTP ou GitHub Pages para carregamento automático; abrir por `file://` geralmente não permite acessar o JSON local. Sem servidor, abra `index.html` e utilize **Importar JSON** para carregar o arquivo manualmente.

### Uso local

Na própria pasta:

```bash
python -m http.server 8000
```

Acesse `http://localhost:8000/`. O HTML solicita `entrevista.json` à mesma pasta usando `cache: no-store`.

### Instalar no laboratório existente

1. Faça backup da versão atual da entrevista.
2. Substitua ou instale a pasta `entrevista/` do pacote na raiz do laboratório, mantendo `index.html` e `entrevista.json` lado a lado.
3. No índice raiz do `labadv`, a aba **Entrevista** deve apontar para `entrevista/index.html`. Se o índice atual usa outro caminho, ajuste **apenas o link/iframe dessa aba**.
4. Não altere Mapa, Planejamento, Inventário, jornadas ou Protótipo por causa desta entrega.

## Conteúdo migrado

- **683 perguntas** originais, IDs `R001...` e `Q0001...` intactos.
- **65 respostas históricas** com suas opções, justificativas e proveniência preservadas.
- **39 nós de árvore**, dos quais **5 são áreas principais** (`Definição de usuários`, `Compartilhado`, `Cliente`, `Advogado`, `Administrador`). A seção antiga de histórico foi desfeita e suas 37 perguntas distribuídas em assuntos correspondentes, mantendo em cada pergunta o registro `gestao.legado`.
- Seções como Splash e Login que não possuíam perguntas específicas foram mantidas sem inventar itens. Algumas perguntas antigas de cadastro/login foram classificadas nas seções adequadas.
- Perguntas sobre Estudante foram sinalizadas para reavaliação em razão da nova decisão de tratá-lo como **plano/área do Cliente**, não perfil público independente.
- Nenhuma resposta histórica foi marcada como decisão aprovada.

## Modelo hierárquico

`entrevista.json` tem `schema`, `versao`, `configuracao`, `origem`, `orientacoes` e `areas`.

Cada objeto em `areas` pode ter filhos de **profundidade variável**, e cada seção possui suas próprias `perguntas`:

```json
{
  "id": "cliente.estudante.planos",
  "titulo": "Planos e contratação",
  "ordem": 10,
  "perguntas": [
    {
      "id": "EXEMPLO-001",
      "texto": "Qual condição libera o acesso?",
      "tipo": "escolha_unica",
      "opcoes": [{"id": "A", "texto": "Assinatura ativa"}],
      "permite_outra": true,
      "resposta": {
        "opcao_id": "",
        "texto_livre": "",
        "justificativa": ""
      },
      "gestao": {
        "respondida": false,
        "estado_resposta": "nao_respondida",
        "estado_decisao": "pendente",
        "prioridade": "nao_definida",
        "responsavel": "",
        "origem": "entrevista_nova",
        "referencias": {"telas": [], "fluxos": [], "banco": [], "servicos": [], "planejamento": []},
        "dependencias": [],
        "alertas": [],
        "atualizado_em": null,
        "historico": [],
        "legado": null
      }
    }
  ],
  "filhos": []
}
```

O exemplo é apenas ilustrativo e **não está incluído entre as 683 perguntas originais**.

### Renderização dinâmica

- Cada item raiz em `areas` vira uma **aba principal**.
- Cada item em `filhos` vira uma **subárea** na árvore lateral.
- Toda pergunta pertence ao próprio nó `perguntas[]`, com sua resposta e gestão.
- Acrescentar uma área raiz como `gestor`, com `filhos` opcionais, fará a aba **Gestor** surgir automaticamente no próximo carregamento.
- Não há lista fixa de personas/áreas codificada no motor.
- A ordem visual é `ordem` crescente, depois `id`. Ao criar nova área na interface, a ordem sugerida é após as irmãs existentes.

### Gestão, estados e histórico

`gestao.respondida` é o indicador explícito de preenchimento, armazenado **no JSON**. O motor apenas o atualiza quando a resposta é modificada.

Os catálogos de status ficam em `configuracao.estados_resposta`, `configuracao.estados_decisao` e `configuracao.prioridades`. Os seletores e filtros de estado são montados a partir deles. `configuracao.regras` identifica os IDs usados para aprovação/revisão e transições padrão.

**Resposta histórica não equivale a decisão aprovada.** Aprovação exige responder e selecionar explicitamente o status correspondente, com confirmação. Ao editar resposta previamente aprovada, ela volta a revisão. Cada alteração confirmada via interface é registrada em `gestao.historico`. Rascunhos de texto são registrados no histórico após a conclusão da edição do campo; alterações parciais são mantidas em memória e no rascunho local.

São campos de rastreabilidade: `origem`, `responsavel`, `referencias` (telas, fluxos, banco, serviços e planejamento), `dependencias`, `alertas`, `atualizado_em` e `legado`.

## Edição, importação e exportação

O sistema oferece:

- Abas e árvore recursivas, indicadores e busca (na seção ou global).
- Filtros dinâmicos por status de resposta/decisão e preenchimento.
- Adição/edição de áreas, subáreas e perguntas (IDs estáveis).
- Respostas, alternativa livre, justificativa e painel de gestão por pergunta.
- Controle de versões locais: `localStorage` armazena **rascunho de segurança**; na abertura subsequente o usuário deve optar por restaurar ou descartar. Rascunho **não é fonte canônica**.
- **Importar JSON:** carrega um arquivo completo com o mesmo schema, validando IDs e status.
- **Exportar JSON:** gera um `entrevista.json` completo, mantendo toda a árvore e o histórico.

**O GitHub não é modificado ao clicar Salvar na interface.** Para publicar alterações, exporte `entrevista.json`, substitua o arquivo no repositório e faça o commit. Após publicação/GitHub Pages, atualize a página para ler o novo conteúdo. O projeto não inclui token GitHub nem escritura direta em APIs remotas.

### Limitações intencionais

- Nenhum fluxo de aprovação empresarial, backend/Firebase, autenticação ou integração operacional foi criado.
- Regras sobre estudante e demais jornadas ainda exigem entrevista funcional. Perguntas legadas conflitantes foram sinalizadas, não reescritas arbitrariamente.
- O histórico de alterações **novo** é criado pela interface; respostas legadas permanecem no registro `gestao.legado` sem datas/autores inventados.
- Mudanças paralelas no mesmo JSON exigem comparação/merge no GitHub: a interface não resolve conflitos automaticamente.
- Os campos `referencias` são identificadores textuais; não significa que as integrações técnicas já existam.

## Verificações da entrega

Validação de JSON e de sintaxe JavaScript; auditoria de IDs e contagens; testes automatizados da interface em Chromium com fonte de dados injetada em memória, cobrindo: criação de aba Gestor, subárea, pergunta, resposta, aprovação confirmada, exportação íntegra, e layout mobile sem rolagem horizontal. A versão publicada por servidor HTTP dependerá do ambiente em que for hospedada.
