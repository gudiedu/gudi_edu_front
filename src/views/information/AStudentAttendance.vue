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
        <div class="titletext">
          {{ this.studentName }}({{ getStudentId }})님의 강의 목록
        </div>
        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th class="lecture-name">강의명</th>
              <th>강사명</th>
              <th>강의실</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>수강인원</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in lectureList" :key="item.course_id">
              <td
                class="lecture-name"
                @click="showAttendance(item.course_name, item.course_no)"
              >
                {{ item.course_name }}
              </td>
              <td>{{ item.name }}</td>
              <td>{{ item.course_loc }}</td>
              <td>{{ item.course_start_date }}</td>
              <td>{{ item.course_end_date }}</td>
              <td>{{ item.course_quota }}</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <v-card v-if="attendance" class="dashboard-card">
        <div class="titletext">출석 현황</div>
        <Attendance
          :selectedLecture="selectedLecture"
          :aList="attendanceList"
          @showAttendance="showAttendance"
        />
      </v-card>
    </v-card>

    <!-- <div class="button-group">
      <button class="registration-button" @click="lectureRegistration">
        강의신청
      </button>
    </div> -->
  </v-container>
</template>

<script>
import Attendance from "./AAttendanceStatus.vue";
export default {
  components: { Attendance },
  data() {
    return {
      titleText: "학생출결",
      selectedLecture: "",
      attendance: false,
      lectureList: [],
      attendanceList: [],
      studentName: "",
    };
  },
  computed: {
    getStudentId() {
      return this.$route.params.studentId;
    },
  },
  mounted() {
    this.searchLecture();
  },
  methods: {
    /** 학생의 강의 목록 조회 */
    searchLecture() {
      let vm = this;

      let params = new URLSearchParams();
      params.append("studentId", this.getStudentId);

      this.axios
        .post("/aInformation/student", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          this.lectureList = response.data.slice(0, response.data.length - 1);
          this.studentName = response.data[response.data.length -1].name;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    /**
     * 출석 목록 조회
     * @param {String} courseName - 강의 제목
     * @param {Number} courseNo - 강의 번호
     */
    showAttendance(courseName, courseNo) {
      console.log(courseName);
      console.log(courseNo);
      this.selectedLecture = courseName;
      let params = new URLSearchParams();
      params.append("studentId", this.getStudentId);
      params.append("courseNo", courseNo);

      this.axios
        .post("/aInformation/student/attendance", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          this.attendanceList = response.data;
          this.attendance = true;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
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
  left: 0;
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
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 16px 0;
}

.search-icon {
  margin-right: 8px;
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
  font-size: 16px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

.lecture-name {
  width: 325px;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
