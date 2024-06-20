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
                v-model="noticeNo"
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
                :value="loginId"
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
                :value="noticeCreatedAt"
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
                v-model="noticeTitle"
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
                v-model="noticeTitle"
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
                v-model="noticeContent"
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
                v-model="noticeContent"
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
            @click.prevent="insertNotice(noticeTitle, noticeContent)"
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
            @click.prevent="updateNotice(noticeNo, noticeTitle, noticeContent)"
            >수정</v-btn
          >
        </template>
        <template v-else>
          <v-btn class="update-button" @click="changeNotice(noticeNo)"
            >수정</v-btn
          >
          <v-btn class="delete-button" @click="deleteNotice(noticeNo)"
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
    noticeTitle: String,
    loginId: String,
    noticeContent: String,
    noticeCreatedAt: String,
    noticeNo: Number,
    previewHtml: String,
    fileName: String,
  },
  data() {
    return {
      paction: this.action,
      noticeTitle: this.noticeTitle,
      loginId: this.loginId,
      noticeContent: this.noticeContent,
      noticeCreatedAt: this.noticeCreatedAt,
      noticeNo: this.noticeNo,
      selectedFile: null,
      /** @vue-data {String} removeFile - 첨부파일 삭제 여부 */
      removeFile: "N",
      /** @vue-data {String} fileName - 원본 파일명 */
      fileName: this.fileName,
      /** @vue-data {String} previewHtml - 이미지 미리보기 HTML 코드 */
      previewHtml: this.previewHtml,
    };
  },
  mounted() {},
  methods: {
    /**
     * 공지사항 수정 메서드
     * @param {String} noticeNo - 공지사항 번호
     * @param {String} noticeIitle - 공지사항 제목
     * @param {String} noticeContent - 공지사항 본문
     */
    updateNotice(noticeNo, noticeTitle, noticeContent) {
      let vm = this;

      if (noticeTitle === "" || noticeTitle === undefined) {
        alert("제목을 입력해주세요");
        return;
      }
      if (noticeContent === "" || noticeContent === undefined) {
        alert("본문을 입력해주세요");
        return;
      }

      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("notice_title", noticeTitle);
      dataWithFile.append("notice_content", noticeContent);
      dataWithFile.append("notice_no", noticeNo);
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
    /**
     * 공지사항 삭제 메서드
     * @param {string} noticeNo - 공지사항 번호
     */
    deleteNotice(noticeNo) {
      let vm = this;

      let params = new URLSearchParams();
      params.append("notice_no", noticeNo);

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
    /**
     * 공지사항 작성 메서드
     * @param {string} noticeTitle - 공지사항 제목
     * @param {string} noticeContent - 공지사항 본문
     */
    insertNotice(noticeTitle, noticeContent) {
      let vm = this;

      if (noticeTitle === "" || noticeTitle === undefined) {
        alert("제목을 입력해주세요");
        return;
      }
      if (noticeContent === "" || noticeContent === undefined) {
        alert("본문을 입력해주세요");
        return;
      }

      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("notice_title", noticeTitle);
      dataWithFile.append("notice_content", noticeContent);
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
    /**
     * 첨부파일 입력 감지 메서드
     */
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    /**
     * 첨부파일 삭제 메서드
     */
    deleteFile() {
      this.previewHtml = "";
      this.removeFile = "Y";
      this.fileName = null;
    },
    checkNotice(noticeTitle, noticeContent) {},
    /**
     * 첨부파일 다운로드 메서드
     */
    download: function () {
      let params = new URLSearchParams();
      params.append("notice_no", this.noticeNo);

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
