<template>
  <div>
    <v-container fluid>
      <!-- 전체 컨테이너 설정 -->
      <v-card class="dashboard-card">
        <!-- 페이지를 담는 카드 설정 -->
        <!-- 페이지 제목 -->
        <v-card-title class="d-flex align-center pe-2">
          <!-- 제목을 표시하는 영역 설정 -->
          <div class="titletext">{{ titleText }}</div>
          <!-- 제목 텍스트 -->
          <v-spacer></v-spacer>
          <!-- 공간을 채워주는 역할 -->
        </v-card-title>

        <!-- 검색 영역 -->
        <div class="container">
          <!-- 검색 영역을 담는 컨테이너 -->
          <div class="search">
            <div class="search-container">
              <v-icon class="search-icon">mdi-magnify</v-icon>
              <!-- 검색 아이콘 -->
              <input type="text" class="search-input" placeholder="검색어를 입력해주세요." v-model="stitle"
                @keyup.enter="searchLectures" @input="handleInputChange" />
              <!-- 검색 입력창, 엔터 시 검색 실행 -->
            </div>
            <div class="button-group">
              <button class="search-button" @click="searchLectures">검색</button>
              <!-- 검색 버튼, 클릭 시 검색 실행 -->
            </div>
          </div>
        </div>

        <v-divider></v-divider>
        <!-- 구분선 -->

        <!-- 로딩 중일 때 표시되는 로딩 애니메이션 -->
        <v-progress-circular v-if="loading" indeterminate color="primary" class="mx-auto"></v-progress-circular>

        <!-- 로딩이 끝나면 표시되는 강의 목록 테이블 -->
        <v-table v-else class="dashboard-table">
          <thead>
            <tr>
              <th class="text-center">번호</th>
              <th class="text-center">강의명</th>
              <th class="text-center">문제등록</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lecture, index) in lectureList" :key="lecture.course_no">
              <!-- 강의 목록 반복 렌더링 -->
              <td class="text-center">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
              <!-- 강의 목록 번호 계산 -->
              <td class="text-center course-link" @click="fetchExamQuestions(lecture.course_no)">{{ lecture.course_name
                }}</td>
              <!-- 강의명, 클릭 시 해당 강의의 시험 문제 조회 -->
              <td class="text-center"><button class="insert-button"
                  @click="openAddModal(lecture.course_no, lecture.course_name, lecture.course_subject)">등록</button></td>
              <!-- 등록 버튼, 클릭 시 시험 등록 모달 열기 -->
            </tr>
            <tr v-if="lectureList.length === 0">
              <!-- 강의 목록이 없을 때 표시 -->
              <td colspan="3" class="text-center">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </v-table>

        <!-- 강의 목록 페이징 버튼 -->
        <div class="pagination">
          <paginate v-model="currentPage" :page-count="Math.max(pageCount, 1)" :page-range="3" :margin-pages="2"
            :click-handler="handlePageChange" :container-class="'pagination-container'" :page-class="'pagination-page'"
            :prev-text="'Prev'" :next-text="'Next'"></paginate>
          <!-- 페이징 컴포넌트 설정 -->
        </div>
      </v-card>

      <!-- 시험 목록을 강의명을 클릭했을 때만 표시하도록 수정 -->
      <v-card v-if="selectedCourseNo" class="dashboard-card">
        <v-card-title class="d-flex align-center pe-2">
          <div class="titletext">시험 목록</div>
          <!-- 문제 목록 제목 -->
          <v-spacer></v-spacer>
        </v-card-title>

        <v-progress-circular v-if="loadingQuestions" indeterminate color="primary"
          class="mx-auto"></v-progress-circular>
        <!-- 문제 목록 로딩 애니메이션 -->

        <v-table v-else class="dashboard-table">
          <!-- 문제 목록 테이블 -->
          <thead>
            <tr>
              <th class="text-center">시험명</th>
              <th class="text-center">문제수</th>
              <th class="text-center">수정</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in questionCategories" :key="index">
              <!-- 문제 목록 반복 렌더링 -->
              <td class="text-center">{{ category.test_category }}</td>
              <td class="text-center">{{ category.question_count }}</td>
              <td class="text-center">
                <button class="insert-button" @click="editCategory(category.test_category)">수정</button>
                <!-- 수정 버튼, 클릭 시 문제 수정 모달 열기 -->
              </td>
            </tr>
            <tr v-if="questionCategories.length === 0">
              <!-- 문제 목록이 없을 때 표시 -->
              <td colspan="3" class="text-center">조회된 데이터가 없습니다.</td>
            </tr>
          </tbody>
        </v-table>

        <!-- 문제 목록 페이징 버튼 -->
        <div class="pagination">
          <paginate v-model="currentQuestionPage" :page-count="Math.max(questionPageCount, 1)" :page-range="3"
            :margin-pages="2" :click-handler="handleQuestionPageChange" :container-class="'pagination-container'"
            :page-class="'pagination-page'" :prev-text="'Prev'" :next-text="'Next'"></paginate>
          <!-- 페이징 컴포넌트 설정 -->
        </div>
      </v-card>

      <v-dialog v-model="addModal" @click:outside="closeAddModal">
        <!-- 모달 다이얼로그 -->
        <v-card>
      <v-card-text>
        <TTestModal
          :action="action"
          :courseNo="selectedCourseNo"
          :courseName="selectedCourseName"
          :courseSubject="selectedCourseSubject"
          :question="currentQuestion"
          @saveExam="handleSaveExam"
          @updateExam="handleUpdateExam"
          @deleteExam="handleDeleteExam"
          @close="closeAddModal"
        />
      </v-card-text>
    </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import TTestModal from "./TTestModal.vue";
import axios from "axios";
import Paginate from "vuejs-paginate-next";

export default {
  components: { TTestModal, Paginate },
  data() {
    return {
      titleText: "시험 관리",
      addModal: false,
      action: "",
      stitle: "",
      lectureList: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
      selectedCourseNo: null,
      selectedCourseName: "",
      selectedCourseSubject: "",
      questionCategories: [],
      currentQuestionPage: 1,
      questionPageSize: 5,
      totalQuestionItems: 0,
      loading: false,
      loadingQuestions: false,
      currentQuestion: null,
    };
  },
  mounted() {
    this.searchLectures();
  },
  watch: {
    stitle(newVal) {
      if (newVal === "") {
        this.searchLectures();
      }
    },
  },
  methods: {
    searchLectures() {
      this.loading = true;
      this.questionCategories = [];
      this.totalQuestionItems = 0;
      this.currentQuestionPage = 1;
      let params = new URLSearchParams();
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      axios
        .post("/tCourse/examlist", params)
        .then((response) => {
          this.lectureList = response.data.examList;
          this.totalItems = response.data.totalCnt;
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    openAddModal(courseNo, courseName, courseSubject) {
      this.action = "C";
      this.selectedCourseNo = courseNo;
      this.selectedCourseName = courseName;
      this.selectedCourseSubject = courseSubject;
      this.currentQuestion = null;
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
    },
    fetchExamQuestions(course_no) {
      this.loadingQuestions = true;
      this.selectedCourseNo = course_no;
      this.selectedCourseName = this.lectureList.find(lecture => lecture.course_no === course_no).course_name;
      this.selectedCourseSubject = this.lectureList.find(lecture => lecture.course_no === course_no).course_subject;

      const params = new URLSearchParams();
      params.append('course_no', course_no);

      axios.get('/tCourse/getExamQuestions?' + params.toString())
        .then((response) => {
          if (response.data.success) {
            this.questionCategories = response.data.questionCategories;
          } else {
            alert("에러! " + response.data.message);
          }
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        })
        .finally(() => {
          this.loadingQuestions = false;
        });
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
      this.searchLectures();
    },
    handleQuestionPageChange(pageNum) {
      this.currentQuestionPage = pageNum;
      this.fetchExamQuestions(this.selectedCourseNo);
    },
    handleSaveExam(formData) {
      axios
        .post('/tCourse/registerExam', {
          courseNo: this.selectedCourseNo,
          testCategory: formData.testCategory,
          questions: formData.questions
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.success) {
            alert("시험이 성공적으로 등록되었습니다.");
            this.addModal = false;
            this.fetchExamQuestions(this.selectedCourseNo);
            this.searchLectures();
          } else {
            alert("에러! " + response.data.message);
          }
        })
        .catch((error) => {
          alert("에러! 시험 등록에 실패했습니다. " + error);
        });
    },
    handleUpdateExam(formData) {
      axios
        .post('/tCourse/updateExam', {
          courseNo: this.selectedCourseNo,
          testCategory: formData.testCategory,
          questions: formData.questions
        }, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.success) {
            alert("시험이 성공적으로 수정되었습니다.");
            this.addModal = false;
            this.fetchExamQuestions(this.selectedCourseNo);
            this.searchLectures();
          } else {
            alert("에러! " + response.data.message);
          }
        })
        .catch((error) => {
          alert("에러! 시험 수정에 실패했습니다. " + error);
        });
    },
    handleDeleteExam(data) {
    axios
      .post('/tCourse/deleteExam', data, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        if (response.data.success) {
          alert('시험이 성공적으로 삭제되었습니다.');
          this.fetchExamQuestions(this.selectedCourseNo);
          this.searchLectures();
          this.addModal = false;
        } else {
          alert("에러! " + response.data.message);
        }
      })
      .catch((error) => {
        alert('에러! 시험 삭제에 실패했습니다. ' + error);
      });
    },
    editCategory(testCategory) {
      this.action = "U";
      this.testCategory = testCategory;
      axios.post('/tCourse/getExamFixCategory', {
        course_no: this.selectedCourseNo,
        test_category: testCategory
      })
        .then(response => {
          if (response.data.success) {
            this.currentQuestion = response.data.questionList;
            this.addModal = true;
          } else {
            alert("에러! " + response.data.message);
          }
        })
        .catch(error => {
          alert("에러! 시험 문제를 가져오는 데 실패했습니다. " + error);
        });
    },
    deleteQuestion() {
      if (confirm('정말로 이 시험을 삭제하시겠습니까?')) {
        axios
          .post('/tCourse/deleteExam', {
            course_no: this.selectedCourseNo,
            test_category: this.testCategory
          }, {
            headers: {
              "Content-Type": "application/json"
            }
          })
          .then((response) => {
            if (response.data.success) {
              alert('시험이 성공적으로 삭제되었습니다.');
              this.fetchExamQuestions(this.selectedCourseNo);
              this.addModal = false;
            } else {
              alert("에러! " + response.data.message);
            }
          })
          .catch((error) => {
            alert('에러! 시험 삭제에 실패했습니다. ' + error);
          });
      }
    },
    handleInputChange(event) {
      if (event.target.value === "") {
        this.searchLectures();
      }
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.pageSize);
    },
    questionPageCount() {
      return Math.ceil(this.totalQuestionItems / this.questionPageSize);
    },
  },
};
</script>



<style scoped>
.dashboard-card {
  margin: 20px;
  /* 카드의 외부 여백 설정 */
  padding: 20px;
  /* 카드의 내부 여백 설정 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  /* 그림자 설정 */
  border-radius: 8px;
  /* 테두리 둥글게 설정 */
  background-color: #fff;
  /* 배경색 설정 */
}

.titletext {
  font-size: 24px;
  /* 폰트 크기 설정 */
  font-weight: bold;
  /* 폰트 굵기 설정 */
}

.container {
  display: flex;
  /* Flexbox 레이아웃 사용 */
  justify-content: flex-end;
  /* 오른쪽 정렬 */
  height: 50px;
  /* 높이 설정 */
  align-items: center;
  /* 수직 중앙 정렬 */
}

.search {
  display: flex;
  /* Flexbox 레이아웃 사용 */
  justify-content: flex-end;
  /* 오른쪽 정렬 */
}

.search-input {
  flex-grow: 1;
  /* Flexbox 요소의 성장 설정 */
  padding: 8px;
  /* 내부 여백 설정 */
  border: none;
  /* 테두리 제거 */
  outline: none;
  /* 포커스 아웃라인 제거 */
  font-size: 16px;
  /* 폰트 크기 설정 */
}

.button-group {
  text-align: right;
  /* 오른쪽 정렬 */
  padding: 16px;
  /* 내부 여백 설정 */
}

.search-button,
.insert-button {
  padding: 10px 17px;
  /* 내부 여백 설정 */
  background-color: #007bff;
  /* 배경색 설정 */
  color: white;
  /* 폰트 색상 설정 */
  border: none;
  /* 테두리 제거 */
  border-radius: 4px;
  /* 테두리 둥글게 설정 */
  cursor: pointer;
  /* 커서 모양 설정 */
  font-size: 16px;
  /* 폰트 크기 설정 */
}

.search-button:hover,
.insert-button:hover {
  background-color: #0056b3;
  /* 호버 시 배경색 변경 */
}

.dashboard-table {
  width: 100%;
  /* 테이블 너비 설정 */
  border-collapse: collapse;
  /* 테두리 겹침 제거 */
  margin: 16px 0;
  /* 외부 여백 설정 */
  table-layout: fixed;
  /* 테이블 레이아웃 고정 */
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px;
  /* 내부 여백 설정 */
  text-align: center;
  /* 텍스트 가운데 정렬 */
  border-bottom: 1px solid #ddd;
  /* 하단 테두리 설정 */
  font-size: 16px;
  /* 폰트 크기 설정 */
  white-space: nowrap;
  /* 긴 텍스트 줄 바꿈 방지 */
  overflow: hidden;
  /* 넘치는 내용 숨김 */
  text-overflow: ellipsis;
  /* 넘치는 내용 줄임표(...) */
  max-width: 150px;
  /* 최대 너비 설정 */
}

.dashboard-table th {
  background-color: #f4f4f4;
  /* 배경색 설정 */
  font-weight: bold;
  /* 폰트 굵기 설정 */
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
  /* 행 호버 시 배경색 변경 */
}

.course-link {
  cursor: pointer;
  /* 커서 모양 설정 */
}

.pagination-container {
  display: flex;
  /* Flexbox 레이아웃 사용 */
  justify-content: center;
  /* 가운데 정렬 */
  margin-top: 20px;
  /* 상단 여백 설정 */
}

.pagination-page {
  margin: 0 5px;
  /* 좌우 여백 설정 */
  padding: 8px 12px;
  /* 내부 여백 설정 */
  cursor: pointer;
  /* 커서 모양 설정 */
  background-color: #007bff;
  /* 배경색 설정 */
  color: white;
  /* 폰트 색상 설정 */
  border-radius: 10px;
  /* 테두리 둥글게 설정 */
}

.pagination-page:hover {
  background-color: #0056b3;
  /* 호버 시 배경색 변경 */
}

.truncate {
  max-width: 100px;
  /* 원하는 너비로 조정 */
  white-space: nowrap;
  /* 긴 텍스트를 줄임표시로 */
  overflow: hidden;
  /* 넘치는 내용 숨김 */
  text-overflow: ellipsis;
  /* 넘치는 내용 줄임표(...) */
}

/* 모달 창 높이와 관련된 스타일 */
.v-dialog__content {
  max-height: 200vh;
  /* 최대 높이를 뷰포트 높이의 80%로 설정 */
  height: auto;
  /* 내용에 따라 자동으로 높이 조정 */
}

.v-dialog__content .v-card {
  height: auto;
  /* 모달 높이를 auto로 설정 */
}

.v-dialog {
  max-width: 1000px;
  /* 최대 너비를 800px로 설정 */
}
</style>
