<template>
  <div class="lecture-detail">
    <h2 class="title">출석부</h2>

    <div class="form-group">
      <v-table class="dashboard-table">
        <colgroup>
          <col width="7%" />
          <col width="9%" />
          <col width="*%" />
        </colgroup>
        <thead>
          <tr>
            <th>이름</th>
            <th>휴대폰</th>
            <th v-for="date in uniqueDates" :key="date">
              {{ formatDate(date) }}
            </th>
            <th>출석률</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(student, index) in students" :key="index">
            <td>{{ student.name }}</td>
            <td>{{ student.hp }}</td>
            <td v-for="date in uniqueDates" :key="date">
              {{ getStatus(student, date) }}
            </td>
            <td>{{ getAttendanceRate(student) }}%</td>
          </tr>
        </tbody>
      </v-table>
    </div>

    <div class="button-group">
      <v-btn class="insert-button" @click="excel">엑셀다운로드</v-btn>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  props: {
    courseNo: String,
  },
  data() {
    return {
      attendanceData: [],
      holidays: [],
    };
  },
  mounted() {
    this.searchList();
  },
  computed: {
    uniqueDates() {
      const dates = this.attendanceData.map((item) => item.attendance_date);
      return [...new Set(dates)];
    },
    students() {
      const studentsMap = {};
      this.attendanceData.forEach((item) => {
        if (!studentsMap[item.name]) {
          studentsMap[item.name] = {
            name: item.name,
            hp: item.hp,
            attendance: {},
          };
        }
        studentsMap[item.name].attendance[item.attendance_date] =
          item.attendance_status;
      });
      return Object.values(studentsMap);
    },
  },
  methods: {
    searchList() {
      let params = new URLSearchParams();
      params.append("courseNo", this.courseNo);

      this.axios
        .post("/support/allListAttendance", params)
        .then((response) => {
          // console.log(JSON.stringify(response))
          // this.holidays = response.data.listDay.map(day => day.dayoff_date);
          this.attendanceData = response.data.allAttendance;
        })
        .catch(function (error) {
          alert("에러! api요청 " + error);
        });
    },
    formatDate(date) {
      return moment(date).format("YYYY-MM-DD");
    },
    getStatus(student, date) {
      // if (this.holidays.includes(date)) {
      //   return '공휴일';
      // }
      // const day = new Date(date).getDay();
      // if (day === 0 || day === 6) {
      //   return '주말';
      // }
      return student.attendance[date] || "";
    },
    getAttendanceRate(student) {
      const totalDays = this.uniqueDates.length;
      const attendedDays = Object.values(student.attendance).filter(
        (status) => status === "출석"
      ).length;
      return ((attendedDays / totalDays) * 100).toFixed(2);
    },

    excel: function () {
      //파라메터가 없고 요청만 들어감

      // const ssdate = this.attendanceData.map(item => item.attendance_date);

      let params = new URLSearchParams();
      params.append("courseNo", this.courseNo);
      // params.append('ssdate', ssdate)
      // params.append('sedate', this.courseNo)

      this.axios({
        url: "/support/attendanceExcelDownload",
        data: params,
        method: "POST",
        responseType: "blob", //파일에 대한 내용을 받으려면 추가해줘야 한다.
      }).then((response) => {
        //브라우저 있는 자바스크립 버전은 사용안함, node.js꺼 사용 => 그래서 이런 작업을 처리 해야함
        console.log(response);
        console.log(response.data);
        //Blob 데이터를 이진파일로 변환, 파일 데이터를 받아 바이너리 데이터로 만든 후 URL을 만든다.
        let FILE = window.URL.createObjectURL(new Blob([response.data]));
        //a 태그를 만들어서 이 태그 안에 파일 이름을 넣어
        let docUrl = document.createElement("a");
        docUrl.href = FILE;
        docUrl.setAttribute("download", "attendance.xlsx");
        document.body.appendChild(docUrl); //만든 a태그를 끼어넣어
        docUrl.click(); //강제로 클릭하게 만들어 //url을 클릭하면 다운로드가 됨
        //console.log('FILE : ' + FILE)
      });
    },
  },
};
</script>

<style scoped>
.lecture-detail {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
  height: 600px;
  margin: auto;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #407bff;
  box-shadow: 0 0 4px rgba(64, 123, 255, 0.2);
  outline: none;
}

.form-textarea {
  height: 200px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.update-button,
.delete-button,
.insert-button {
  /* padding: 10px 16px; */
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.update-button,
.insert-button {
  background-color: #407bff;
}

.update-button:hover,
.insert-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.delete-button {
  background-color: #d32f2f;
  margin: 0;
}

.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
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
