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
            <input type="text" class="search-input" placeholder="검색어를 입력해주세요." v-model="stitle"
              @keyup.enter="searchLectures" @input="handleInputChange" />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchLectures">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-progress-circular v-if="loading" indeterminate color="primary" class="mx-auto"></v-progress-circular>

      <v-table v-else class="dashboard-table">
        <thead>
          <tr>
            <th class="text-center">번호</th>
            <th class="text-center">강의명</th>
            <th class="text-center">시작일</th>
            <th class="text-center">종료일</th>
            <th class="text-center">수강인원</th>
            <th class="text-center">시험현황</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(lecture, index) in lectureList" :key="lecture.course_no">
            <td class="text-center">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td class="text-center course-link" @click="showTestResult(lecture.course_name, lecture.course_no)">{{ lecture.course_name }}</td>
            <td class="text-center">{{ lecture.course_start_date }}</td>
            <td class="text-center">{{ lecture.course_end_date }}</td>
            <td class="text-center">{{ lecture.course_quota }}</td>
            <td class="text-center"><button class="result-button" @click="showTestResult(lecture.course_name, lecture.course_no)">결과확인</button></td>
          </tr>
          <tr v-if="lectureList.length === 0">
            <td colspan="6" class="text-center">조회된 데이터가 없습니다.</td>
          </tr>
        </tbody>
      </v-table>

      <div class="pagination">
        <paginate v-model="currentPage" :page-count="Math.max(pageCount, 1)" :page-range="3" :margin-pages="2"
          :click-handler="handlePageChange" :container-class="'pagination-container'" :page-class="'pagination-page'"
          :prev-text="'Prev'" :next-text="'Next'"></paginate>
      </div>
    </v-card>

    <v-card v-if="selectedLecture" class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ selectedLecture.name }} 시험응시결과</div>
        <v-spacer></v-spacer>
      </v-card-title>
      <TScoreResult :lectureName="selectedLecture.name" :courseNo="selectedLecture.no" />
    </v-card>
  </v-container>
</template>

<script>
import TScoreResult from "./TScoreResult.vue";
import axios from "axios";
import Paginate from "vuejs-paginate-next";

export default {
  components: { TScoreResult, Paginate },
  data() {
    return {
      titleText: "성적조회",
      stitle: "",
      lectureList: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
      selectedLecture: null,
      loading: false,
    };
  },
  mounted() {
    this.searchLectures();
  },
  watch: {
    // stitle이 빈 문자열로 변경될 때 searchLectures를 호출합니다.
    stitle(newVal) {
      if (newVal === "") {
        this.searchLectures();
      }
    }
  },
  methods: {
    searchLectures() {
      this.loading = true;
      let params = new URLSearchParams();
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      axios
        .post("/tCourse/courseList", params)
        .then((response) => {
          this.lectureList = response.data.courseList;
          this.totalItems = response.data.totalCnt;
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
      this.searchLectures();
    },
    showTestResult(lectureName, courseNo) {
      this.selectedLecture = { name: lectureName, no: courseNo };
    },
    handleInputChange(event) {
      // 입력 필드의 값이 변경될 때 호출되는 메서드
      if (event.target.value === "") {
        this.searchLectures(); // 검색어가 빈 문자열이면 초기 데이터를 로드합니다.
      }
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.pageSize);
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
.result-button {
  padding: 10px 17px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover,
.result-button:hover {
  background-color: #0056b3;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  table-layout: fixed;
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px;
  text-align: center;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

.course-link {
  cursor: pointer;
}

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
  padding: 8px 12px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
}

.pagination-page:hover {
  background-color: #0056b3;
}

.truncate {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
