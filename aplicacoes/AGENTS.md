# Construção das aplicações

## Estado atual

- `advogadoja-mock-services/` é o mock legado. Ele continua sendo a referência
  executável de dados simulados enquanto a nova aplicação Flutter é definida.
- `flutter/` foi limpo intencionalmente. Não restaure código, telas, rotas ou
  estruturas anteriores sem uma decisão explícita.
- Arquivos-base Flutter/Firebase, Rules e Functions que ainda estiverem em
  `flutter/` são obsoletos e não são fonte de verdade. Eles ficam guardados
  somente como insumos provisórios para refinamento futuro e podem conter mais
  regras do que o necessário. Não os conecte, copie, use como requisito nem
  tome decisões atuais a partir deles.

## Ordem obrigatória de construção

Uma tela só entra no Flutter depois de estar definida e fechada no construtor e
no mapa. O fechamento inclui especificação, ações, navegação e integração de
dados necessária. A sequência obrigatória é:

```text
Construtor + mapa (definir e fechar) → Flutter (implementar) → Mock (adaptar)
```

O mock é adaptado por último para reproduzir o contrato e o comportamento já
fechados. Não use o mock para decidir a UI, a navegação ou regras ainda abertas.
Enquanto uma tela ou fluxo não estiver fechado no construtor/mapa, não crie sua
implementação Flutter nem endpoints, fixtures ou comportamento novo no mock.

### Primeira sequência autorizada

1. splash;
2. boas-vindas;
3. login.

Está autorizada somente a navegação visual desta sequência:

```text
Splash → Boas-vindas → Entrar → Em construção
```

O botão **Entrar** deve levar ao estado padrão **Em construção**. Os campos
podem ser exibidos para preservar a estrutura da tela, mas não validam nem
enviam credenciais. Google, Apple/iOS, recuperação de senha, criação de conta,
autenticação e qualquer integração continuam fora de escopo até serem
especificadas e fechadas no construtor/mapa.

## Fronteira obrigatória de dados

As telas Flutter só podem depender de contratos/interfaces de dados neutros de
infraestrutura. Elas não podem importar Firebase, Firestore, Functions, HTTP do
mock, fixtures ou detalhes de serialização.

```text
Telas Flutter → contratos/interfaces → implementação selecionada
                                             ├─ mock (agora)
                                             └─ Firebase (futuro)
```

O contrato define modelos, operações, erros e regras observáveis pela tela. A
implementação mock atual deve cumprir esse contrato. No futuro, a implementação
Firebase deverá cumprir o mesmo contrato; trocar a implementação não pode exigir
alterações na camada de telas.

## Recriação progressiva do mock

O mock precisa ser autossuficiente: deve iniciar, fornecer dados fictícios e
exercitar seus fluxos sem depender do Flutter. Não importe código do Flutter no
mock e não transforme o Flutter em pré-requisito para rodá-lo.

Para cada funcionalidade fechada no construtor/mapa:

1. derive ou atualize o contrato de dados a partir da especificação fechada;
2. implemente o Flutter somente contra esse contrato;
3. adapte o mock e as fixtures para cumprir o contrato e o comportamento
   fechado;
4. mantenha testes de contrato ou validações equivalentes entre consumidor e
   mock;
5. só introduza uma adaptação Firebase quando essa fase for autorizada.

Não migre o mock inteiro de uma vez, não replique telas no mock e não adicione
Firebase por conveniência.

## Firebase reservado

Os arquivos Firebase existentes não definem o comportamento da nova UI nem
autorizam integrações ativas. Eles são obsoletos; não os copie ou conecte e não
os trate como requisitos. Quando a fase Firebase começar, refine os contratos
fechados e implemente um adaptador separado, validando cada regra necessária em
vez de herdar regras antigas. Evite Cloud Functions, salvo necessidade real de
segredo de servidor, webhook, integração servidor-a-servidor ou privilégio não
delegável ao cliente.

## Bootstrap e primeira jornada autorizados

Foi autorizada uma casca inicial mínima em `flutter/lib/main.dart` para permitir
publicar e verificar o Flutter Web. Ela agora também abriga exclusivamente a
primeira jornada visual autorizada acima, baseada nas referências do Construtor
V2. Não introduza comportamento além desse limite sem atualizar esta decisão.

Não criar outros fluxos de negócio, autenticação, integração Firebase ou código
de migração legada antes do fechamento correspondente.
