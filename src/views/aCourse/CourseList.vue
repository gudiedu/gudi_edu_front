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
            @click="findAll"
            >전체</v-btn
          >
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'admin' }"
            @click="findAdmin"
            >진행중</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'teacher',
            }"
            @click="findTeacher"
            >진행완료</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'teacher',
            }"
            @click="findTeacher"
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
            <button class="search-button" @click="searchMethod">검색</button>
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
            <th>수강인원</th>
            <th>수강기간</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>강의실</th>
            <th>현황</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in courseList" :key="item.course_no">
            <td>{{ index + 1 }}</td>
            <td>{{ item.course_name }}</td>
            <td>{{ item.user_name }}</td>
            <td>{{ item.course_quota }}명</td>
            <td>{{ item.course_period }}일</td>
            <td>{{ item.course_start_date }}</td>
            <td>{{ item.course_end_date }}</td>
            <td>{{ item.course_loc }}</td>
            <td>
              <span v-if="new Date() > new Date(item.course_end_date)">진행완료</span>
              <span v-else-if="new Date() < new Date(item.course_start_date)">진행예정</span>
              <span v-else>진행중</span>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
    
    <!-- 페이지네이션 추가-->

    <!-- <div class="button-group">
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>
    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <NoticeModal :action="action" />
        </v-card-text>
      </v-card>
    </v-dialog> -->
  </v-container>
</template>

<script>
import axios from 'axios';
export default {
  components: {},
  data() {
    return {
      titleText: "강의목록",
      addModal: false,
      action: "",
      selectedNotice: null,
      activeFilter: "all",
      stitle: "",
      courseList: [], // 강의 코드 목록을 저장할 배열
    };
  },
  mounted() {
    // 페이지 로드될 때 강의 코드 목록을 가져오는 메서드 호출
    this.getCourseList();
  },
  methods: {
    getCourseList() {
  axios.get('/course/CourseList.do')
    .then(response => {
      console.log('Course list response:', response.data); // 전체 응답 데이터 콘솔 출력
      this.courseList = response.data.listdate; // 데이터 바인딩
      console.log('Course list:', this.courseList); // 바인딩된 데이터 콘솔 출력
    })
    .catch(error => {
      console.error('Error fetching course list:', error);
    });
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
    searchMethod() {
      console.log(this.stitle);
      axios.get('/course/courseSearch.do', {
          params: {
            word: this.stitle
          }
        })
    .then(response => {
      console.log('Course list response:', response.data); // 전체 응답 데이터 콘솔 출력
      this.courseList = response.data.listdate; // 데이터 바인딩
      console.log('Course list:', this.courseList); // 바인딩된 데이터 콘솔 출력
    })
    .catch(error => {
      console.error('Error fetching course list:', error);
    });



    },
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

.search-container {
  display: flex;
    align-items: center;
    /* padding: 10px; */
    /* padding: 20px; */
    border: 1px solid #ccc;
    border-radius: 25px;
    margin: 16px 0;
}

.search-icon {
  margin: 8px;
  color: #555;
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
