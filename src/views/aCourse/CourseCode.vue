<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <div class="container">
        <!-- <div class="filter-button-group">
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
        </div> -->

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
            <th>글번호</th>
            <th>강의코드</th>
            <th>강의명</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in courseList" :key="item.detail_code">
            <td>{{ index + 1 }}</td>
            <td @click="lectureCodeModify(item)">{{ item.detail_code }}</td>
            <td>{{ item.detail_name }}</td>
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
        :click-handler="handlePageClick"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'">
      </paginate>
     </div>





    <div class="button-group">
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>
    <v-dialog v-model="addModal" max-width="600px" persistent @click:outside="closeAddModal">
      <v-card>
        <v-card-text>
          <ALectureLCodeModal :action="action" :detail_code="detail_code" :detail_name="detail_name" @close="closeAddModal" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import ALectureLCodeModal from "./ACourseCodeModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: { 
    ALectureLCodeModal,
    Paginate,
   },
  data() {
    return {
      titleText: "강의코드관리",
      addModal: false,
      action: "",
      selectedNotice: null,
      stitle: "",
      detail_code: "",
      detail_name: "", // detail_name 추가
      courseList: [] ,// 강의 코드 목록을 저장할 배열
      currentPage: 1,
      totalCnt: 0,
      pageSize: 10,
    };
  },
  mounted() {
    // 페이지 로드될 때 강의 코드 목록을 가져오는 메서드 호출
    this.getCourseList();
  },
  methods: {
    handlePageClick(pageNumber) {
    this.currentPage = pageNumber;
    this.getCourseList();
  },
    getCourseList() {
      let vm = this;
      let courseParams = new URLSearchParams();
      courseParams.append("currentPage", this.currentPage);
      courseParams.append("pageSize", this.pageSize);
      courseParams.append("detail_name", this.detail_name);
      courseParams.append("detail_code", this.detail_code);

    //   let courseParams = {
    //   currentPage: this.currentPage,
    //   pageSize: this.pageSize,
    //   detail_name: this.detail_name,
    //   detail_code: this.detail_code
    // }; 위와 같은 코드임

  axios.post('/acourse/aCourseList.do', courseParams)
    .then(response => {
      console.log('Course list response:', response.data); // 전체 응답 데이터 콘솔 출력
      vm.courseList = response.data.listdate; // 데이터 바인딩
      vm.totalCnt = response.data.totalCnt;
      console.log('Course list:', this.courseList); // 바인딩된 데이터 콘솔 출력
      console.log("JSON.stringify(response) : " + JSON.stringify(response));
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
      axios.get('/acourse/codeSearch.do', {
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
    
    lectureCodeModify(lecture) {
      this.selectedNotice = lecture;
      this.detail_code = lecture.detail_code;
      this.detail_name = lecture.detail_name;
      this.action = "U";
      this.addModal = true;
    },
    
    openAddModal() {
      axios.get('/acourse/nextCodeSelect.do')
        .then(response => {
          this.detail_code = response.data; // 새로운 강의 코드 저장
          this.action = "";
          this.addModal = true;
        })
        .catch(error => {
          console.error('Error generating course code:', error);
        });
    },
    closeAddModal() {
      this.detail_name = '';
      console.log("모달닫힘");
      this.addModal = false;
      if(this.stitle == ''){
        this.getCourseList(); // 모달이 닫힐 때 강의 목록을 갱신합니다.
      }else{
        this.searchMethod();
      }

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
