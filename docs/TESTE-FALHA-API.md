# Teste da falha ao carregar aulas (tarefa 4.3 — Pedro Bassi)

## Comportamento implementado

- O front-end consulta `GET /api/aulas` ao abrir a aplicação.
- Os dados de exemplo locais foram removidos do fluxo da tela.
- Enquanto a consulta está em andamento, a tela informa `Carregando aulas...`.
- Se a API falhar ou devolver um formato inesperado, a lista de aulas fica vazia e a tela mostra `Não foi possível carregar as aulas`.
- O botão `Tentar novamente` repete a consulta à API.
- Os cursos exibidos nos filtros passam a ser derivados das aulas recebidas da API; não são preenchidos com cursos fictícios.

## Como testar

1. Inicie o front-end com `npm run dev`.
2. Deixe o back-end desligado ou interrompa temporariamente a API.
3. Abra a aplicação no navegador.
4. Confirme que aparece `Não foi possível carregar as aulas` e o botão `Tentar novamente`.
5. Confirme que nenhuma aula de exemplo aparece no painel ou nos filtros.
6. Ligue o back-end e clique em `Tentar novamente`.
7. Quando `GET /api/aulas` estiver disponível e retornar o contrato esperado, confirme que a mensagem de erro desaparece e as aulas reais são exibidas.

## Contrato esperado pelo front-end

A rota deve retornar uma lista (diretamente ou dentro da propriedade `aulas`). Cada registro precisa conter `sala.codigo`, `diaSemana`, `horaInicio`, `horaTermino`, `turma.nome` (ou `turma.codigo`), `turma.semestre`, `curso.nome` e `professor.nome` (opcional), conforme a orientação da tarefa 4.2 no Plano de Conclusão.

## Observação sobre os arquivos recebidos

O pacote de back-end fornecido nesta conversa não contém a rota `GET /api/aulas`; seu schema Prisma ainda usa o modelo `Horario`. Portanto, o teste de recuperação com dados reais depende da integração do back-end/contrato prevista nas tarefas 3.1 e 4.2. O tratamento de erro e a repetição da consulta já estão implementados no front-end, sem criar uma rota incompatível com o modelo recebido.
