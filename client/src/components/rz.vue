
<script>
import { uuid } from "vue-uuid";
import { encrypt, decrypt } from "../lib/crypto.js";
import {
  stringToBinary,
  binaryToString,
  binaryToRZ,
  RZToBinary
} from "../lib/conversions.js";

export default {
  name: 'rz',
  components: {},
  sockets: {
    connect: function() {
      this.$socket.emit('entrouNaSala');
    },
    usuarioConectado: function(data) {
      if(!localStorage.getItem('key')) {
        localStorage.setItem('key', data.key);
      }
    },
    mensagemChegou: function(data) {
      // Ignora mensagens próprias e que não forem RZ
      if (data.userId !== this.userId && data.codeType === 'RZ') {
        // Melhor deixar os passos explícitos, caso o professor queira ver o código
        let binStr = RZToBinary(data.signal);
        let encryptedStr = binaryToString(binStr);
        let decryptedStr = decrypt(encryptedStr, this.key);

        this.chatMessages.push({
          userId: data.userId,
          text: decryptedStr
        });

        // Atualiza as saídas relativas a "Ultima mensagem recebida"
        // (ver métodos em computed)
        this.lastMessageReceivedCoded = data.signal;
      }
    }
  },
  methods: {
    sendMessage: function() {
      // Melhor deixar os passos explícitos, caso o professor queira ver o código
      let encryptedStr = encrypt(this.userMessage, this.key);
      let binStr = stringToBinary(encryptedStr);
      let rzSignal = binaryToRZ(binStr);

      this.$socket.emit("enviarMensagem", {
        userId: this.userId,
        codeType: 'RZ',
        signal: rzSignal
      });

      this.chatMessages.push({
        userId: this.userId,
        text: this.userMessage,
      });

      // Atualiza as saídas relativas a "Ultima mensagem enviada"
      // (ver métodos em computed)
      this.lastMessageSent = this.userMessage;

      // Limpa a textbox
      this.userMessage = null;
    }
  },

  computed: {
    lastMessageSentEncrypted() {
      return encrypt(this.lastMessageSent, this.key);
    },
    lastMessageSentBinary() {
      return stringToBinary(this.lastMessageSentEncrypted);
    },
    lastMessageSentCoded() {
      return binaryToRZ(this.lastMessageSentBinary);
    },

    lastMessageReceivedBinary() {
      return RZToBinary(this.lastMessageReceivedCoded);
    },
    lastMessageReceivedEncrypted() {
      return binaryToString(this.lastMessageReceivedBinary);
    },
    lastMessageReceived() {
      return decrypt(this.lastMessageReceivedEncrypted, this.key);
    }
  },
  mounted() {
    if(localStorage.getItem('key')) {
      this.key = localStorage.getItem('key');
    }
  },
  // State
  data() {
    return {
      key: null,
      userId: uuid.v1(),

      lastMessageSent: null,
      lastMessageReceivedCoded: null,

      userMessage: null,
      chatMessages: [],

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
  <v-card>
    <v-container fluid grid-list-md>
      <div class="mainContainer">

        <v-layout column wrap>
          <v-form v-if="lastMessageSent">
            <h1 class="title">Última mensagem enviada</h1>
            <v-text-field
              v-model="lastMessageSent"
              class="title"
              label="Mensagem (texto original)"
              placeholder="Mensagem"
              readonly
            />
            <v-text-field
              v-model="lastMessageSentEncrypted"
              class="title"
              label="Mensagem criptografada"
              placeholder="Mensagem criptografada"
              readonly
            />
            <v-text-field
              v-model="lastMessageSentBinary"
              class="title"
              label="Mensagem em binário"
              placeholder="Mensagem em binário"
              readonly
            />
            <apexchart
              type="line"
              height="350"
              :options="chartOptions"
              :series="[{ data: lastMessageSentCoded }]"
            />
          </v-form>

          <v-form v-if="lastMessageReceivedCoded">
            <h1 class="title">Última mensagem recebida</h1>
            <apexchart
              type="line"
              height="350"
              :options="chartOptions"
              :series="[{ data: lastMessageReceivedCoded }]"
            />
            <v-text-field
              v-model="lastMessageReceivedBinary"
              class="title"
              label="Mensagem em binário"
              placeholder="Mensagem em binário"
              readonly
            />
            <v-text-field
              v-model="lastMessageReceivedEncrypted"
              class="title"
              label="Mensagem criptografada"
              placeholder="Mensagem criptografada"
              readonly
            />
            <v-text-field
              v-model="lastMessageReceived"
              class="title"
              label="Mensagem (texto original)"
              placeholder="Mensagem"
              readonly
            />
          </v-form>
        </v-layout>

        <div class="chatContainer">
          <div class="chat">
            <div
              :class="['messageContainer', message.userId !== userId && 'friendMessageContainer']"
              v-for="(message, index) in chatMessages"
              :key="index"
            >
              <h4
                :class="['font-weight-light', 'message', message.userId !== userId && 'friendMessage']"
              >{{ message.text }}</h4>
            </div>
          </div>

          <v-text-field
            @keyup.enter="sendMessage"
            v-model="userMessage"
            class="title"
            label="Mensagem"
            placeholder="Digite sua mensagem"
          />
        </div>

      </div>
    </v-container>
  </v-card>
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
