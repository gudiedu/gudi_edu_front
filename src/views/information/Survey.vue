<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

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
            <th>강의명</th>
            <th>강사명</th>
            <th class="space-cell">수강인원</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>현황</th>
            <th>설문코드</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="courseList.length === 0">
            <td colspan="9" class="no-results">검색 결과가 없습니다.</td>
          </tr>

          <tr v-for="(item, index) in courseList" :key="item.course_no">
            <td>{{ item.course_no }}</td>
            <!-- <td>{{ totalCnt - ((currentPage - 1) * pageSize + index) }}</td> -->
            <td hidden>{{ item.course_no }}</td>
            <td class="space-cell">{{ item.course_name }}</td>
            <td>{{ item.user_name }}</td>
            <td>{{ item.course_quota }}명</td>
            <td>{{ item.course_start_date }}</td>
            <td>{{ item.course_end_date }}</td>
            <td>{{ item.respondent_count || 0 }} / {{ item.confirmed_count }}</td>
            <td>
              <span v-if="!item.survey_no" class="survey-create" @click="createSurvey(item)">설문생성</span>
              <span v-else>{{ item.survey_no }}</span>
            </td>
            <td @click="viewSurveyResult(item.course_no)">결과확인</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- 페이지네이션 추가-->
    <div id="Pagination">
      <paginate
        class="justify-content-center"
        v-model="currentPage" 
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="getCourseList"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'">
      </paginate>
     </div>

    <div class="button-group">
      <button class="survey-button" @click="surveyManagement">
        설문조사문항관리
      </button>
    </div>

    <v-dialog v-model="createSurveyModal" max-width="600px">
      <v-card>
        <v-card-text>
          <CreateSurvey 
          :action="action" 
          :course_no="course_no"
          :course_name="course_name"
          @close="closeAddModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="viewSurveyResultModal" max-width="600px">
      <v-card>
        <v-card-text>
          <viewSurveyResultModal :courseNo="selectedCourseNo" @close="viewSurveyResultModal = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import Paginate from "vuejs-paginate-next";
import CreateSurvey from "./ACreateSurveyModal.vue";

import viewSurveyResultModal from "./TClassSurveyModal.vue";

export default {
  components: { 
    CreateSurvey,
    viewSurveyResultModal,
    Paginate,
    },
  data() {
    return {
      titleText: "수업만족도관리",
      createSurveyModal: false,
      viewSurveyResultModal: false,
      selectedCourseNo: null, // 추가된 부분
      addModal: false,
      action: "",
      selectedNotice: null,
      activeFilter: "all",
      courseList: [],
      stitle: "",
      currentPage: 1,
      totalCnt: 0,
      pageSize: 10,
    };
  },
  mounted() {
    // 페이지 로드될 때 강의 코드 목록을 가져오는 메서드 호출
    this.getCourseList();
    this.page();
  },

  methods: {
    handlePageClick(pageNumber) {
      this.getCourseList();
      this.currentPage = pageNumber;
  },

    viewSurveyResult(courseNo) {
      console.log("Selected course_no: ", courseNo); // 디버깅 로그 추가
      if (courseNo !== null && courseNo !== undefined && courseNo !== "null") {
        this.selectedCourseNo = String(courseNo); // 문자열로 변환
        this.viewSurveyResultModal = true;
      } else {
        console.error("Invalid course_no:", courseNo); // course_no가 잘못된 경우 로그 출력
      }
    },
    getCourseList() {
      let vm = this;
      let params = new URLSearchParams(); // 파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

  axios.post('/course/searchClassSurvey.do',params)
    .then(response => {
      vm.courseList = response.data.listdate; // 데이터 바인딩
      vm.totalCnt = response.data.totalCnt;

      console.log('Course list response:', response.data); // 전체 응답 데이터 콘솔 출력
      console.log('Course list:', this.courseList); // 바인딩된 데이터 콘솔 출력
    })
    .catch(error => {
      console.error('Error fetching course list:', error);
     });
    },

    // searchMethod() {
    //   console.log(this.stitle);
    //   axios.get('/course/courseSearch.do', {
    //       params: {
    //         word: this.stitle
    //       }
    //     })
    // .then(response => {
    //   console.log('Course list response:', response.data); // 전체 응답 데이터 콘솔 출력
    //   this.courseList = response.data.listdate; // 데이터 바인딩
    //   this.filterCourses();
    //   console.log('Course list:', this.courseList); // 바인딩된 데이터 콘솔 출력
    // })
    // .catch(error => {
    //   console.error('Error fetching course list:', error);
    // });
    // },
    noticeModify(notice) {
      this.selectedNotice = notice;
      this.action = "U";
      this.addModal = true;
    },
    openAddModal() {
      this.action = "";
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
      this.createSurveyModal =false;
      this.getCourseList();
    },
    createSurvey(course) {
      this.course_no = course.course_no;
      this.course_name = course.course_name;
      this.createSurveyModal = true;

    },
    page: function () {
      var total = this.totalCnt;
      var page = this.pageSize;
      var remaining = total % page;
      var result = parseInt(total / page);

      if (remaining == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    handleSearch() {
      this.currentPage = 1; // 검색 시 페이지를 1페이지로 리셋
      this.getCourseList(); // 검색 실행
    },
   
    surveyManagement() {
      this.$router.push({
        name: "aSurveyManagement",
        params: {},
      });
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
.insert-button,
.survey-button {
  padding: 10px 17px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, text-decoration 0.3s;
}
.survey-create:hover{
  text-decoration: underline;
  color: blue;
}


.search-button:hover,
.insert-button:hover,
.survey-button:hover {
  background-color: #0056b3;
  text-decoration: underline;
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
  white-space: nowrap;
}
.course-name-cell {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}
.space-cell {
  white-space: normal !important;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
