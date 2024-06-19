<template>
  <div class="chat-room">
    <div class="chat-room-header">
      <div class="chat-room-name">{{ chatRoom.chat_name }}</div>
      <div class="chat-room-participants">{{ chatRoom.count_people }}명 참여</div>
    </div>
    <div class="chat-messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="{'message-right': message.sender === this.loginID, 'message-left': message.sender !== this.loginID}"
        class="chat-message"
      >
        <div class="message-sender">{{ message.sender }}</div>
        <div class="message-content">{{ message.content }}</div>

      </div>
    </div>
    <div class="chat-input">
      <input type="text" v-model="newMessage" @keyup.enter="sendMessage">
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script>
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default {
  // props: ['chatRoom'],
  //         loginID: String,
    props: {chatRoom: Object,
          loginID: String,
  },
  data() {
    return {
      client: null,
      connected: false,
      newMessage: '',
      messages: []
    };
  },  
  mounted() {
    console.log("로그인 아이디 = " + this.loginID);
  },
  methods: {
    connect() {
      this.client = new Client({
        webSocketFactory: () => new SockJS('/chat'), // 예시 URL
        reconnectDelay: 5000,
        debug: (str) => {
          console.log(str);
        }
      });

      this.client.onConnect = () => {
        this.connected = true;
        this.client.subscribe(`/topic/messages/${this.chatRoom.chat_no}`, (message) => {
          this.messages.push(JSON.parse(message.body));
          console.log('Received message:', message);
          //  this.$set(this.messages, this.messages.length, JSON.parse(message.body));
          //  this.$nextTick(() => {
          //   // 화면이 업데이트된 후에 실행할 코드 작성
          //   });
        });
      };

      this.client.onStompError = (frame) => {
        console.error(frame.headers['message']);
        console.error(frame.body);
      };

      this.client.activate();
    },
    disconnect() {
      if (this.client !== null) {
        this.client.deactivate();
      }
      this.connected = false;
    },
    sendMessage() {
      if (this.newMessage.trim() !== '') {
        const message = {
          sender: this.loginID,
          content: this.newMessage,
          chatRoomId: this.chatRoom.chat_no
        };
        this.client.publish({
          destination: `/socket/chat/${this.chatRoom.chat_no}`,
          body: JSON.stringify(message)
        });
        this.newMessage = '';
      }
    }
  },
  watch: {
    chatRoom(newChatRoom, oldChatRoom) {
      if (newChatRoom.chat_no !== oldChatRoom.chat_no) {
        this.disconnect();
        this.connect();
      }
    }
  },
  created() {
    this.connect();
  },
  beforeUnmount() { 
    this.disconnect();
  }
};
</script>
<style scoped>
</style>
