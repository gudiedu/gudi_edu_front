<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>강의명</th>
            <th>강사명</th>
            <th>시작일</th>
            <th>종료일</th>
            <th>출결현황</th>
            <th>만족도조사</th>
          </tr>
        </thead>
        <tbody>
          <!--v-for로 가져오기-->
          <tr>
            <td @click="lectureModify('Java 기초')">Java 기초</td>
            <td>강사</td>
            <td>101호</td>
            <td>2024.01.02</td>
            <td>2024.05.01</td>
            <td>20</td>
            <td @click="classSatisfaction">수업만족도</td>
            <td @click="attendance(18)">출결</td>
          </tr>
          <tr>
            <td @click="lectureModify('Vue')">Vue</td>
            <td>강사</td>
            <td>101호</td>
            <td>2024.01.02</td>
            <td>2024.05.01</td>
            <td>20</td>
            <td @click="classSatisfaction">수업만족도</td>
            <td @click="attendance(18)">출결</td>
          </tr>
        </tbody>
      </v-table>
    </v-card>

    <!-- 페이지네이션 추가-->

    <v-dialog v-model="satisfactionModal" max-width="600px">
      <v-card>
        <v-card-text>
          <SatisfactionModal :action="action" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="attendanceModal" max-width="800px">
      <v-card>
        <v-card-text>
          <AttendanceModal :courseNo="courseNo" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import AttendanceModal from "./SAttendanceModal.vue";
export default {
  components: { AttendanceModal },
  data() {
    return {
      titleText: "강의관리",
      action: "",
      selectedNotice: null,
      activeFilter: "all",
      stitle: "",
      courseNo: 0,
      satisfactionModal: false,
      attendanceModal: false,
    };
  },
  methods: {
    lectureModify(lectureName) {
      this.$router.push({
        name: "sLectureDetail",
        params: { name: lectureName },
      });
    },
    classSatisfaction() {
      this.$router.push({
        name: "sLectureSatisfaction",
        // params: { name: lectureName },
      });
      this.satisfactionModal = true;
    },
    attendance(courseNo) {
      this.courseNo = courseNo;
      this.attendanceModal = true;
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
  cursor: pointer;
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
