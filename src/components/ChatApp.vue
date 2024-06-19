<template>

  <div id="app">
    <div class="chat-list-container">
      <chat-list :chats="chats" @select-chat="selectChat"></chat-list>
    </div>
    <div class="chat-room-container">
      <chat-room v-if="selectedChat" :loginID="loginID" :chatRoom="selectedChat"></chat-room>
    </div>
  </div>
    

</template>

<script>

import ChatList from './ChatList.vue';
import ChatRoom from './ChatRoom.vue';


export default {
  data: function () {
    return {
      chats: [], 
      selectedChat: null,
      loginID:"", 

    };
  },
  mounted() {
    this.searchlist();
  },
  methods: {
    selectChat(chat) {
      this.selectedChat = chat;
    },
    searchlist: function () {
      let vm = this;

      this.axios
        .post("/support/myChatRoomList")
        .then((response) => {
          console.log(JSON.stringify(response.data.listdata));

          vm.chats = response.data.listdata;
          vm.loginID = response.data.loginID;

        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
  },

  components: {
    ChatList,
    ChatRoom
  },
};
</script>

<style>

</style>
