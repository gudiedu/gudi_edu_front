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
            @click="findStatus('all')"
            >전체</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'completed',
            }"
            @click="findStatus('completed')"
            >완료</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'incompleted',
            }"
            @click="findStatus('incompleted')"
            >미완료</v-btn
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
              @keydown.enter="handleSearch"
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
            <!-- <th>과목명</th>  -->
            <th>강의명</th>
            <th>강사명</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>만족도</th>
            <th>출결</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in sCourseList" :key="item.course_no">
              <tr>
                <!-- <td @click="courseDetailed(item.course_no)">
                  {{ item.course_subject }}
                </td> -->
                <td @click="courseDetailed(item.course_no)">
                  {{ item.course_name }}
                </td>
                <td @click="courseDetailed(item.course_no)">
                  {{ item.teacher_name }}
                </td>
                <td @click="courseDetailed(item.course_no)">
                  {{ item.course_start_date }}
                </td>
                <td @click="courseDetailed(item.course_no)">
                  {{ item.course_end_date }}
                </td>
                <td>
                  <span v-if="isAfterEndDate(item.course_end_date)">
                    <span
                      v-if="
                        isSurveyOpen(item.course_end_date) &&
                        item.survey_completed === 'Y'
                      "
                      class="survey-button"
                      >완료</span
                    >
                    <span
                      v-else-if="
                        isSurveyOpen(item.course_end_date) &&
                        item.survey_completed === 'N'
                      "
                      @click="classSatisfaction(item.course_no)"
                      class="survey-button"
                      >미완료</span
                    >
                    <span v-else class="survey-button">종료</span>
                  </span>
                  <span
                    v-else-if="isBeforeStartDate(item.course_start_date)"
                    class="survey-button"
                    >진행예정</span
                  >
                  <span v-else class="survey-button">진행중</span>
                </td>
                <td @click="attendance(item.course_no)">
                  <span class="attendance-button">출결</span>
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="10" style="text-align: center">
                조회된 데이터가 없습니다.
              </td>
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
        :click-handler="courseList"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      ></paginate>
    </div>

    <v-dialog v-model="attendanceModal" max-width="800px">
      <v-card>
        <v-card-text>
          <AttendanceModal
            :courseNo="courseNo"
            @close-modal="closeAttendanceModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
import AttendanceModal from "./SAttendanceModal.vue";
import Paginate from "vuejs-paginate-next";
export default {
  components: { AttendanceModal, Paginate },
  data() {
    return {
      titleText: "강의관리",
      courseNo: 0,
      activeFilter: "all",
      stitle: "",
      status: "",
      sCourseList: [],
      attendanceModal: false,
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
    };
  },
  mounted() {
    this.courseList();
  },
  methods: {
    courseDetailed(courseNo) {
      this.$router.push({
        name: "sCourseDetail",
        params: { courseNo },
      });
    },

    classSatisfaction(courseNo) {
      this.$router.push({
        name: "sCourseSatisfaction",
        params: { courseNo },
      });
    },

    attendance(courseNo) {
      this.courseNo = courseNo;
      this.attendanceModal = true;
    },

    closeAttendanceModal() {
      this.attendanceModal = false;
      this.courseList();
    },

    handleSearch() {
      this.currentPage = 1; // 검색 시 페이지를 1페이지로 리셋
      this.courseList(); // 검색 실행
    },

    courseList() {
      let vm = this;

      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("pCourseNo", this.pCourseNo);
      params.append("stitle", this.stitle);
      params.append("status", this.status);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/classroom/sStudentCourseList.do", params)
        .then((response) => {
          vm.sCourseList = response.data.sStudentCourseInfo;
          vm.totalCnt = response.data.totalCnt;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    isAfterEndDate(courseEndDate) {
      // 현재 날짜와 비교하여 강좌 종료일이 이미 지났는지 확인
      return new Date() > new Date(courseEndDate);
    },

    isBeforeStartDate(courseStartDate) {
      // 현재 날짜와 비교하여 강좌 시작일이 후이면 진행예정
      return new Date() < new Date(courseStartDate);
    },

    isSurveyOpen(courseEndDate) {
      // 현재 날짜와 종료일을 비교하여 종료일로부터 3일 이내인지 확인
      const endDate = new Date(courseEndDate);
      const currentDate = new Date();
      const diffTime = currentDate - endDate;
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays >= 0 && diffDays <= 3;
    },

    findStatus(param) {
      if (param === "all") {
        this.activeFilter = param;
        this.status = "";
      } else if (param === "completed") {
        this.activeFilter = param;
        this.status = param;
      } else if (param === "incompleted") {
        this.activeFilter = param;
        this.status = param;
      }

      this.courseList();
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
      // var result = Math.ceil(this.totalCnt / this.pageSize);
      // return result;
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
  /* Ensure table expands to fit card */
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

.attendance-button {
  display: flex;
  width: 50px;
  height: 35px;
  align-items: center;
  background-color: #ffffff;
  color: #407bff;
  border: 1px solid #407bff;
  border-radius: 15px;
  padding: 0px 11px;
  font-size: 13px;
  font-weight: 600;
}

.attendance-button:hover {
  display: flex;
  width: 50px;
  height: 35px;
  align-items: center;
  background-color: #407bff;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 15px;
  padding: 0px 11px;
  font-size: 13px;
  font-weight: 600;
}

.survey-button {
  display: flex;
  width: 55px;
  height: 35px;
  align-items: center;
  background-color: ffffff;
  color: #172a54;
  border-radius: 5px;
  padding: 0px 8px;
  font-size: 16px;
  font-weight: 600;
}
</style>
