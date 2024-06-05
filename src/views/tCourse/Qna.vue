<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <div class="container">
        <!-- <div class="filter-button-group">
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'all' }"
            @click="findAll"
            >전체</v-btn
          >
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'admin' }"
            @click="findAdmin"
            >관리자</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'teacher',
            }"
            @click="findTeacher"
            >강사</v-btn
          >
        </div> -->

        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
            <input type="text" class="search-input" placeholder="검색어를 입력해주세요." v-model="stitle" />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchList">검색</button>
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
            <th>답변여부</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in questionList" :key="item.question_no">
              <tr>
                <td>{{ item.question_no }}</td>
                <!--<td @click="questionModifyFile(item.question_no)">-->
                <td>{{ item.name }}</td>
                <td @click="questionModify(item.question_title)">{{ item.question_title }}</td>
                <td>{{ item.question_created_at }}</td>
                <td>
                  <span v-if="item.reply_question">답변 완료</span>
                  <span v-else>답변 대기</span>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">질의응답이 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>

    <!-- 페이지네이션 추가-->

    <div id="questionPagination">
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

    <!--<div class="button-group">
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>-->
    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <TQuestionsAndAnswersModal
            :action="action"
            :question_content="question_content"
            :question_created_at="question_created_at"
            :question_no="question_no"
            :question_title="question_title"
            :loginID="loginID"
            :name="name"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TQuestionsAndAnswersModal from "./TQnaModal.vue";
import Paginate from "vuejs-paginate-next";
import axios from "axios";

export default {
  components: {
    TQuestionsAndAnswersModal,
    Paginate,
  },
  data() {
    return {
      titleText: "질의응답",
      addModal: false,
      action: "",
      selectedQuestion: null,
      activeFilter: "all",
      stitle: "",
      questionList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      course_no: 0,
      question_content: "",
      question_no: 0,
      question_created_at: "",
      question_title: "",
      name: "",
      loginID: "",
    };
  },
  // methods: {
  // findAll() {
  //   this.activeFilter = "all";
  // },
  // findAdmin() {
  //   this.activeFilter = "admin";
  // },
  // findTeacher() {
  //   this.activeFilter = "teacher";
  // },

  mounted() {
    this.searchList();
  },

  methods: {
    searchList: function () {
      // 화살표 함수 대신 일반 함수 사용 , ES6문법을 사용해서 에러..
      //alert('searchlist')

      //let vm = this; //this를 axios안에서 사용할 수 없으므로 별도로 할달을 빼놓았음

      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      axios
        .post("/tCourse/listquestion.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          //   vm.questionList = response.data.listData;
          //  vm.totalCnt = response.data.totalCnt;

          this.questionList = response.data.listdate;
          this.totalCnt = response.data.totalcnt;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    searchMethod() {},
    questionModify(question) {
      this.selectedQuestion = question;
      this.action = "U";
      this.addModal = true;
    },

    openAddModal() {
      this.action = "";
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
    },

    page: function () {
      var total = this.totalCnt;
      var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
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
  height: 50px;
  align-items: center;
  justify-content: flex-end;
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
