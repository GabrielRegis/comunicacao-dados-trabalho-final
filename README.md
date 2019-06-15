# Comunicacao de Dados Trabalho Final - NRZ, RZ
### Alunos:
##### Gabriel Biesek Regis
##### Gabriel Eugênio Brito
##### Aurélio Vinícius

## Como rodar

### Servidor Socket:
1. Entrar no dirertório servidor-socket
2. Rodar o seguinte comando: `yarn socketServer` 

### Client Chat:
1. Entrar no dirertório comunicacao-dados-trabalho-final
2. Rodar o seguinte comando: `yarn server` 

### Como funciona?

#### Servidor Sockets
É aberto um servidor socket, feito em Node.js. Sua função é direcionar as mensagens recebidas através do cliente para todos os sockets conectados através de broadcasting.

#### Clientes
Os usuários clientes se conectam ao servidor socket através de uma aplicação desenvolvida em Vue, na qual é possível enviar uma mensagem para todos conectados.

Ao enviar uma mensagem, o gráfico e informações da mensagem enviada será ativada à esquerda.

Ao receber uma mensagem, o gráfico e informações da mensagem enviada será ativada à esquerda.

**Obs**: Só são apresentados os gráficos e informações da última mensagem recebida e da última mensagem enviada.

## Backlog
Coloquei um label TODO no código, pesquisem com `control + F`.
- [x] Front-end
- [x] Configuração de Socktes no cliente
- [x] Configuração do servidor de sockets
- [x] Configuração dos gráficos
- [x] Função Última mensagem enviada para binário
- [ ] Função Última mensagem enviada em binário para NRZ
- [ ] Função última mensagem recebida em NRZ para Bináiro
- [ ] Função última mensagem recebida em Binário para Mensagem Recebida
