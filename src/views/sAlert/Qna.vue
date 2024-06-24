<template>
  <v-container>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
      </v-card-title>
      <div class="container">
        <div class="filter-button-group">
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'all' }"
            @click="filtered('all')"
            >전체</v-btn>
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'replied',
            }"
            @click="filtered('replied')"
            >답변</v-btn>
        </div>
        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
            <input
              type="text"
              class="search-input"
              placeholder="검색어를 입력해주세요."
              v-model="searchKeyword"
              @keydown.enter="handleSearch"
            />
          </div>
          <div class="button-group">
            <button class="search-button" @click="handleSearch">검색</button>
          </div>
        </div>
      </div>
      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>과목</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>답변여부</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in listQna" :key="item.question_no">
              <tr class="table_row" @click="sQnaSelected(item.question_no)">
                <td>{{ item.course_name }}</td>
                <td>{{ item.question_title }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.question_created_at }}</td>
                <td>{{ item.reply_no > 0 ? 'Y' : 'N' }}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr style="text-align: center">
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>
    <div id="qnaPagination">
      <paginate
        class="justify-content-center"
        v-model="currentPage"
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="qna_list"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      >
      </paginate>
    </div>

    <div class="button-group">
      <button class="insert-button" @click="sQnaSubmit()">등록</button>
    </div>

    <v-dialog v-model="sQnaSubmitModal" max-width="600px">
      <v-card>
        <v-card-text>
          <sQnaSubmitModal @close-modal="closeSubmitModal" :action="action" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="sQnaSelectedModal" max-width="1000px">
      <v-card>
        <v-card-text>
          <sQnaSelectedModal
            :action="action"
            :sQuestionNo="sQuestionNo"
            @close-modal="sQnaSelectedClosed"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import sQnaSubmitModal from "./SQnaSubmitModal.vue";
import sQnaSelectedModal from "./SQnaSelectModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    sQnaSubmitModal,
    sQnaSelectedModal,
    Paginate,
  },
  data() {
    return {
      titleText: "질의응답",
      sQnaSubmitModal: false,
      sQnaSelectedModal: false,
      action: "",
      activeFilter: "all",
      listQna: [],
      sQuestionNo: 0,
      currentPage: 1,
      totalCnt: 0,
      pageSize: 10,
      searchKeyword: "",
      status: "",
      studentSignedInID: ""
    };
  },
  mounted() {
    this.qna_list();
    console.log("studentSignedInID_mounted: ", this.studentSignedInID);
  },
  methods: {
    sQnaSubmit() {
      this.action = "I";
      this.sQnaSubmitModal = true;
    },
    closeSubmitModal() {
      this.sQnaSubmitModal = false;
      this.qna_list();
    },
    sQnaSelected(sQuestionNo) {
      this.sQnaSelectedModal = true;
      this.sQuestionNo = sQuestionNo;
      this.action = "S";
    },
    sQnaSelectedClosed() {
      this.sQnaSelectedModal = false;
      this.qna_list();
    },
    qna_list() {
      let vm = this;
      let qnaParams = new URLSearchParams();
      qnaParams.append("question_title", this.question_title);
      qnaParams.append("question_no", this.question_no);
      qnaParams.append("question_content", this.question_content);
      qnaParams.append("question_created_at", this.question_created_at);
      qnaParams.append("name", this.name);
      qnaParams.append("searchKeyword", this.searchKeyword);
      qnaParams.append("status", this.status);
      qnaParams.append("currentPage", this.currentPage);
      qnaParams.append("pageSize", this.pageSize);
      qnaParams.append("studentSignedInID", this.studentSignedInID);
      console.log("studentSignedInID_qnaparam: ", this.studentSignedInID);

      axios
        .post("/sAlert/sQnaList.do", qnaParams)
        .then((response) => {
          vm.totalCnt = response.data.totalCnt;
          vm.listQna = response.data.listQna;
          console.log(response.data.listQna);
        })
        .catch((error) => {
          alert("ERROR" + error);
        });
    },
    handleSearch() {
      console.log("searchKeyword: ", this.searchKeyword);
      this.currentPage = 1;
      this.qna_list();
    },
    filtered(param) {
      if (param === "all") {
        this.activeFilter = param;
        this.status = "";
      } else if (param === "replied") {
        this.activeFilter = param;
        this.status = param;
      }
      this.qna_list();
    },
    page() {
      var total = this.totalCnt;
      var page = this.pageSize;
      var remaining = total % page;
      var result = parseInt(total / page);

      if (remaining === 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  margin-bottom: 20px;
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
  height: 50px;
  align-items: center;
  justify-content: space-between;
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
  cursor: pointer;
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold !important;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
