<template>
  <div id="comnCodMgr">


    <p class="conTitle">
      <span>채팅방 목록</span>
      <span>
        <table
          style="border: 1px #50bcdf"
          width="100%"
          cellpadding="5"
          cellspacing="0"
          border="1"
          align="left"
        >
          <tr style="border: 0px; border-color: blue">
            <td
              width="50"
              height="25"
              style="font-size: 100%; text-align: left"
            >
            </td>
          </tr>
        </table>
      </span>
    </p>

    
    <div class="chat-list">
      <div class="chat-item" v-for="chat in chats" :key="chat.chat_no">
        <div class="chat-item-info"  @click="chatJoin(chat.chat_no)">
          <div class="chat-item-name">{{ chat.chat_name }}</div>
          <div class="chat-item-participants">{{ chat.count_people }}명</div>
          <div>채팅방 입장</div>
        </div>
      </div>
    </div>
    <div>
      <a class="btn btn-primary mx-2 chatmake" name="btnNew" @click="chatMake">
        <span>채팅방 생성</span>
      </a>
    </div>




  </div>
</template>

<script>

export default {
  data: function () {
    return {
      list: [],
      chats: [],

    
  
    };
  },
  mounted() {
    this.searchlist();
  },
  methods: {
    searchlist: function () {
      let vm = this;


      // let params = new URLSearchParams()
      // params.append('courseNo', this.courseNo)

      this.axios
        .post("/support/chatRoomList")
        .then((response) => {
          //console.log(JSON.stringify(response));

          vm.chats = response.data.listdata;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    chatJoin(chatNo) {

      let params = new URLSearchParams()
      params.append('chatNo', chatNo)

      this.axios
        .post("/support/chatRoomJoin", params)
        .then((response) => {
          console.log(JSON.stringify(response));


        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });

      window.open('#/myChatRoomList', '_blank', 'width=650,height=600');

    },

    chatMake: function ()  {


    },


  },

  components: { },
};
</script>

<style>

.chatmake {
  margin-top: 20px;
    float: right;
}
</style>
