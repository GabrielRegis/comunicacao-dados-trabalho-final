

<script>
import { uuid } from "vue-uuid";

export default {
  name: "App",
  components: {},
  sockets: {
    connect: function() {},
    mensagemChegou: function(data) {
      // Verifica se a mensagem que chegou é minha, caso contrário, atualiza gráfico de última mensagem recebida
      if (data.userId !== this.userId) {
        this.ultimaMensagemRecebidaNRZ = data.mensagem;

        // Ao colocar o this.ultimaMensagemRecebida, a conversão é realizada automaricamente (TODO - Preencher os métodos no Computed)
        this.mensagensChat.push(this.ultimaMensagemRecebida);
      }
    }
  },
  methods: {
    sendMessage: function() {
      this.ultimaMensagemEnviada = this.mensagem;
      const novaMensagem = {
        userId: this.userId,
        mensagem: this.ultimaMensagemEnviadaNRZ
      };
      this.$socket.emit("enviarMensagem", novaMensagem);

      // Adiciona a mensagem localmente
      const novaMensagemLocal = {
        userId: this.userId,
        mensagem: this.mensagem
      };

      this.mensagensChat.push(novaMensagemLocal);

      this.mensagem = null;
    },
    mensagemParaStringNumeros(msg) {
      if (msg === null) {
        return null;
      }
      return msg
        .split("")
        .map(function(char) {
          if (/^\d+$/.test(char)) {
            return char;
          }
          return char.charCodeAt(0);
        })
        .reduce(function(current, previous) {
          return previous.toString() + current.toString();
        })
        .toString();
    },

    // TODO - Verificar se estão convertendo para binário corretamente
    stringParaBinario(str) {
      function zeroPad(num) {
        return "00000000".slice(String(num).length) + num;
      }

      return str.replace(/[\s\S]/g, function(str) {
        str = zeroPad(str.charCodeAt().toString(2));
        return !1 == str ? str : str;
      });
    },
    mensagemBinaria: function(mensagem) {
      return mensagem
        ? this.stringParaBinario(this.mensagemParaStringNumeros(mensagem))
        : null;
    },
    binarioParaNRZ(mensagemBinaria) {
      if (mensagemBinaria === null) {
        return;
      }
      const serieA = mensagemBinaria.split("").map(value => {
        // TODO - Aplicar NRZ Aqui
        // value será alterado para o valor correto, resultado do alg
        return value;
      });
      return [
        {
          data: serieA
        }
      ];
    },
    // TODO
    nRZParaBinario(mensagemNRZ) {
      const mensagemNRZString = mensagemNRZ[0].data.reduce(function(
        current,
        previous
      ) {
        return previous.toString() + current.toString();
      });
      // Mudar isso, só coloquei = para compilar.
      // Alterar mensagemNRZString para binário. Processo inverso ao NRZ
      let resultado = mensagemNRZString;
      return resultado;
    },
    // TODO
    binarioParaMensagem(mensagemBinario) {
      // Mudar isso, só coloquei = para compilar
      let resultado = mensagemBinario;
      return resultado;
    }
  },

  computed: {
    ultimaMensagemEnviadaBinaria() {
      return this.mensagemBinaria(this.ultimaMensagemEnviada);
    },
    ultimaMensagemEnviadaNRZ() {
      return this.binarioParaNRZ(this.ultimaMensagemEnviadaBinaria);
    },

    // TODO
    ultimaMensagemRecebidaBinaria() {
      return this.nRZParaBinario(this.ultimaMensagemRecebidaNRZ);
    },
    ultimaMensagemRecebida() {
      return this.binarioParaMensagem(this.ultimaMensagemRecebidaBinaria);
    }
  },

  // State
  data() {
    return {
      userId: uuid.v1(),
      // Ultima mensagem que o usuário enviou
      ultimaMensagemEnviada: null,

      // Última mensagem que o usuário recebeu, que será uma mensagem codificada com o NRZ
      ultimaMensagemRecebidaNRZ: null,
      mensagem: null,
      mensagensChat: [],
      chartOptions: {
        chart: {
          height: 200,
          zoom: {
            enabled: false
          }
        },
        xaxis: {
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
                />
                <v-text-field
                  v-model="ultimaMensagemEnviadaBinaria"
                  class="title"
                  label="Binário"
                  readonly
                  placeholder="Mensagem binária"
                />
                <apexchart
                  type="line"
                  height="350"
                  :options="chartOptions"
                  :series="ultimaMensagemEnviadaNRZ"
                />
              </v-form>
              <v-form v-if="ultimaMensagemRecebidaNRZ">
                <h1 class="title">Última mensagem recebida</h1>
                <apexchart
                  type="line"
                  height="350"
                  :options="chartOptions"
                  :series="ultimaMensagemRecebidaNRZ"
                />
                <v-text-field
                  v-model="ultimaMensagemRecebidaBinaria"
                  class="title"
                  label="Binário"
                  readonly
                  placeholder="Mensagem binária"
                />
                <v-text-field
                  v-model="ultimaMensagemRecebida"
                  class="title"
                  label="Mensagem"
                  placeholder="Mensagem"
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
                    :class="[' font-weight-light', 'message', mensagem.userId !== userId && 'friendMessage']"
                  >{{mensagem.mensagem}}</h4>
                </div>
              </div>
              <v-text-field
                @keyup.enter="sendMessage"
                v-model="mensagem"
                class="title"
                label="Mensagem"
                placeholder="Mensagem"
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
