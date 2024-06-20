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
            <input type="text" class="search-input" placeholder="검색어를 입력해주세요." v-model="stitle" />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchList">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <div v-if="isLoading" class="loading-container">
        <v-progress-circular :size="50" :width="4" color="primary" indeterminate></v-progress-circular>
      </div>
      <v-table v-else class="dashboard-table">
        <thead>
          <tr>
            <th>글번호</th>
            <th>강의명</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>현황</th>
            <th>결과</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="(item, index) in ClassSurveyList" :key="item.ClassSurvey_no">
              <tr>
                <td>{{ totalCnt - ((currentPage - 1) * pageSize + index) }}</td>
                <td>{{ item.course_name }}</td>
                <td>{{ item.course_start_date }}</td>
                <td>{{ item.course_end_date }}</td>
                <td>({{ item.respondent_count || 0 }} / {{ item.confirmed_count }})</td>
                <td @click="viewSurveyResult(item.course_no)">결과확인</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="6">진행중인 만족도 조사가 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>
    <!-- 페이지네이션 추가-->

    <div id="ClassSurveyPagination">
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

    <v-dialog v-model="viewSurveyResultModal" max-width="600px">
      <v-card>
        <v-card-text>
          <ViewSurveyResultModal :courseNo="selectedCourseNo" @close="viewSurveyResultModal = false" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ViewSurveyResultModal from "../information/TClassSurveyModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    ViewSurveyResultModal,
    Paginate,
  },

  data() {
    return {
      titleText: "수업만족도관리",
      createSurveyModal: false,
      viewSurveyResultModal: false,
      action: "",
      selectedClassSurvey: null,
      selectedCourseNo: null, // 추가된 부분
      activeFilter: "all",
      stitle: "",
      ClassSurveyList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      isLoading: false,
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
      vm.isLoading = true; // 로딩 시작

      let params = new URLSearchParams(); // 파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("loginID", sessionStorage.getItem("loginId"));

      this.axios
        .post("/support/searchClassSurvey.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          vm.ClassSurveyList = response.data.listdata || [];
          vm.totalCnt = response.data.totalcnt || 0;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        })
        .finally(() => {
          vm.isLoading = false; // 로딩 종료
        });
    },

    openAddModal() {
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
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

    page: function () {
      var total = this.totalCnt;
      var page = this.pageSize;
      var result = Math.ceil(total / page);
      return result;
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
}

.search-button:hover,
.insert-button:hover,
.survey-button:hover {
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

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
</style>
