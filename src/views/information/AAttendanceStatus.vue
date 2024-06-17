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
      <tr v-for="item in attendance" :key="item.attendance_no">
        <td>{{ this.selectedLecture }}</td>
        <td>{{ item.attendance_date }}</td>
        <td>
          <v-select
            v-model="item.attendance_status"
            :items="attendanceOptions"
            @update:modelValue="changeAttendanceStatus(item)"
          >
            class="fixed-width-select" ></v-select
          >
        </td>
        <td>
          <form
            id="file-form"
            enctype="multipart/form-data"
            v-if="item.attendance_status === '병결' && !item.file_no"
          >
            <input
              type="file"
              id="file-insert"
              name="file-insert"
              class="insert-button"
              @change="handleFileChange($event, item)"
            />
          </form>
          <form
            id="file-form"
            enctype="multipart/form-data"
            v-else-if="item.attendance_status === '병결'"
          >
            <div class="form-label"></div>
            <span id="preview" @click="download(item)">
              {{ item.file_origin }}
            </span>
            <span @click="deleteAttendanceFile(item)">
              X
            </span>
          </form>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
export default {
  components: {},
  props: {
    selectedLecture: String,
    attendanceList: Array,
  },
  data() {
    return {
      attendanceStatus: null,
      attendanceOptions: ["출석", "지각", "조퇴", "병결"],
      attendance: this.attendanceList,
      selectLecture: this.selectedLecture,
      selectedFile: "",
      previewHtml: "",
    };
  },
  methods: {
    changeAttendanceStatus(attendance) {
      let params = new URLSearchParams();
      params.append("attendance_no", attendance.attendance_no);
      params.append("attendance_status", attendance.attendance_status);

      this.axios
        .post("/aInformation/student/attendance/status", params)
        .then(() => {})
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    uploadAttendanceFile(attendance) {
      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("attendance_no", attendance.attendance_no);
      dataWithFile.append("attendance_status", attendance.attendance_status);
      dataWithFile.append("file", this.selectedFile);

      this.axios
        .post("/aInformation/student/attendance/fileUpload", dataWithFile)
        .then(() => {
          this.$emit(
            "showAttendance",
            this.selectedLecture,
            attendance.course_no
          );
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    deleteAttendanceFile(attendance) {
      let params = new URLSearchParams();
      params.append("attendance_no", attendance.attendance_no);
      params.append("attendance_status", attendance.attendance_status);
      params.append("file_no", attendance.file_no);

      this.axios
        .post("/aInformation/student/attendance/deleteFile", params)
        .then(() => {
          this.$emit(
            "showAttendance",
            this.selectedLecture,
            attendance.course_no
          );
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    handleFileChange(event, attendance) {
      this.selectedFile = event.target.files[0];
      this.uploadAttendanceFile(attendance);
    },
    download: function (attendance) {
      let params = new URLSearchParams();
      params.append("file_no", attendance.file_no);

      this.axios({
        url: "/aInformation/student/attendance/downloadFile",
        data: params,
        method: "POST",
        responseType: "blob",
      })
        .then((response) => {
          let FILE = window.URL.createObjectURL(new Blob([response.data]));
          let docUrl = document.createElement("a");
          docUrl.href = FILE;
          docUrl.setAttribute("download", attendance.file_local_path);
          document.body.appendChild(docUrl);
          docUrl.click();
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
  },
  watch: {
    attendanceList() {
      let vm = this;
      vm.attendance = vm.attendanceList;
    },
    selectedLecture() {
      let vm = this;
      vm.selectLecture = vm.selectedLecture;
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
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
.update-button,
.delete-button {
  /* padding: 10px 16px; */
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.delete-button {
  background-color: #d32f2f;
  margin: 0;
}
.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}
</style>
