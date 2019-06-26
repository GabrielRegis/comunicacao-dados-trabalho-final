

<script>
import { uuid } from "vue-uuid";

export default {
  name: "App",
  components: {},
  sockets: {
    connect: function() {
      this.$socket.emit('entrouNaSala');
    },
    usuarioConectado: function(data) {
      this.key = data.key;
    },
    mensagemChegou: function(data) {
      // Ignora mensagens próprias
      if (data.userId !== this.userId) {
        // Melhor deixar os passos explícitos, caso o professor queira ver o código
        let binStr = this.NRZParaBinario(data.signal)
        let encryptedStr = this.binarioParaString(binStr)
        let decryptedStr = this.decrypt(encryptedStr)

        this.mensagensChat.push({
          userId: data.userId,
          conteudo: decryptedStr
        });

        // Atualiza as saídas relativas a "Ultima mensagem recebida"
        // (ver métodos em computed)
        this.ultimaMensagemRecebidaCodificada = data.signal;
      }
    }
  },
  methods: {
    sendMessage: function() {
      // Melhor deixar os passos explícitos, caso o professor queira ver o código
      let encryptedStr = this.encrypt(this.mensagemParaEnviar)
      let binStr = this.stringParaBinario(encryptedStr)
      let nrzSignal = this.binarioParaNRZ(binStr)

      this.$socket.emit("enviarMensagem", {
        userId: this.userId,
        signal: nrzSignal
      });

      this.mensagensChat.push({
        userId: this.userId,
        conteudo: this.mensagemParaEnviar,
      });

      // Atualiza as saídas relativas a "Ultima mensagem enviada"
      // (ver métodos em computed)
      this.ultimaMensagemEnviada = this.mensagemParaEnviar;

      // Limpa a textbox
      this.mensagemParaEnviar = null;
    },

    // Cifra de Vernam
    encrypt: function(str) {
      const chave = this.key;
      
      let strCriptografada = str.split("").map((char, index) => {
          return String.fromCharCode(char.charCodeAt() ^ chave.charCodeAt(index % chave.length));
      }).join("")

      return strCriptografada
    },
    decrypt(strCriptografada) {
      return this.encrypt(strCriptografada);
    },

    stringParaBinario(str) {
      if (str === null) {
        return null;
      }

      let binStr = str.split("").map(char => {
        let asciiBinCode = char.charCodeAt().toString(2);

        // Padding para cada char ficar com 8 bits
        return "0".repeat(8 - asciiBinCode.length) + asciiBinCode;
      }).join('')

      return binStr;
    },
    binarioParaString(binStr) {
      let bytes = binStr.match(/.{8}/g)
     
      let str = bytes.map(byte => {
        return String.fromCharCode(parseInt(byte, 2))
      }).join('');

      return str;
    },

    binarioParaNRZ(binStr) {
      if (binStr === null) {
        return null
      }

      // Converte a string binária em um sinal NRZ
      // Ex: "010" --> [-1, 1, -1]
      const nrzSignal = binStr.split("").map(value => {
        return value === "1" ? 1 : -1;
      });

      return nrzSignal;
    },
    NRZParaBinario(nrzSignal) {
      if (nrzSignal === null) {
        return null
      }

      // Converte o sinal NRZ em uma string binária
      // Ex: [-1, 1, -1] --> "010"
      let binStr = nrzSignal.map(value => {
        return value === 1 ? "1" : "0"
      }).join('');

      return binStr;
    },

    binarioParaRZ(binStr) {
      if (binStr === null) {
        return null
      }

      // TODO: converter binStr para o sinal RZ
      // Ex: "010" --> (-1, 0, 1, 0, -1)
      const rzSignal = binStr.split("").map(value => {
        return value;
      });

      return rzSignal;
    },
    RZParaBinario(rzSignal) {
      if (rzSignal === null) {
        return null
      }

      // TODO: converter o sinal RZ na string binária
      // Ex: (-1, 0, 1, 0, -1) --> "010"

      return "000000";
    },
  },

  computed: {
    ultimaMensagemEnviadaCriptografada() {
      return this.encrypt(this.ultimaMensagemEnviada);
    },
    ultimaMensagemEnviadaBinaria() {
      return this.stringParaBinario(this.ultimaMensagemEnviadaCriptografada);
    },
    ultimaMensagemEnviadaCodificada() {
      return this.binarioParaNRZ(this.ultimaMensagemEnviadaBinaria);
    },

    ultimaMensagemRecebidaBinaria() {
      return this.NRZParaBinario(this.ultimaMensagemRecebidaCodificada);
    },
    ultimaMensagemRecebidaCriptografada() {
      return this.binarioParaString(this.ultimaMensagemRecebidaBinaria);
    },
    ultimaMensagemRecebida() {
      return this.decrypt(this.ultimaMensagemRecebidaCriptografada);
    }
  },

  // State
  data() {
    return {
      userId: uuid.v1(),

      key: null,

      // Ultima mensagem que o usuário enviou (raw text) e que recebeu (codificado)
      ultimaMensagemEnviada: null,
      ultimaMensagemRecebidaCodificada: null,

      mensagemParaEnviar: null,
      mensagensChat: [],

      chartOptions: {
        chart: {
          height: 200,
          zoom: {
            type: 'x',
            enabled: true,
          }
        },
        xaxis: {
          type: 'numeric',
          labels: {
            show: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: "stepline"
        },
        title: {
          text: "Stepline Chart",
          align: "left"
        }
      }
    };
  }
};
</script>

<template>
  <v-layout justify-center>
    <v-flex xs12>
      <v-toolbar dark>
        <v-toolbar-title class="headline">
          <v-icon dark>chat</v-icon>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn icon>
          <v-icon>search</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card>
        <v-container fluid grid-list-md>
          <div class="mainContainer">
            <v-layout column wrap>
              <v-form v-if="ultimaMensagemEnviada">
                <h1 class="title">Última mensagem enviada</h1>
                <v-text-field
                  v-model="ultimaMensagemEnviada"
                  class="title"
                  label="Mensagem"
                  placeholder="Mensagem"
                  readonly
                />
                <v-text-field
                  v-model="ultimaMensagemEnviadaCriptografada"
                  class="title"
                  label="Criptografada"
                  placeholder="Mensagem criptografada"
                  readonly
                />
                <v-text-field
                  v-model="ultimaMensagemEnviadaBinaria"
                  class="title"
                  label="Binário"
                  placeholder="Mensagem em binário"
                  readonly
                />
                <apexchart
                  type="line"
                  height="350"
                  :options="chartOptions"
                  :series="[{ data: ultimaMensagemEnviadaCodificada }]"
                />
              </v-form>

              <v-form v-if="ultimaMensagemRecebidaCodificada">
                <h1 class="title">Última mensagem recebida</h1>
                <apexchart
                  type="line"
                  height="350"
                  :options="chartOptions"
                  :series="[{ data: ultimaMensagemRecebidaCodificada }]"
                />
                <v-text-field
                  v-model="ultimaMensagemRecebidaBinaria"
                  class="title"
                  label="Binário"
                  placeholder="Mensagem em binário"
                  readonly
                />
                <v-text-field
                  v-model="ultimaMensagemRecebidaCriptografada"
                  class="title"
                  label="Criptografada"
                  placeholder="Mensagem criptografada"
                  readonly
                />
                <v-text-field
                  v-model="ultimaMensagemRecebida"
                  class="title"
                  label="Mensagem"
                  placeholder="Mensagem"
                  readonly
                />
              </v-form>
            </v-layout>

            <div class="chatContainer">
              <div class="chat">
                <div
                  :class="['messageContainer', mensagem.userId !== userId && 'friendMessageContainer']"
                  v-for="(mensagem, index) in mensagensChat"
                  :key="index"
                >
                  <h4
                    :class="['font-weight-light', 'message', mensagem.userId !== userId && 'friendMessage']"
                  >{{mensagem.conteudo}}</h4>
                </div>
              </div>

              <v-text-field
                @keyup.enter="sendMessage"
                v-model="mensagemParaEnviar"
                class="title"
                label="Mensagem"
                placeholder="Digite sua mensagem"
              />
            </div>

          </div>
        </v-container>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<style >
.chat {
  flex: 1;
}
.chatContainer {
  background-color: #fcfcfc;
  width: 30vw;
  margin-left: 100px;
  border-radius: 20px;
  -webkit-box-shadow: 2px 2px 20px 0px rgba(204, 204, 204, 0.97);
  -moz-box-shadow: 2px 2px 20px 0px rgba(204, 204, 204, 0.97);
  box-shadow: 2px 2px 20px 0px rgba(204, 204, 204, 0.97);
  border-radius: 10px;
  transition: all 0.2s;
  padding: 30px;
}
.mainContainer {
  display: flex;
  flex-direction: row;
}
.messageContainer {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  justify-items: center;
  margin-top: 10px;
}
.friendMessageContainer {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  justify-items: center;
  margin-top: 10px;
}
.message {
  flex-grow: initial;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: "Roboto";
  text-align: left;
  vertical-align: middle;
  background-color: #f2fcfc;
  padding: 20px;
  max-width: 50%;
  border-radius: 20px;
  word-break: break-all;
}
.friendMessage {
  flex-grow: initial;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: "Roboto";
  text-align: left;
  vertical-align: middle;
  background-color: #ddddff;
  padding: 20px;
  max-width: 50%;
  border-radius: 20px;
  word-break: break-all;
}
</style>
