<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <div>설문코드 : {{ survey_no }}</div>
      <div>설문조사명 : {{ survey_name }}</div>

      <div class="container">
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
            <button class="search-button" @click="handleSearch">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>상세질문번호</th>
            <th>질문내용</th>
            <th>질문선택지</th>
            <th>질문유형</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="questionList.length === 0">
            <td colspan="5" class="no-data">결과가 없습니다.</td>
          </tr>
          <tr
            v-for="(item, index) in questionList"
            :key="item.survey_question_no"
          >
            <td>{{ index + 1 }}</td>
            <td>{{ item.survey_question_no }}</td>
            <td @click="qusetionModify(item)">
              {{ item.survey_question_text }}
            </td>
            <td>{{ item.question_choiced }}</td>
            <td>{{ getQuestionType(item.survey_question_type) }}</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <div class="button-group">
      <button class="insert-button" @click="openAddModal">질문추가</button>
    </div>
    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <ASurveyManagementModal
            :survey_question_text="survey_question_text"
            :survey_question_no="survey_question_no"
            :question_choiced="question_choiced"
            :survey_question_type="survey_question_type"
            :survey_no="survey_no"
            :action="action"
            @close="closeAddModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import ASurveyManagementModal from "./ASurveyQuestionModal.vue";
export default {
  components: { ASurveyManagementModal },
  props: {
    survey_no: Number,
    survey_name: String,
  },
  data() {
    return {
      titleText: "질문관리",
      addModal: false,
      action: "",
      activeFilter: "all",
      stitle: "",
      questionList: [], //설문지 리스트 목록 저장할 배열
      selectedNotice: null,
      survey_question_no: "",
      survey_question_text: "",
    };
  },
  created() {
    console.log("Received survey_no:", this.survey_no);
    console.log("Received survey_name:", this.survey_name);
    // survey_no을 이용한 추가적인 로직
  },

  mounted() {
    this.getQuestionList();
  },

  methods: {
    qusetionModify(question) {
      this.selectedNotice = question;
      this.survey_question_no = question.survey_question_no;
      this.survey_question_text = question.survey_question_text;
      this.question_choiced = question.question_choiced;
      this.survey_question_type = question.survey_question_type;
      this.action = "U";
      this.addModal = true;
    },
    getQuestionList() {
      let surveyParams = new URLSearchParams();
      surveyParams.append("survey_no", this.survey_no);
      surveyParams.append("stitle", this.stitle);
      console.log(this.survey_no);
      console.log(this.survey_name);

      axios
        .post("/survey/QuestionList.do", surveyParams)
        .then((response) => {
          console.log("QuestionList response:", response.data); // 전체 응답 데이터 콘솔 출력
          this.questionList = response.data.listdate; // 데이터 바인딩
          console.log("QuestionList:", this.questionList); // 바인딩된 데이터 콘솔 출력
        })
        .catch((error) => {
          console.error("Error fetching QuestionList:", error);
        });
    },
    handleSearch() {
      this.currentPage = 1; // 검색 시 페이지를 1페이지로 리셋
      this.getQuestionList(); // 검색 실행
    },

    getQuestionType(questionType) {
      return questionType === "written" ? "서술형" : "선택형";
    },

    findAll() {
      this.activeFilter = "all";
    },
    findAdmin() {
      this.activeFilter = "admin";
    },
    findTeacher() {
      this.activeFilter = "teacher";
    },
    searchMethod() {},

    openAddModal() {
      this.selectedNotice = "";
      // questionList에서 최대 survey_question_no를 찾아 +1
      const maxQuestionNo = this.questionList.reduce((max, item) => {
        return item.survey_question_no > max ? item.survey_question_no : max;
      }, 0);
      this.survey_question_no = maxQuestionNo + 1;
      this.survey_question_text = "";
      this.action = "";
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
      this.getQuestionList();
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
  cursor: pointer;
}

.titletext {
  font-size: 24px;
  font-weight: bold;
}

.container {
  display: flex;
  justify-content: flex-end;
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
  text-align: center;
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

.no-data {
  text-align: center; /* 가운데 정렬 */
  font-weight: bold;
  font-size: 16px;
}
</style>
