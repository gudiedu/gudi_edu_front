<template>
  <v-table class="dashboard-table">
    <thead>
      <tr>
        <th class="lecture-name">강의명</th>
        <th class="attendance-date">출석일자</th>
        <th class="attendance-status">출결상태</th>
        <th class="attendance-file">첨부파일</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in pageList"
        :key="item.attendance_no"
        class="attendance-table"
      >
        <td>{{ this.selectedLecture }}</td>
        <td>{{ item.attendance_date }}</td>
        <td>
          <v-select
            v-model="item.attendance_status"
            :items="attendanceOptions"
            class="select-box"
            density="comfortable"
            @update:modelValue="changeAttendanceStatus(item)"
          >
            class="fixed-width-select" ></v-select
          >
        </td>
        <td class="attendance-file">
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
            <span class="x-box" @click="deleteAttendanceFile(item)"> X </span>
          </form>
          <div v-else>-</div>
        </td>
      </tr>
    </tbody>
  </v-table>
  <div id="attendancePagination">
    <paginate
      class="justify-content-center"
      v-model="currentPage"
      :page-count="page()"
      :page-range="5"
      :margin-pages="0"
      :click-handler="pagination()"
      :prev-text="'이전'"
      :next-text="'다음'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    ></paginate>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";
export default {
  components: {
    Paginate,
  },
  props: {
    selectedLecture: String,
    aList: Array,
    totalCount: Number,
  },
  mounted() {
    this.page();
  },
  data() {
    return {
      attendanceStatus: null,
      attendanceOptions: ["출석", "지각", "조퇴", "병결"],
      attendanceList: this.aList,
      selectLecture: this.selectedLecture,
      selectedFile: "",
      previewHtml: "",
      totalCnt: this.totalCnt,
      pageSize: 7,
      currentPage: 1,
      pageList: [],
    };
  },
  methods: {
    /**
     * 출석 상태 변경
     * @param {Object} attendance - 출석 정보 객체
     */
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
    /**
     * 병결 서류 업로드
     * @param {Object} attendance - 출석 정보 객체
     */
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
    /**
     * 병결 서류 삭제
     * @param {Object} attendance - 출석 정보 객체
     */
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
    page: function () {
      this.totalCnt = this.attendanceList.length;
      let total = this.totalCnt;
      let page = this.pageSize;
      let xx = total % page;
      let result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    pagination() {
      let endElement = this.currentPage * this.pageSize;
      let startElement = endElement - this.pageSize;
      this.pageList = this.attendanceList.slice(startElement, endElement);
    },
  },
  watch: {
    aList() {
      let vm = this;
      vm.attendanceList = vm.aList;
    },
    selectedLecture() {
      let vm = this;
      vm.selectLecture = vm.selectedLecture;
    },
    totalCount() {
      let vm = this;
      vm.totalCnt = vm.totalCount;
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
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

.attendance-table {
  height: 48px;
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

.attendance-status {
  width: 150px;
}

.lecture-name {
  text-overflow: ellipsis;
  overflow: hidden;
  width: auto;
}

.attendance-date {
  width: 100px;
}
.file-insert,
.attendance-file {
  width: 334px;
}

.x-box {
  cursor: pointer;
}

.select-box {
  vertical-align: 10px;
}
</style>
