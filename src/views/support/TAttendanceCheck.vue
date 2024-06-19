<template>
  <div>
    <v-table class="dashboard-table">
      <thead>
        <tr>
          <th>학생이름</th>
          <th>전화번호</th>
          <template v-if="isHolidayOrWeekend">
            <th>상태</th>
          </template>
          <template v-else>
            <th>지각</th>
            <th>조퇴</th>
            <th>결석</th>
          </template>
          
        </tr>
      </thead>
      <tbody>
        <template v-if="isHolidayOrWeekend">
           <tr v-for="(student, index) in students" :key="index">
            <td>{{ student.name }}</td>
            <td>{{ student.hp }}</td>
            <td>{{holidayMessage}}</td>
          </tr>

        </template>
        <template v-else>
          <template v-if="totalCnt > 0">
          <tr v-for="(student, index) in students" :key="index">
            <td>{{ student.name }}</td>
            <td>{{ student.hp }}</td>
            <td>
              <input
                type="radio"
                :name="'status-' + index"
                :value="'지각'"
                v-model="student.attendance_status"
                @click="toggleRadio(index, '지각')"
              />
            </td>
            <td>
              <input
                type="radio"
                :name="'status-' + index"
                :value="'조퇴'"
                v-model="student.attendance_status"
                @click="toggleRadio(index, '조퇴')"
              />
            </td>
            <td>
              <input
                type="radio"
                :name="'status-' + index"
                :value="'결석'"
                v-model="student.attendance_status"
                @click="toggleRadio(index, '결석')"
              />
            </td>
          </tr>
          </template>
          <template v-else>
            <tr>
              <td colspan="5">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
        </template>

      </tbody>
    </v-table>
    <template v-if="isHolidayOrWeekend">
    </template>
    <template v-else>
    <div class="submitAttendance">
       <template v-if="totalCnt > 0">
          <button @click="submitAttendance">출석 완료</button>
       </template>
    </div>
    </template>

  </div>
</template>

<script>
export default {
    props: {
    courseNo: Number,
  },
  data() {
    return {
      students: [],
      attendance_status: "출석",
      totalCnt:"",
      listDay: [],
      today: new Date().toISOString().split('T')[0],
      duration:"",
      days_elapsed:"",

      
    };
  },  
  mounted() {
    this.searchList()
  },
  computed: {
    isHolidayOrWeekend() {
      return this.isHoliday(this.today) || this.isWeekend(this.today) || this.isComplete();
    },
    holidayMessage() {
      if (this.isHoliday(this.today)) {
        return "공휴일 또는 휴강 입니다.";
      } else if (this.isWeekend(this.today)) {
        return "주말입니다.";
      } else {
        return "종료된 강의입니다.";
      }
    }

  },
  methods: {
    isHoliday(date) {
      const dateString = date.split('T')[0];
      return this.listDay.some(item => item.dayoff_date === dateString);
    },
    isWeekend(date) {
      const day = new Date(date).getDay();
      return day === 0 || day === 6; // 0: Sunday, 6: Saturday
    },
    isComplete() {
     return this.duration === this.days_elapsed
    },
    searchList: function () {

      let vm = this 

      let params = new URLSearchParams() 
      params.append('courseNo', this.courseNo)

      this.axios
        .post('/support/infoAttendance', params)
        .then((response) => {
          // console.log(JSON.stringify(response))
          console.log(JSON.stringify(response.data.listDay))

          vm.students = response.data.listdata
          vm.totalCnt = response.data.totalcnt
          vm.listDay = response.data.listDay
          vm.duration = response.data.attend.duration
          vm.days_elapsed = response.data.attend.days_elapsed
          
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error)
        })
    },
    toggleRadio(index, value) {
      if (this.students[index].attendance_status === value) {
        this.students[index].attendance_status = null;
      }
    },
    submitAttendance() {

      this.students.forEach((student) => {
        if (!student.attendance_status) {
          student.attendance_status = '출석';
        }
      });

      let params = new URLSearchParams()
      params.append('courseNo', this.courseNo)
      params.append('students', JSON.stringify(this.students))
      
      // JSON.stringify(this.weeks))

      this.axios
        .post('/support/saveAttendance', params)
        .then((response) => {
          // console.log(JSON.stringify(response))
          alert(response.data.resultMsg)
        })
        .catch(function (error) {
          alert('에러! API 요청에 오류가 있습니다. ' + error)
        })
    },

  },
};
</script>

<style scoped>
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
  width: 150px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}

button:hover {
  background-color: #0056b3;
}

.submitAttendance {
  display: flex;
  justify-content: flex-end;
}
</style>
