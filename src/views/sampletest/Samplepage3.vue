<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">테스트 / </span>
      <router-link to="/dashboard/sampletest/samplepage3">새로고침</router-link>
    </p>

    <p class="conTitle">
      <span>실시간테스트</span>
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
            ></td>
          </tr>
        </table>
      </span>
    </p>

    <div class="chat-list">
      <div class="chat-item" v-for="chat in chats" :key="chat.id">
        <div class="chat-item-info" @click="chatJoin">
          <div class="chat-item-name">{{ chat.name }}</div>
          <div class="chat-item-participants">{{ chat.participants }}명</div>
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
      chats: [
        { id: 1, name: "친구들", participants: 3 },
        { id: 2, name: "가족", participants: 5 },
        { id: 3, name: "회사", participants: 10 },
        { id: 4, name: "동호회", participants: 8 },
        { id: 5, name: "스터디 그룹", participants: 4 },
      ],
    };
  },
  mounted() {
    this.searchlist();
  },
  methods: {
    searchlist: function () {
      let vm = this;
      this.axios
        .post("/aAlert")
        .then((response) => {
          // console.log(JSON.stringify(response));

          // vm.list = response.data.list;
          console.log("요청 성공");
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    chatJoin: function () {
      window.open("#/test", "_blank", "width=650,height=600");
    },
    chatMake: function () {},
  },

  components: {},
};
</script>

<style>
.chatmake {
  margin-top: 20px;
  float: right;
}
</style>
