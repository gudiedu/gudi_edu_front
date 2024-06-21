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
          <template v-for="item in pageList">
            <tr v-if="this.activeFilter === 'all'" :key="item.notice_no">
              <td @click="selectNotice(item.notice_no, '')">
                {{ item.notice_no }}
              </td>
              <td @click="selectNotice(item.notice_no, '')">
                {{ item.notice_title }}
              </td>
              <td>{{ item.loginID }}</td>
              <td>{{ item.notice_created_at }}</td>
            </tr>
            <tr
              v-else-if="this.activeFilter === item.user_type"
              :key="item.notice_no"
            >
              <td @click="selectNotice(item.notice_no, '')">
                {{ item.notice_no }}
              </td>
              <td @click="selectNotice(item.notice_no, '')">
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
        :click-handler="pagination()"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      ></paginate>
    </div>

    <div class="button-group">
      <button class="insert-button" @click="addNotice">등록</button>
    </div>
    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <NoticeModal
            :action="action"
            :noticeContent="noticeContent"
            :noticeCreatedAt="noticeCreatedAt"
            :noticeNo="noticeNo"
            :noticeTitle="noticeTitle"
            :loginId="loginId"
            :paction="action"
            :previewHtml="previewHtml"
            :fileName="fileName"
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
    Paginate,
  },
  data() {
    return {
      titleText: "공지사항",
      addModal: false,
      /** @vue-data {String} action - 조회 수정,저장 구분 변수 */
      action: "",
      selectedNotice: null,
      /** @vue-data {String} activeFilter - 공지사항 작성자 타입 변수 */
      activeFilter: "all",
      stitle: "",
      /** @vue-data {any[]} noticeList - 전체 공지사항 목록 */
      noticeList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      noticeTitle: "",
      loginId: "",
      noticeContent: "",
      noticeCreatedAt: "",
      noticeNo: 0,
      /** @vue-data {any[]} typeList - 관리자, 강사 별 공지사항 목록 */
      typeList: [], 
      /** @vue-data {String} previewHtml - 이미지 미리보기 HTML 코드 */
      previewHtml: "",
      /** @vue-data {String} fileName - 원본 파일명 */
      fileName: "",
      /** @vue-data {String} etx - 파일 확장자 */
      etx: "",
    };
  },
  mounted() {
    this.searchList();
    this.page();
  },
  methods: {
    /** 
     * 전체 공지사항 목록 조회
     * @param {String} stitle - 검색어
     */
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
          vm.totalCnt = vm.noticeList.length;
          vm.typeList = vm.noticeList;
          vm.findType(vm.activeFilter);
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    addNotice() {
      this.previewHtml = null;
      this.fileName = null;
      this.noticeTitle = "";
      this.noticeContent = "";
      this.action = "I";
      this.addModal = true;
    },
    /**
     * 타입별 페이지네이션을 위해 분배하는 메서드
     * @param {String} userType - 전체/관리자/강사 등 작성자 타입
     */
    findType(userType) {
      if (userType === "a") {
        this.findAdmin();
      } else if (userType === "t") {
        this.findTeacher();
      } else {
        this.findAll();
      }
    },
    findAll() {
      this.currentPage = 1;
      this.activeFilter = "all";
      this.typeList = this.noticeList;
      this.totalCnt = this.noticeList.length;
    },
    findAdmin() {
      this.currentPage = 1;
      this.activeFilter = "a";
      this.typeList = this.noticeList.filter((e) => e.user_type === "a");
      this.totalCnt = this.typeList.length;
    },
    findTeacher() {
      this.currentPage = 1;
      this.activeFilter = "t";
      this.typeList = this.noticeList.filter((e) => e.user_type === "t");
      this.totalCnt = this.typeList.length;
    },
    /**
     * 공지사항 수정 메서드
     */
    noticeModify() {
      this.selectedNotice = notice;
      this.action = "U";
      this.addModal = true;
    },
    /**
     * 공지사항 조회 메서드
     * @param {Number} noticeNo - 선택한 공지사항 번호
     * @param {String} action - 조회,수정을 결정하는 변수
     */
    selectNotice(noticeNo, action) {
      this.action = action;
      let vm = this;

      let params = new URLSearchParams();
      params.append("notice_no", noticeNo);

      this.axios
        .post("/aAlert/notice", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          this.noticeTitle = response.data.notice_title;
          this.loginId = response.data.loginID;
          this.noticeContent = response.data.notice_content;
          this.noticeCreatedAt = response.data.notice_created_at;
          this.noticeNo = response.data.notice_no;
          this.ext = response.data.file_extension;

          if (!response.data.file_no) {
            this.previewHtml = "";
            this.fileName = "";
          } else {
            this.previewHtml = response.data.file_origin;
            this.fileName = response.data.file_origin;

            let ext = response.data.file_extension;

            if (
              ext.toLowerCase() == "jpg" ||
              ext.toLowerCase() == "jpeg" ||
              ext.toLowerCase() == "png" ||
              ext.toLowerCase() == "gif"
            ) {
              this.previewHtml =
                "<img src='" +
                response.data.file_local_path +
                "' id 'imgFile' style='width:100px; height 100px;' />";
            } else {
              this.previewHtml = "<div>" + response.data.file_origin + "</div>";
            }
          }
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
      let total = this.totalCnt;
      let page = this.pageSize;
      let xx = total % page;
      let result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    pagination() {
      let endElement = this.currentPage * this.pageSize;
      let startElement = endElement - this.pageSize;
      this.pageList = this.typeList.slice(startElement, endElement);
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
