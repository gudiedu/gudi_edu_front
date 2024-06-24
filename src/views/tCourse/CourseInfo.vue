<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <div class="titleHeader">
        <v-card-title class="d-flex align-center pe-2">
          <div class="titletext">{{ titleText }}</div>
          <v-spacer></v-spacer>
        </v-card-title>
      </div>

      <v-divider></v-divider>

      <v-card class="dashboard-card">
        <div class="titletext">강의 정보</div>
        <div class="container">
          <div class="filter-button-group">
            <v-btn
              :class="{ 'filter-button': true, active: activeFilter === 'all' }"
              @click="findStatus('all')"
              >전체</v-btn
            >
            <v-btn
              :class="{ 'filter-button': true, active: activeFilter === 'ing' }"
              @click="findStatus('ing')"
              >진행중</v-btn
            >
            <v-btn
              :class="{
                'filter-button': true,
                active: activeFilter === 'complete',
              }"
              @click="findStatus('complete')"
              >진행완료</v-btn
            >
            <v-btn
              :class="{
                'filter-button': true,
                active: activeFilter === 'expect',
              }"
              @click="findStatus('expect')"
              >진행예정</v-btn
            >
          </div>
        </div>
        <v-table class="dashboard-table">
          <colgroup>
            <col width="*%" />
            <col width="9%" />
            <col width="10%" />
            <col width="14%" />
            <col width="14%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
            <col width="9%" />
          </colgroup>
          <thead>
            <tr>
              <th>강의명</th>
              <th>과목명</th>
              <th>강의실</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>현재인원</th>
              <th>수강정원</th>
              <th>수강현황</th>
              <th>학생조회</th>
            </tr>
          </thead>
          <tbody>
            <template v-if="totalCnt > 0">
              <template v-for="item in courseList" :key="item.course_no">
                <tr>
                  <td>{{ item.course_name }}</td>
                  <td>{{ item.course_subject }}</td>
                  <td>{{ item.course_loc }}</td>
                  <td>{{ item.course_start_date }}</td>
                  <td>{{ item.course_end_date }}</td>
                  <td>{{ item.countstudent }}명</td>
                  <td>{{ item.course_quota }}명</td>
                  <td>
                    {{
                      getCourseStatus(
                        item.course_start_date,
                        item.course_end_date
                      )
                    }}
                  </td>
                  <td
                    @click="
                      showAttendance(
                        item.course_no,
                        item.course_start_date,
                        item.course_end_date
                      )
                    "
                    class="showAttendance"
                  >
                    <span class="list-button">명단조회</span>
                  </td>
                </tr>
              </template>
            </template>
            <template v-else>
              <tr>
                <td colspan="9" style="text-align: center">
                  조회된 데이터가 없습니다.
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>

      <div id="noticePagination">
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

      <v-card v-if="attendance" class="dashboard-card">
        <div class="titletext">수강생 명단</div>
        <Attendance
          :courseNo="courseNo"
          :stateMsg="stateMsg"
          @execute-search-list="searchList"
        />
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import Attendance from "./TStudentApprovalAttendance.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: { Attendance, Paginate },
  data() {
    return {
      titleText: "강의 수강생 정보",
      totalCnt: 0,
      pageSize: 5,
      currentPage: 1,
      courseList: [],
      courseNo: "",
      status: "",
      activeFilter: "all",
      stateMsg: "",

      attendance: false,
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    searchList: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);
      params.append("status", this.status);

      this.axios
        .post("/tCourse/listCourseInfo", params)
        .then((response) => {
          // console.log(JSON.stringify(response))

          vm.courseList = response.data.listdata;
          vm.totalCnt = response.data.totalcnt;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    findStatus(param) {
      if (param === "all") {
        this.activeFilter = param;
        this.currentPage = 1;
        this.status = "";
      } else if (param === "ing") {
        this.activeFilter = param;
        this.currentPage = 1;
        this.status = param;
      } else if (param === "complete") {
        this.activeFilter = param;
        this.currentPage = 1;
        this.status = param;
      } else if (param === "expect") {
        this.activeFilter = param;
        this.currentPage = 1;
        this.status = param;
      }

      this.searchList();
    },

    getCourseStatus(startdate, enddate) {
      const currentDate = new Date();
      const start = new Date(startdate);
      const end = new Date(enddate);

      if (currentDate < start) {
        return "진행예정";
      } else if (currentDate >= start && currentDate <= end) {
        return "진행중";
      } else if (currentDate > end) {
        return "진행완료";
      }
    },
    showAttendance(course_no, st_date, end_date) {
      if (this.courseNo !== course_no) {
        this.courseNo = course_no;

        this.stateMsg = this.getCourseStatus(st_date, end_date);

        this.attendance = false;
        this.$nextTick(() => {
          this.attendance = true;
        });
      }
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
.showAttendance {
  cursor: pointer;
}
.textarea {
  margin-top: 20px;
}

.titleHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

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
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
  padding: 0px;
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
.goBack-button,
.registration-button {
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
.goBack-button:hover,
.registration-button:hover {
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
  font-size: 14px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

.list-button {
  display: flex;
  width: 60px;
  height: 35px;
  align-items: center;
  background-color: #ffffff;
  color: #407bff;
  border: 1px solid #407bff;
  border-radius: 10px;
  padding: 0px 5px;
  font-size: 12px;
  font-weight: 600;
}

.list-button:hover {
  display: flex;
  width: 60px;
  height: 35px;
  align-items: center;
  background-color: #407bff;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 0px 5px;
  font-size: 12px;
  font-weight: 600;
}
</style>
