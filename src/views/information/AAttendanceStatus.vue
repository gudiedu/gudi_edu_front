<template>
  <v-table class="dashboard-table">
    <thead>
      <tr>
        <th>강의명</th>
        <th>출석일자</th>
        <th>출결상태</th>
        <th>비고</th>
      </tr>
    </thead>
    <tbody>
      <template v-for="item in attendanceList">
      <tr v-if="true" :key="item.attendance_no">
        <td>{{ this.selectedLecture }}</td>
        <td>{{ item.attendance_date }}</td>
        <td>
          <v-select
            v-model="attendanceStatus"
            :items="attendanceOptions"
            class="fixed-width-select"
          ></v-select>
        </td>
        <td></td>
      </tr>
      </template>
    </tbody>
  </v-table>
</template>

<script>
export default {
  components: {},
  props: {
    selectedLecture: String,
    attendanceList: [],
  },
  // beforeUpdate(){
  //   this.attendanceList = this.attendanceList;
  // },
  data() {
    return {
      attendanceStatus: null,
      attendanceOptions: ["출석", "지각", "조퇴"],
      attendanceList: this.attendanceList,
      selectedLecture: this.selectedLecture,
    };
  },
  methods: {
    
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
  width: 200px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
.fixed-width-select {
  width: 100%;
  min-width: 100px;
  box-sizing: border-box;
  display: flex;
}
</style>
