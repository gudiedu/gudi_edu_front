<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <!-- <div class="container">
        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
             <v-select
              v-model="selectedOption"
              :items="options"
              label="검색조건"
              outlined
              class="search-select"
              item-height="10"
              dense
              max-height="100"></v-select> 
            <input
              type="text"
              class="search-input"
              placeholder="검색어를 입력해주세요."
              v-model="searchKeyword"
            />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchMethod">검색</button>
          </div>
        </div>
      </div> -->

      <v-divider></v-divider>

      <form id="enrollment">
      <v-table class="dashboard-table">
        <thead>
          <tr>
            <!-- <td>과목번호</td> -->
            <th>과목명</th>
            <th>강의명</th>
            <th>강사명</th>
            <th>강의실</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>수강정원</th>
            <th>수강신청</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="course in enrollAvailable" :key="course.course_no">
            <tr>
              <!-- <td @click="courseDetail(course.course_no)">{{ course.course_no }}</td> -->
              <td @click="courseDetail(course.course_no)">{{ course.course_subject }}</td>
              <td @click="courseDetail(course.course_no)">{{ course.course_name }}</td>
              <td @click="courseDetail(course.course_no)">{{ course.name }}</td>
              <td @click="courseDetail(course.course_no)">{{ course.course_loc }}</td>
              <td @click="courseDetail(course.course_no)">{{ course.course_start_date }}</td>
              <td @click="courseDetail(course.course_no)">{{ course.course_end_date }}</td>
              <td @click="courseDetail(course.course_no)">{{ course.course_quota }}</td>
              <td @click="courseEnroll(course.course_no)">신청하기</td>
            </tr>
        </template>
        </tbody>
      </v-table>
    </form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      titleText: "수강신청",
      action: "",
      sEnrollList: [],
      enrollAvailable: [],
      courseNo:"",
      studentSignedID : "",
      searchKeyword: '',
      selectedOption: '과목명',
      options: ['과목명', '강의명', '강사명'],
      searchResults: [],
      searched: false,
    };
  },
  mounted(){
    this.enrollList();

  },
  methods: {
    enrollList(){

      let enrollListParams = new URLSearchParams();

      this.axios
        .post("/classroom/sEnrollList.do", enrollListParams)
        .then((response) => {
          console.log(JSON.stringify(response));

          this.enrollAvailable = response.data.enrollList;

          response.data.enrollList.forEach(each => {
            this.openedNo = each.course_no;
            this.openedSubject = each.course_subject;
            this.openedName = each.course_name;
            this.openedQuota = each.course_quota;
            this.openedBegins = each.course_start_date;
            this.openedEnds = each.course_end_date;
            this.teacherName = each.name;

          });

        })
    },

    searchMethod() {

      switch (this.selectedOption){
        case '과목명' :
          console.log('검색조건: subject, keyWord:', this.searchKeyword);
          this.searchResults = this.items.filter(item => item.subject.toLowerCase().includes(this.searchKeyword.toLowerCase()));
          break;
        case '강사명' :
          console.log('검색조건: teacher, keyWord:', this.searchKeyword);
          this.searchResults = this.items.filter(item => item.instructor.toLowerCase().includes(this.searchKeyword.toLowerCase()));
          break;
        case '강의명':
          console.log('검색조건: course, keyWord: ', this.searchKeyword);
          this.searchResults = this.items.filter(item => item.lecture.toLowerCase().includes(this.searchKeyword.toLowerCase()));
          break;
        default:
          console.warn('검색 조건을 다시 확인해주세요.');
      }
      this.searched = true; // 검색을 수행했음을 표시
    },
    courseDetail(courseNo) {
      this.$router.push({
        name: 'sCourseDetail',
        params: { courseNo: courseNo },
      });
    },

    courseEnroll(courseNo){

      this.courseNo = courseNo;

      let enrollInfo = document.getElementById("enrollment");
      let data = new FormData(enrollInfo);
      data.append("openedNo", this.courseNo);
      data.append("studentSignedID", this.studentSignedID);

      console.log("수강신청번호: ", this.courseNo);

      this.axios
        .post("/classroom/sEnrollInsert.do", data)
        .then((response) => {
          console.log("수강신청JSON: ", JSON.stringify(response));

          if(response.data.result > 0){
            alert(response.data.resultMsg);
            console.log("너왜안나오냐: ", response.data.resultMsg);
          }
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
  height: 50px;
  align-items: center;
  justify-content: flex-end;
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
/*
.search-select {
  margin-left: 10px;
  min-width: 100px; /* 선택적으로 너비를 조정할 수 있습니다 
} */

</style>
