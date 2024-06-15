<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <div class="container">
        <div class="filter-button-group">
          <v-btn :class="{ 'filter-button': true, active: activeFilter === 'all' }" @click="findAll">전체</v-btn>
          <v-btn :class="{ 'filter-button': true, active: activeFilter === 'a' }" @click="findAdmin">관리자</v-btn>
          <v-btn :class="{ 'filter-button': true, active: activeFilter === 't' }" @click="findTeacher">강사</v-btn>
        </div>

        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
            <input type="text" class="search-input" placeholder="검색어를 입력해주세요." v-model="stitle" @keyup.enter="searchMethod" />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchMethod">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>글번호</th>
            <th>작성자</th>
            <th>제목</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in noticeList" :key="item.notice_no">
              <tr>
                <td>{{ item.display_no }}</td>
                <td>{{ item.loginID }}</td>
                <td @click="noticeModify(item)">{{ item.notice_title }}</td>
                <td>{{ item.notice_created_at }}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="4">공지사항이 없습니다.</td>
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
        :click-handler="pagination"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      ></paginate>
    </div>

    <div class="button-group">
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>

    <v-dialog v-model="addModal" max-width="800px" max-height="1000px">
      <v-card>
        <v-card-text>
          <NoticeModal @close-modal="closeAddModal" :action="action" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modifyModal" max-width="800px" max-height="1000px">
      <v-card>
        <v-card-text>
          <NoticeModifyModal @close-modal="closeModifyModal" :action="action" :noticeNo="noticeNo" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import NoticeModal from "./TNoticeModal.vue";
import NoticeModifyModal from "./TNoticeModifyModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    NoticeModal,
    NoticeModifyModal,
    Paginate,
  },
  data() {
    return {
      titleText: "공지사항",
      addModal: false,
      modifyModal: false,
      action: "",
      selectedNotice: null,
      activeFilter: "all",
      stitle: "",
      noticeList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      noticeNo: 0,
    };
  },

  mounted() {
    this.searchList();
    this.page();
  },

  methods: {
    onEnterKey() {
      this.$refs.searchButton.click(); // 엔터 키를 누르면 검색 버튼을 클릭
    },

    searchList: function () {
      let vm = this;

      let params = new URLSearchParams(); // 파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      if (this.activeFilter !== "all") {
        params.append("user_type", this.activeFilter); // 필터링된 데이터 가져오기 위해 userType 추가
      }

      console.log("Search Params:", params.toString());

      this.axios
        .post("/tAlert/searchNotice.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          vm.noticeList = response.data.listdata || [];
          vm.totalCnt = response.data.totalcnt || vm.noticeList.length;

          // 전체 데이터의 인덱스를 기반으로 글 번호를 매김 (오래된 순으로 번호 매기기)
          let totalData = vm.noticeList.map((item, index) => {
            item.display_no = vm.totalCnt - ((vm.currentPage - 1) * vm.pageSize + index);
            return item;
          });

          // 페이지 내에서는 최신 글이 위로 오도록 함
          vm.noticeList = totalData;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    pagination(pageNum) {
      if (pageNum) {
        this.currentPage = pageNum;
        this.searchList(); // 페이지가 바뀔 때마다 데이터를 다시 가져옴
      }
    },

    findAll() {
      this.currentPage = 1;
      this.activeFilter = "all";
      this.searchList();
    },

    findAdmin() {
      this.currentPage = 1;
      this.activeFilter = "a";
      this.searchList();
    },

    findTeacher() {
      this.currentPage = 1;
      this.activeFilter = "t";
      this.searchList();
    },

    searchMethod() {
      this.currentPage = 1; // 검색 시 1페이지로 초기화
      this.searchList();
    },

    noticeModify(item) {
      this.noticeNo = item.notice_no;
      this.modifyModal = true;
    },

    openAddModal() {
      this.addModal = true;
    },

    closeAddModal() {
      this.addModal = false;
      this.searchList();
    },
    closeModifyModal() {
      this.modifyModal = false;
      this.searchList();
    },

    page() {
      var total = this.totalCnt;
      var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx === 0) {
        return result;
      } else {
        return result + 1;
      }
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
