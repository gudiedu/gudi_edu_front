<template>
  <div>
    <v-table class="dashboard-table">
      <thead>
        <tr>
          <th class="text-center">학생 이름</th>
          <th class="text-center">점수</th>
          <th class="text-center">응시 여부</th>
          <th class="text-center">상세정보</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in paginatedResults" :key="result.loginID">
          <td class="text-center">{{ result.name }}</td>
          <td class="text-center">{{ result.result_score }}</td>
          <td class="text-center">
            {{ result.result_no ? "응시" : "미응시" }}
          </td>
          <td class="text-center">
            <button class="result-button" @click="showStudentDetails(result)">
              더보기
            </button>
          </td>
        </tr>
        <tr v-if="paginatedResults.length === 0">
          <td colspan="4" class="text-center">조회된 데이터가 없습니다.</td>
        </tr>
      </tbody>
    </v-table>
    <div class="pagination">
      <paginate
        v-model="currentPage"
        :page-count="pageCount"
        :page-range="3"
        :margin-pages="2"
        :click-handler="handlePageChange"
        :container-class="'pagination-container'"
        :page-class="'pagination-page'"
        :prev-text="'Prev'"
        :next-text="'Next'"
      ></paginate>
    </div>

    <!-- 통계 정보 표시 -->
    <div class="statistics">
      <div>평균 점수: {{ statistics.average_score }}</div>
      <div>최고 점수: {{ statistics.highest_score }}</div>
      <div>응시자 수: {{ statistics.participant_count }}</div>
    </div>

    <!-- 학생 상세 정보 모달 -->
    <v-dialog v-model="showDetails" max-width="700">
      <v-card>
        <v-card-title class="title-box">
          <span class="title-info-box"
            >{{ selectedStudent.name }}의 상세 정보</span
          >
        </v-card-title>
        <v-card-text>
          <div class="modal-content">
            <div class="info-grid">
              <div>
                <strong>강의과목</strong>
                <div class="info-box">{{ lectureName }}</div>
              </div>
              <div>
                <strong>시험명</strong>
                <div class="info-box">{{ testCategory }}</div>
              </div>
              <div>
                <strong>학생 이름</strong>
                <div class="info-box">{{ selectedStudent.name }}</div>
              </div>
              <div>
                <strong>응시 여부</strong>
                <div class="info-box">
                  {{ selectedStudent.result_no ? "응시" : "미응시" }}
                </div>
              </div>
              <div>
                <strong>총 점수</strong>
                <div class="info-box">{{ totalScore }}</div>
              </div>
            </div>
            <div
              v-for="(detail, index) in studentDetails"
              :key="index"
              class="question-detail"
            >
              <div class="question-block">
                <div>
                  <strong>문제명</strong>
                  <div class="question-box">{{ detail.test_question }}</div>
                </div>
              </div>
              <div class="answer-block">
                <div class="answer-item">
                  <strong>보기1</strong>
                  <div class="answer-box">{{ detail.test_choice1 }}</div>
                </div>
                <div class="answer-item">
                  <strong>보기2</strong>
                  <div class="answer-box">{{ detail.test_choice2 }}</div>
                </div>
                <div class="answer-item">
                  <strong>보기3</strong>
                  <div class="answer-box">{{ detail.test_choice3 }}</div>
                </div>
                <div class="answer-item">
                  <strong>보기4</strong>
                  <div class="answer-box">{{ detail.test_choice4 }}</div>
                </div>
                <div class="answer-item">
                  <strong>정답</strong>
                  <div class="answer-box">{{ detail.test_answer }}</div>
                </div>
                <div class="answer-item">
                  <strong>선택한 보기</strong>
                  <div class="answer-box">{{ detail.answer_selected }}</div>
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="card-actions">
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Paginate from "vuejs-paginate-next";

export default {
  props: {
    lectureName: {
      type: String,
      required: true,
    },
    courseNo: {
      type: Number,
      required: true,
    },
  },
  components: { Paginate },
  data() {
    return {
      results: [],
      statistics: {},
      currentPage: 1,
      pageSize: 5,
      showDetails: false,
      selectedStudent: {},
      studentDetails: [],
      testCategory: "",
      totalScore: 0, // 총 점수 저장할 변수
    };
  },
  computed: {
    pageCount() {
      return Math.max(Math.ceil(this.uniqueResults.length / this.pageSize), 1);
    },
    paginatedResults() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.uniqueResults.slice(start, end);
    },
    uniqueResults() {
      const uniqueStudents = [];
      const studentMap = new Map();
      for (const result of this.results) {
        if (!studentMap.has(result.loginID)) {
          studentMap.set(result.loginID, true);
          uniqueStudents.push(result);
        }
      }
      return uniqueStudents;
    },
  },
  watch: {
    courseNo: {
      immediate: true,
      handler(newCourseNo) {
        if (newCourseNo) {
          this.fetchTestResults(newCourseNo);
          this.fetchTestStatistics(newCourseNo);
        }
      },
    },
  },
  methods: {
    fetchTestResults(courseNo) {
      axios
        .post("/tCourse/testResults", { course_no: courseNo })
        .then((response) => {
          this.results = JSON.parse(JSON.stringify(response.data.testResults));
          console.log("시험 응시 결과:", this.results);
        })
        .catch((error) => {
          alert("에러! 시험 응시 결과를 불러오지 못했습니다. " + error);
        });
    },
    fetchTestStatistics(courseNo) {
      axios
        .post("/tCourse/testStatistics", { course_no: courseNo })
        .then((response) => {
          this.statistics = response.data.statistics;
          console.log("통계 정보:", this.statistics);
        })
        .catch((error) => {
          alert("에러! 통계 정보를 불러오지 못했습니다. " + error);
        });
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
    },
    showStudentDetails(student) {
      if (!student.result_no) {
        alert("미응시 학생입니다");
        return;
      }
      this.selectedStudent = student;
      axios
        .post("/tCourse/studentTestDetails", {
          course_no: this.courseNo,
          loginID: student.loginID,
        })
        .then((response) => {
          this.studentDetails = JSON.parse(
            JSON.stringify(response.data.studentTestDetails)
          );
          if (this.studentDetails.length === 0) {
            alert("조회된 데이터가 없습니다.");
          } else {
            this.testCategory = this.studentDetails[0].test_category;
            this.totalScore = this.studentDetails[0].result_score; // 총 점수 설정
            this.showDetails = true;
          }
        })
        .catch((error) => {
          alert("에러! 학생 상세 정보를 불러오지 못했습니다. " + error);
        });
    },
  },
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap-reverse;
}

.pagination-page {
  margin: 0 5px;
}

.statistics {
  margin-top: 20px;
  padding: 10px;
  background-color: #dbf3fc;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-around;
}

.statistics div {
  flex: 1;
  text-align: center;
  font-weight: bold;
  padding: 10px;
  border-right: 1px solid #ddd;
}

.statistics div:last-child {
  border-right: none;
}

.v-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  table-layout: fixed;
}

.v-table th,
.v-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.v-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.v-table tr:hover {
  background-color: #f1f1f1;
}

.result-button {
  margin: 0 auto;
  display: flex;
  width: 70px;
  height: 35px;
  align-items: center;
  background-color: #ffffff;
  color: #407bff;
  border: 1px solid #407bff;
  border-radius: 50px;
  padding: 8px 15px;
  font-size: 13px;
  font-weight: 600;
}

.result-button:hover {
  display: flex;
  width: 70px;
  height: 35px;
  align-items: center;
  background-color: #407bff;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 50px;
  padding: 8px 15px;
  font-size: 13px;
  font-weight: 600;
}

.v-card-text div {
  margin-bottom: 10px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.info-box {
  padding: 10px;
  background-color: #c7dbe9;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: auto;
}

.question-section {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
}

.question-detail {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.question-block {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}

.question-box {
  background-color: #c7dbe9;
  padding: 10px;
  border-radius: 5px;
  overflow: auto;
}

.answer-block {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.answer-item {
  flex: 1 1 calc(50% - 10px);
  /* 각 항목이 50% 너비를 가지며, 간격 조정 */
  margin: 5px;
  /* 항목 사이 간격 */
}

.answer-box {
  padding: 10px;
  background-color: #c7dbe9;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: auto;
  box-sizing: border-box;
  height: 70px;
}

.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #c7dbe9;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.title-info-box {
  padding: 10px;
  background-color: #b6d6d8;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: auto;
  text-align: center;
  /* 내용 가운데 정렬 */
  width: 100%;
  /* 제목 박스가 전체 너비를 차지하도록 설정 */
}
</style>
