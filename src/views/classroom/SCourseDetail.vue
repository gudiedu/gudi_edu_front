<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <div class="titleHeader">
        <v-card-title class="d-flex align-center pe-2">
          <div class="titletext">{{ titleText }}</div>
          <v-spacer></v-spacer>
        </v-card-title>

        <div class="button-group">
          <button class="goBack-button" @click="goBack">뒤로가기</button>
        </div>
      </div>

      <v-divider></v-divider>

      <v-card class="dashboard-card">
        <div class="titletext">강의정보</div>
        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>강의명</th>
              <th>강사명</th>
              <th>강의실</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>수강정원</th>
            </tr>
          </thead>
          <tbody>
            <!-- <template v-for="" :key=""> -->
            <tr>
              <td>Java 기초</td>
              <td>강사</td>
              <td>101호</td>
              <td>2024.01.02</td>
              <td>2024.05.01</td>
              <td>20</td>
            </tr>
          <!-- </template> -->
          </tbody>
        </v-table>
      </v-card>

      <v-card class="dashboard-card">
        <div class="titletext">강의 소개</div>

        <v-textarea
          class="textarea"
          label="강의소개"
          model-value="안녕하세요 Java강의에 오신걸 환영합니다."
          readonly
          row-height="30"
          rows="5"
          variant="outlined"
          auto-grow
          shaped
        ></v-textarea>
      </v-card>

      <v-card class="dashboard-card">
        <div class="titletext">주차별 계획</div>
        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>주차</th>
              <th>학습목표</th>
              <th>학습내용</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1주차</td>
              <td>java</td>
              <td>배열</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      titleText: "강의상세",
      sCourseInfo: [],
      sCourseDetail: [],
      currentLoginID:"",
    };
  },
  mounted() {
    this.sCourseInfoList();
    this.sCourseDetailList();
  },
  computed: {
    // route에서 강의번호 가져오기
    courseNo() {
      return this.$route.params.courseNo;
    },
  },
  methods: {
    // 강의번호에 대한 강의 정보 조회 - mounted 되야함
    sCourseInfoList() {

      let courseParams = new URLSearchParams();
      courseParams.append("courseNo", this.courseNo);

      console.log("courseNo나오니안나오니 : "+ this.courseNo);

      // axios 요청 설정
      this.axios
        .post("/classroom/sCourseInfo.do", courseParams)
        .then((response) => {
          console.log("JSON.stringify(response) : " + JSON.stringify(response));
          console.log("여기다 여기야: " + response.data.infoResult.course_no);

          this.courseName = response.data.infoResult.course_name;
          this.teacherName = response.data.infoResult.name;
          this.courseBegins = response.data.infoResult.course_start_date;
          this.courseEnds = response.data.infoResult.course_end_date;
          this.courseQuota = response.data.infoResult.course_quota;
          this.courseNo = response.data.infoResult.course_no;


        })
        .catch(function (error) {
          alert("ERROR" + error);
        });
    },

    sCourseDetailList(){

      let detailParams = new URLSearchParams();
      detailParams.append("courseNo", this.courseNo);

      console.log("detail에서도 courseNo가 나오니: " + this.courseNo);

      this.axios
        .post("/classroom/sCourseDetail.do", detailParams)
        .then((response) => {
          console.log("DETAIL_JSON :  "+ JSON.stringify(response));
          
        })
        .catch(function (error){
          alert("ERROR" + error);
        });
    },

  },
};
</script>


<style scoped>
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
.insert-button,
.goBack-button {
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
.goBack-button:hover {
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
