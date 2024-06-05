<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>
      <div class="container">
        <div class="filter-button-group">
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'all' }"
            @click="findAll"
            >전체</v-btn
          >
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'a' }"
            @click="findAdmin"
            >관리자</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 't',
            }"
            @click="findTeacher"
            >강사</v-btn
          >
        </div>

        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
            <input
              type="text"
              class="search-input"
              placeholder="검색어를 입력해주세요."
              v-model="stitle"
            />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchList(stitle)">
              검색
            </button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>글번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="item in noticeList">
            <tr v-if="this.activeFilter === 'all'" :key="item.notice_no">
              <td @click="selectNotice(item.notice_no,'')">
                {{ item.notice_no }}
              </td>
              <td @click="selectNotice(item.notice_no,'')">
                {{ item.notice_title }}
              </td>
              <td>{{ item.loginID }}</td>
              <td>{{ item.notice_created_at }}</td>
            </tr>
            <tr
              v-else-if="this.activeFilter === item.user_type"
              :key="item.notice_no"
            >
              <td @click="selectNotice(item.notice_no,'')">
                {{ item.notice_no }}
              </td>
              <td @click="selectNotice(item.notice_no,'')">
                {{ item.notice_title }}
              </td>
              <td>{{ item.loginID }}</td>
              <td>{{ item.notice_created_at }}</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>

    <!-- 페이지네이션 추가-->
    <div id="noticePagination">
      <paginate
        class="justify-content-center"
        v-model="currentPage"
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="searchList"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      ></paginate>
    </div>

    <div class="button-group">
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>
    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <NoticeModal
            :action="action"
            :notice_content="notice_content"
            :notice_created_at="notice_created_at"
            :notice_no="notice_no"
            :notice_title="notice_title"
            :loginID="loginID"
            :paction="action"
            @close="closePopup"
            @searchList="searchList"
            @selectNotice="selectNotice"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NoticeModal from "./ANoticeModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    NoticeModal,
  },
  props: {
    // notice_title: String,
    // loginID: String,
    // notice_content: String,
    // notice_created_at: String,
    // notice_no: Number,
  },
  data() {
    return {
      titleText: "공지사항",
      addModal: false,
      action: "",
      selectedNotice: null,
      activeFilter: "all",
      stitle: "",
      noticeList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      notice_title: "",
      loginID: "",
      notice_content: "",
      notice_created_at: "",
      notice_no: 0,
    };
  },
  mounted() {
    this.searchList();
    this.page();
  },
  methods: {
    searchList: function (stitle) {
      let vm = this;

      if (stitle !== undefined) {
        vm.stitle = stitle;
      }

      let params = new URLSearchParams();
      params.append("stitle", this.stitle);

      this.axios
        .post("/aAlert", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          vm.noticeList = response.data;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    openAddModal: function () {
      this.action = "I";
      this.addModal = true;
      this.notice_title = "";
      this.notice_content = "";
    },
    findAll() {
      this.activeFilter = "all";
    },
    findAdmin() {
      this.activeFilter = "a";
    },
    findTeacher() {
      this.activeFilter = "t";
    },
    searchMethod() {},
    noticeModify(notice_no) {
      this.selectedNotice = notice;
      this.action = "U";
      this.addModal = true;
    },
    selectNotice(notice_no, action) {
      this.action = action;
      let vm = this;

      let params = new URLSearchParams();
      params.append("notice_no", notice_no);

      this.axios
        .post("/aAlert/notice", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          this.notice_title = response.data.notice_title;
          this.loginID = response.data.loginID;
          this.notice_content = response.data.notice_content;
          this.notice_created_at = response.data.notice_created_at;
          this.notice_no = response.data.notice_no;
          this.openPopup();
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    openPopup: async function () {
      this.addModal = true;
    },
    closePopup: async function () {
      this.addModal = false;
    },
    page: function () {
      var total = this.totalCnt;
      var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

.titletext {
  font-size: 24px;
  font-weight: bold;
}

.container {
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
}

.filter-button-group {
  display: flex;
  margin: 16px 0;
}

.filter-button {
  background-color: #f4f6f8;
  color: #2c3e50;
  border-radius: 20px;
  padding: 8px 16px;
  margin: 0 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.filter-button.active {
  background-color: #407bff;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.filter-button:hover {
  background-color: #5a9bff;
}

.search {
  display: flex;
  justify-content: flex-end;
}

.search-container {
  display: flex;
  align-items: center;
  /* padding: 10px; */
  /* padding: 20px; */
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 16px 0;
}

.search-icon {
  margin: 8px;
  color: #555;
}

.search-input {
  flex-grow: 1;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 16px;
}

.button-group {
  text-align: right;
  padding: 16px;
}

.search-button,
.insert-button {
  padding: 10px 17px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover,
.insert-button:hover {
  background-color: #0056b3;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
