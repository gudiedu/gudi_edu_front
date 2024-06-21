<template>
  <div class="lecture-detail">
    <h2 class="title">공지사항</h2>

    <table class="info-table">
      <tr>
        <td class="label">제목</td>
        <td class="content">
          <span v-if="!noticeEditing">{{ noticeTitle }}</span>
          <input v-else type="text" v-model="noticeTitle" class="form-input" />
        </td>
      </tr>

      <tr>
        <td class="label">작성자</td>
        <td class="content">
          {{ userLoginId }}
        </td>
      </tr>

      <tr>
        <td class="label">등록일</td>
        <td class="content">
          {{ noticeCreatedAt }}
        </td>
      </tr>

      <tr class="content">
        <td class="label">내용</td>
        <td class="content">
          <div v-if="!noticeEditing" style="height: 400px; overflow-y: auto">{{ noticeContent }}</div>
          <textarea v-else v-model="noticeContent" class="form-textarea"></textarea>
        </td>
      </tr>

      <tr class="content" v-if="fileName || noticeEditing">
        <td class="label">첨부파일</td>
        <td class="content">
          <div v-if="!noticeEditing && fileName" id="preview" @click="downLoad">{{ fileName }}</div>
          <div v-else>
            <div v-if="fileName">
              <span>{{ fileName }}</span>
              <v-btn class="remove-file-button" @click="removeFile">파일 삭제</v-btn>
            </div>
            <input type="file" id="file-insert" @change="handleFileChange" />
          </div>
        </td>
      </tr>
    </table>
    <div class="button-group">
      <v-btn v-if="noticeEditing" class="save-button" @click="saveNotice">저장</v-btn>
      <v-btn v-else-if="isMyNotice" class="update-button" @click="noticeEditing = true">수정</v-btn>
      <v-btn class="delete-button" @click="deleteNotice" v-if="isMyNotice">삭제</v-btn>
      <v-btn class="cancel-button" @click="cancelEdit">{{ noticeEditing ? "취소" : "닫기" }}</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    noticeNo: Number,
  },
  data() {
    return {
      paction: this.action,
      pNoticeNo: this.noticeNo,
      noticeTitle: "",
      noticeContent: "",
      noticeCreatedAt: "",
      sessionLoginId: "",
      userLoginId: "",
      name: "",
      previewHtml: "",
      fileName: "",
      selectedFile: null,
      noticeEditing: false,
      fileToDelete: false,
    };
  },
  computed: {
    isMyNotice() {
      return this.sessionLoginId === this.userLoginId;
    },
  },
  mounted() {
    this.selectNotice();
  },
  methods: {
    selectNotice() {
      let params = new URLSearchParams();
      params.append("pNoticeNo", this.pNoticeNo);

      this.axios
        .post("/tAlert/selectNotice.do", params)
        .then((response) => {
          console.log(response.data);

          this.sessionLoginId = response.data.loginId;
          this.userLoginId = response.data.result.loginID;
          this.noticeCreatedAt = response.data.result.notice_created_at;
          this.noticeTitle = response.data.result.notice_title;
          this.noticeContent = response.data.result.notice_content;
          this.fileName = response.data.result.file_origin || "";
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      if (this.selectedFile) {
        this.fileName = this.selectedFile.name;
      }
    },
    removeFile() {
      this.selectedFile = null;
      this.fileName = "";
      // 서버에 기존 파일 삭제 요청을 보낼 수 있습니다.
    },
    saveNotice() {
      let formData = new FormData();
      formData.append("noticeTitle", this.noticeTitle);
      formData.append("noticeContent", this.noticeContent);
      formData.append("pNoticeNo", this.pNoticeNo);

      if (this.selectedFile) {
        formData.append("file", this.selectedFile);

        // 파일 삭제 요청
        this.axios
          .post("/tAlert/deleteNoticeFile.do", { pNoticeNo: this.pNoticeNo })
          .then((response) => {
            console.log(response.data);
            if (response.data.result > 0) {
              console.log("Existing file deleted successfully.");
            } else {
              console.log("No file to delete or error occurred.");
            }
          })
          .catch((error) => {
            console.error("Error deleting existing file:", error);
          });
      }

      this.axios
        .post("/tAlert/updateNotice.do", formData)
        .then((response) => {
          console.log(response.data);
          if (response.data.result > 0) {
            alert(response.data.resultMsg);
            this.noticeEditing = false;
            this.selectNotice(); // 다시 조회하여 최신 정보로 업데이트
          }
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    deleteNotice() {
      if (confirm("삭제하시겠습니까?")) {
        if (this.isMyNotice) {
          let params = new URLSearchParams();
          params.append("pNoticeNo", this.pNoticeNo);

          this.axios
            .post("/tAlert/deleteNotice.do", params)
            .then((response) => {
              if (response.data.result > 0) {
                alert(response.data.resultMsg);
                this.$emit("close-modal"); // 모달 닫기 이벤트 발생
              }
            })
            .catch((error) => {
              alert("에러! API 요청에 오류가 있습니다. " + error);
            });
        } else {
          alert("삭제할 수 없습니다");
        }
      }
    },
    cancelEdit() {
      if (this.noticeEditing) {
        this.selectNotice(); // 변경사항 무시하고 다시 조회하여 원래 정보로 복구
        this.noticeEditing = false;
      } else {
        this.$router.go(-1); // 취소 시 이전 페이지로 이동
      }
    },
    downLoad() {
      let params = new URLSearchParams();
      params.append("pNoticeNo", this.pNoticeNo);

      this.axios({
        url: "/tAlert/noticeFileDownload.do",
        data: params,
        method: "POST",
        responseType: "blob",
      }).then((response) => {
        let FILE = window.URL.createObjectURL(new Blob([response.data]));
        let docUrl = document.createElement("a");
        docUrl.href = FILE;
        docUrl.setAttribute("download", this.fileName);
        document.body.appendChild(docUrl);
        docUrl.click();
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
  max-width: 800px;
  margin: auto;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.info-table .label {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: center;
  border: 1px solid #ddd;
  width: 15%;
  padding: 8px;
}

.info-table .content {
  background-color: #ffffff;
  width: 85%;
  text-align: left;
  border: 1px solid #ddd;
  padding: 8px;
}

.info-table .full .content {
  width: 100%;
  text-align: left;
}

.info-table tr.full .content {
  text-align: left;
}

.form-input {
  width: 100%;
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
  height: 400px;
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
  resize: none;
}

.content-input {
  height: 400px;
  overflow-y: scroll;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.update-button,
.save-button,
.delete-button,
.cancel-button {
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.update-button {
  background-color: #407bff;
}

.update-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.save-button {
  background-color: #4caf50;
}

.save-button:hover {
  background-color: #66bb6a;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.delete-button {
  background-color: #d32f2f;
  margin: 0;
}

.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

.cancel-button {
  background-color: #686767;
  margin: 0;
}

.cancel-button:hover {
  background-color: #c2c2c2;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

.remove-file-button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 4px;
  padding: 8px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.remove-file-button:hover {
  background-color: #ece2e4;
  box-shadow: 0 4px 8px rgba(253, 192, 204, 0.2);
}

#preview {
  cursor: pointer;
  color: #407bff;
  text-decoration: underline;
  display: inline-block;
  margin-top: 10px;
}
</style>
