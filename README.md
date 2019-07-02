# Comunicacao de Dados Trabalho Final - NRZ, RZ

Alunos:

* Gabriel Biesek Regis
* Gabriel Eugenio Brito
* Aurélio Vinícius

## Como funciona?

### Servidor Socket

Tem como função somente retransmitir as mensagens recebidas para todos os clientes conectados ao socket, através de broadcasting. É implementado em NodeJs.

### Clientes

Se conectam ao servidor socket, e então podem enviar e receber mensagens para os outros clientes conectados a esse socket.

Ao enviar ou receber uma mensagem, as informações desta mensagem (texto aberto, texto criptografado, mensagem em binário e gráfico resultante da codificação de linha) são exibidas à esquerda.

É implementado com VueJs.

---

## Como rodar

### Servidor Socket:

1. Entrar no dirertório servidor-socket
2. Instalar as dependências com o comando: `yarn`
3. Rodar o seguinte comando: `yarn socketServer`

### Client Chat:

1. Entrar no dirertório client
2. Instalar as dependências com o comando: `yarn`
2. Rodar o seguinte comando: `yarn server`

---

## Backlog

- [x] Front-end
- [x] Configuração do socket no cliente
- [x] Configuração do socket no servidor
- [x] Gráficos no cliente
- [x] Conversão de string para binário e vice versa
- [x] Algoritmo de criptografia - Vernam
- [x] Codificação de linha com NRZ
- [x] Codificação de linha com RZ
- [x] Seleção de algoritmo de codificação de linha (RZ ou NRZ) no cliente
