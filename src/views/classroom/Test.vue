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

      <form id="test">
      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>과목명</th>
            <th>강의명</th>
            <th>강사명</th>
            <th>강의실</th>
            <th>시험명</th>
            <th>시험현황</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="test in sTestList" :key="test.course_no">
            <tr @click="testDetail(test.course_no, test.test_category, test.result_no)">
              <td>{{ test.course_subject }}</td>
              <td>{{ test.course_name }}</td>
              <td>{{ test.name }}</td>
              <td>{{ test.course_loc }}</td>
              <td>{{ test.test_category }}</td>
              <td>
                {{ test.result_no != 0  && (test.test_category === '1차' || test.test_category === '2차' || test.test_category === '테스트') ? `응시 / ${test.result_score}` : '미응시' }}
              </td>
            </tr>
        </template>
        </tbody>
      </v-table>
    </form>
    </v-card>

    <!-- 페이지네이션 추가-->
    <div id="testPagination">
      <paginate
        class="justify-content-center"
        v-model="currentPage" 
        :page-count="page()"
        :page-range="5"
        :margin-pages="0"
        :click-handler="courseTestList"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'">
      </paginate>
     </div>

    <v-dialog v-model="testModal">
      <v-card>
        <v-card-text>
          <testModal
           :action="action"
           :courseNo="courseNo"
           :testCategory="testCategory"
           @close-modal="closeModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="testResultModal">
      <v-card>
        <v-card-text>
          <testResultModal
           :action="action"
           :courseNo="courseNo"
           :testCategory="testCategory"
           :testResultNo="testResultNo"
           @close-modal="closeModal"
          />
        </v-card-text>
      </v-card>
    </v-dialog>



  </v-container>
</template>

<script>
import testModal from "./TestModal.vue";
import testResultModal from "./TestResultModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    testModal,
    testResultModal,
     Paginate,
  },
  data() {
    return {
      titleText: "시험관리",
      action: "",
      sTestList: [],
      courseNo: 0,
      studentSignedID : "",
      testList: [],
      testModal: false,
      testResultModal: false,
      currentPage: 1,
      totalCnt: 0,
      pageSize: 10,
      testCategory:"",
      searchedWords: "",
      testResultNo: "",
    };
  },
  mounted(){
    this.courseTestList();
  },
  methods: {
    // 수강 강의 리스트 불러오기
    courseTestList(){

      let testListParams = new URLSearchParams();
      testListParams.append("searchedWords", this.searchedWords);

      this.axios
        .post("/classroom/sTestList.do", testListParams)
        .then((response) => {
          console.log("강의리스트불러오는JSON이닷: ",JSON.stringify(response));

          this.sTestList = response.data.testList;

          response.data.testList.forEach(each => {
             this.testCourseNo = each.course_no;
             this.testSubject = each.course_subject;
             this.testCourseName = each.course_name;
             this.testCourseBegins = each.course_start_date;
             this.teacherName = each.name;
             this.testCourseLoc = each.course_loc;
             this.testResultNo = each.result_no;
             this.testResultScore = each.result_score;
             this.testCategory = each.test_category;

             console.log("this.testResultScore : ", this.testResultScore);

           });

        })
    },

    testResult(courseNo, testCategory){

      this.courseNo = courseNo;
      this.testCategory = testCategory;
      console.log("courseNo: ", this.courseNo);
      console.log("testCategory : ", this.testCategory);

      let testResultParam = new URLSearchParams();

      this.axios
        .post("/classroom/sTestCalculate.do", testResultParam)
        .then((response) => {
          console.log("여기를찾아쥬세유: ",JSON.stringify(response));

          response.data.sTestResultList.forEach(each => {
             this.testCourseNo = each.course_no;
             this.testSubject = each.course_subject;
             this.testResultNo = each.result_no;
             this.testResultScore = each.result_score;
             this.testCategory = each.test_category;

           });

        })

    },

    testDetail(courseNo, testCategory, testResultNo) {

      this.courseNo = courseNo;
      this.testCategory = testCategory;
      this.testResultNo = testResultNo;

      console.log("courseNo: ", this.courseNo);
      console.log("testCategory : ", this.testCategory);
      console.log("testResultNo", this.testResultNo);
      console.log("testResultNo == 0: ", this.testResultNo == 0);
      
      if(testResultNo == 0){
        this.testModal = true;
      } else {
        this.testResultModal = true;
      }
    },

    closeModal(){
      this.testModal = false;
      this.testResultModal = false;
      this.courseTestList();
    },
    searching() {
      console.log('검색어:', this.searchKeyword);
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
</style>
