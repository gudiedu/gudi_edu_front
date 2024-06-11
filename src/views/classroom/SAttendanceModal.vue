<template>
  <div class="lecture-detail">
    <h2 class="title">{{ courseName }} 출결사항</h2>

    <div class="attendanceModal">
      <v-card class="dashboard-card">
        <div class="titletext">
          강의일정 : {{ courseStartDate }} -
          {{ courseEndDate }}
        </div>

        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>총 수강일수</th>
              <th>출석일</th>
              <th>결석일</th>
              <th>출석률(일수)</th>
              <!-- <th>총수당지급액</th> -->
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ totalCourseDays }}일</td>
              <td>{{ attendanceDays }}일</td>
              <td>{{ absenceDays }}일</td>
              <td>{{ attendanceRate }}%</td>
              <!-- <td>{{ totalAllowanceAmount }}원</td> -->
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <v-card class="dashboard-card">
        <div class="titletext">특이사항</div>

        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>결석일자</th>
              <th>출석상태</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in attendanceNotes" :key="item.course_no">
              <tr>
                <td>{{ item.attendance_date }}</td>
                <td>{{ item.attendance_status }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>

      <!-- <div class="bottom">
        <v-card class="dashboard-card half-width">
          <div class="titletext">특이사항</div>

          <v-table class="dashboard-table">
            <thead>
              <tr>
                <th>결석일자</th>
                <th>출석상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024.05.22</td>
                <td>결석</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>

        <v-card class="dashboard-card half-width">
          <div class="titletext">수당지급내역</div>

          <v-table class="dashboard-table">
            <thead>
              <tr>
                <th>지급일자</th>
                <th>금액</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024.05.24</td>
                <td>250,000</td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    courseNo: Number,
  },
  data() {
    return {
      paction: this.action,
      pCourseNo: this.courseNo,
      courseName: "",
      courseStartDate: "",
      courseEndDate: "",
      totalCourseDays: "",
      attendanceDays: "",
      absenceDays: "",
      attendanceRate: "",
      totalAllowanceAmount: "",
      attendanceNotes: [],
    };
  },
  mounted() {
    this.attendanceList();
  },
  methods: {
    attendanceList() {
      let vm = this;

      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("pCourseNo", this.pCourseNo);

      this.axios
        .post("/classroom/sStudentAttendance.do", params)
        .then((response) => {
          //console.log(JSON.stringify(response));

          this.courseName = response.data.sStudentCourseInfo.course_name;
          this.courseStartDate =
            response.data.sStudentCourseInfo.course_start_date;
          this.courseEndDate = response.data.sStudentCourseInfo.course_end_date;

          this.calculateTotalCourseDays();

          this.attendanceDays = response.data.attendanceDays;
          this.absenceDays = response.data.absenceDays;

          this.calculateAttendanceRate();

          vm.attendanceNotes = response.data.sAttendanceNotes;
          console.log(vm.attendanceNotes);
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    calculateTotalCourseDays() {
      const startDate = new Date(this.courseStartDate);
      const endDate = new Date(this.courseEndDate);

      const timeDifference = endDate - startDate;

      const dayDifference = timeDifference / (1000 * 3600 * 24);

      this.totalCourseDays = dayDifference + 1;
    },

    calculateAttendanceRate() {
      if (this.totalCourseDays > 0) {
        this.attendanceRate = (
          (this.attendanceDays / this.totalCourseDays) *
          100
        ).toFixed(2);
      } else {
        this.attendanceRate = 0;
      }
    },
  },
};
</script>

<style scoped>
.dashboard-card {
  margin: 16px 0;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px 15px;
  text-align: center;
}

.dashboard-table th {
  background-color: #f2f2f2;
  border-bottom: 2px solid #ddd;
  font-weight: bold !important;
  text-align: center !important;
}

.dashboard-table tbody tr {
  border-bottom: 1px solid #ddd;
}

.dashboard-table tbody tr:nth-of-type(even) {
  background-color: #f9f9f9;
}

.dashboard-table tbody tr:hover {
  background-color: #f1f1f1;
}

.attendanceModal {
  padding: 16px;
}

.bottom {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.half-width {
  flex: 1;
  max-width: 50%;
}

.titletext {
  font-size: 16px;
  font-weight: bold;
  margin: 10px;
}

.lecture-detail {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
  max-width: 800px;
  margin: auto;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}
</style>
