<template>
  <v-container>
    <div class="lecture-detail">
      <h2 class="title">공지사항</h2>
      <v-row>
        <v-col cols="12" sm="2" class="box1">
          <template v-if="paction !== 'I'">
            <div class="form-group">
              <div class="form-label">글번호</div>
              <input
                type="text"
                name="title"
                class="form-input"
                v-model="notice_no"
                disabled
              />
            </div>
          </template>
        </v-col>
        <v-col cols="12" sm="5" class="box1">
          <template v-if="paction !== 'I'">
            <div class="form-group">
              <div class="form-label">작성자</div>
              <input
                type="text"
                name="date"
                class="form-input"
                :value="loginID"
                disabled
              />
            </div>
          </template>
        </v-col>
        <v-col cols="12" sm="5" class="box1">
          <template v-if="paction !== 'I'">
            <div class="form-group">
              <div class="form-label">등록일</div>
              <input
                type="text"
                name="title"
                class="form-input"
                disabled
                :value="notice_created_at"
              />
            </div>
          </template>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" class="box1">
          <template v-if="paction === 'I' || paction === 'U'">
            <div class="form-group">
              <div class="form-label">제목</div>
              <input
                type="text"
                name="author"
                class="form-input"
                v-model="notice_title"
              />
            </div>
          </template>
          <template v-else>
            <div class="form-group">
              <div class="form-label">제목</div>
              <input
                type="text"
                name="author"
                class="form-input"
                v-model="notice_title"
                disabled
              />
            </div>
          </template>
        </v-col>
      </v-row>
      <template v-if="paction === 'I' || paction === 'U'">
        <v-row>
          <v-col cols="12" sm="12" class="box1">
            <div class="form-group">
              <div class="form-label">내용</div>
              <textarea
                name="content"
                class="form-textarea"
                v-model="notice_content"
              >
              </textarea>
            </div>
          </v-col>
        </v-row>
        <div class="form-group" v-if="fileName">
          <div class="form-label">첨부파일</div>
          <v-row>
            <v-col cols="12" sm="3" class="box1">
              <div id="preview" v-html="previewHtml" @click="download"></div>
            </v-col>
            <div class="x-box" @click.prevent="deleteFile">X</div>
          </v-row>
        </div>
      </template>
      <template v-else>
        <v-row>
          <v-col cols="12" sm="12" class="box1">
            <div class="form-group">
              <div class="form-label">내용</div>
              <textarea
                name="content"
                class="form-textarea"
                v-model="notice_content"
                disabled
              >
              </textarea>
            </div>
          </v-col>
        </v-row>
        <div class="form-group" v-if="fileName">
          <div class="form-label">첨부파일</div>
          <v-row>
            <v-col cols="12" sm="3" class="box1">
              <div id="preview" v-html="previewHtml" @click="download"></div>
            </v-col>
          </v-row>
        </div>
      </template>
      <div class="button-group">
        <template v-if="paction === 'I'">
          <form id="file-form" class="file-form" enctype="multipart/form-data">
            <input
              type="file"
              id="file-insert"
              name="file-insert"
              class="file-insert"
              @change="handleFileChange"
            />
          </form>
          <v-btn
            class="insert-button"
            @click.prevent="insertNotice(notice_title, notice_content)"
            >등록</v-btn
          >
        </template>
        <template v-else-if="paction === 'U'">
          <form id="file-form" class="file-form" enctype="multipart/form-data">
            <input
              type="file"
              id="file-insert"
              name="file-insert"
              class="file-insert"
              @change="handleFileChange"
            />
          </form>
          <v-btn
            class="insert-button"
            @click.prevent="
              updateNotice(notice_no, notice_title, notice_content)
            "
            >수정</v-btn
          >
        </template>
        <template v-else>
          <v-btn class="update-button" @click="changeNotice(notice_no)"
            >수정</v-btn
          >
          <v-btn class="delete-button" @click="deleteNotice(notice_no)"
            >삭제</v-btn
          >
        </template>
      </div>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    action: String,
    notice_title: String,
    loginID: String,
    notice_content: String,
    notice_created_at: String,
    notice_no: Number,
    previewHtml: String,
    fileName: String,
  },
  data() {
    return {
      paction: this.action,
      notice_title: this.notice_title,
      loginID: this.loginID,
      notice_content: this.notice_content,
      notice_created_at: this.notice_created_at,
      notice_no: this.notice_no,
      selectedFile: null,
      removeFile: "N",
      fileName: this.fileName,
      previewHtml: this.previewHtml,
    };
  },
  mounted() {},
  methods: {
    updateNotice(notice_no, notice_title, notice_content) {
      let vm = this;

      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("notice_title", notice_title);
      dataWithFile.append("notice_content", notice_content);
      dataWithFile.append("notice_no", notice_no);
      dataWithFile.append("removeFile", this.removeFile);

      if (this.selectedFile) {
        dataWithFile.append("file", this.selectedFile);
      }
      console.log(dataWithFile.get("file"));

      this.axios
        .post("/aAlert/notice/update", dataWithFile)
        .then(() => {
          this.$emit("close");
          this.$emit("searchList");
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    changeNotice() {
      this.paction = "U";
    },
    deleteNotice(notice_no) {
      let vm = this;

      let params = new URLSearchParams();
      params.append("notice_no", notice_no);

      this.axios
        .post("/aAlert/notice/delete", params)
        .then(() => {
          alert("성공적으로 삭제되었습니다.");
          this.$emit("close");
          this.$emit("searchList");
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    insertNotice(notice_title, notice_content) {
      let vm = this;

      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("notice_title", notice_title);
      dataWithFile.append("notice_content", notice_content);
      if (this.selectedFile) {
        dataWithFile.append("file", this.selectedFile);
      }
      this.axios
        .post("/aAlert/notice/new", dataWithFile)
        .then(() => {
          this.$emit("close");
          this.$emit("searchList");
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    deleteFile() {
      this.previewHtml = "";
      this.removeFile = "Y";
      this.fileName = null;
    },
    download: function () {
      let params = new URLSearchParams();
      params.append("notice_no", this.notice_no);

      this.axios({
        url: "/aAlert/notice/fileDownload",
        data: params,
        method: "POST",
        responseType: "blob",
      })
        .then((response) => {
          let FILE = window.URL.createObjectURL(new Blob([response.data]));
          let docUrl = document.createElement("a");
          docUrl.href = FILE;
          docUrl.setAttribute("download", this.fileName);
          document.body.appendChild(docUrl);
          docUrl.click();
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
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
.x-box {
  cursor: pointer;
}
.file-form {
  margin-right: auto;
}
</style>
