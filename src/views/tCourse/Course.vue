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
            <button class="search-button" @click="searchList">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <colgroup>
          <col width="8%" />
          <col width="*" />
          <col width="11%" />
          <col width="11%" />
          <col width="11%" />
          <col width="13%" />
          <col width="13%" />
          <col width="9%" />
          <col width="11%" />
        </colgroup>
        <thead>
          <tr>
            <th>글번호</th>
            <th>강의명</th>
            <th>강의과목</th>
            <th>수강정원</th>
            <th>수강기간</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>강의실</th>
            <th>현황</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="(item, index) in courseList" :key="item.course_no">
              <tr>
                <td>{{ index + 1 + (currentPage - 1) * pageSize }}</td>
                <td @click="getLectureDetail(item.course_no)">
                  {{ item.course_name }}
                </td>
                <td>{{ item.course_subject }}</td>
                <td>{{ item.course_quota }}명</td>
                <td>{{ item.duration }}일</td>
                <td>{{ item.course_start_date }}</td>
                <td>{{ item.course_end_date }}</td>
                <td>{{ item.course_loc }}</td>
                <td>
                  {{
                    getCourseStatus(
                      item.course_start_date,
                      item.course_end_date
                    )
                  }}
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="9">조회된 데이터가 없습니다.</td>
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

    <!-- 페이지네이션 추가-->

    <div class="button-group">
      <button class="insert-button" @click="openAddModal">강의등록</button>
    </div>
    <!-- <v-dialog v-model="addModal" max-width="700px">
      <v-card>
        <v-card-text>
          <LectureManagementModal :action="action" />
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </v-container>
</template>

<script>
import LectureManagementModal from "./TCourseModal.vue";
import Paginate from "vuejs-paginate-next";
import { openModal } from "jenesius-vue-modal";

export default {
  components: { Paginate },
  data() {
    return {
      titleText: "강의목록",
      addModal: false,
      action: "",
      activeFilter: "all",
      stitle: "",
      status: "",
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      courseList: [],
      opoupreturn: "",
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    searchList: function () {
      let vm = this; //this를 axios안에서 사용할 수 없으므로 별도로 할달을 빼놓았음

      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("status", this.status);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/tCourse/listCourse", params)
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
    openPopup: async function () {
      const popUpVar = await openModal(LectureManagementModal, {
        title: this.pTitle,
        courseNo: "",
        action: this.action,
        retrunval: (value) => {
          this.opoupreturn = value;
          console.log("return val : " + value);
        },
      });

      popUpVar.onclose = () => {
        console.log("Close");
        //팝업창이 닫히면 리스트 다시 새로고침 (등록, 수정 한 데이터가 업로드 된다.)
        if (this.opoupreturn === "Y") {
          this.searchList();
        }
        // return false;
      };

      console.log(popUpVar);
    },

    openAddModal() {
      this.action = "I";
      this.openPopup();
    },
    closeAddModal() {},
    getLectureDetail(courseNo) {
      this.$router.push({
        name: "tCourseDetail",
        params: { course_no: courseNo },
      });
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
  cursor: pointer;
}

.titletext {
  font-size: 24px;
  font-weight: bold;
}

.container {
  display: flex;
  justify-content: space-between;
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
</style>
