<template>
  <div class="lecture-detail">
    <h2 class="title">건의사항</h2>

    <div class="form-group">
      <div class="form-label">글번호</div>
      <input
        type="text"
        name="title"
        class="form-input"
        disabled
        v-model="responseSuggestion.suggestion_no"
      />
    </div>
    <div class="form-group">
      <div class="form-label">작성자</div>
      <input
        type="text"
        name="author"
        class="form-input"
        disabled
        v-model="responseSuggestion.loginID"
      />
    </div>
    <div class="form-group">
      <div class="form-label">등록일</div>
      <input
        type="text"
        name="date"
        class="form-input"
        disabled
        v-model="responseSuggestion.suggestion_created_at"
      />
    </div>
    <div class="form-group">
      <div class="form-label">제목</div>
      <input
        type="text"
        name="title"
        class="form-input"
        disabled
        v-model="responseSuggestion.suggestion_title"
      />
    </div>
    <div class="form-group">
      <div class="form-label">내용</div>
      <textarea
        name="content"
        class="form-textarea"
        disabled
        v-model="responseSuggestion.suggestion_content"
      >
      </textarea>
    </div>
    <div class="form-group" v-if="responseSuggestion.file_no">
      <div class="form-label">첨부파일</div>
      <div
        id="preview"
        v-html="suggestionPreviewHtml"
        @click="download(responseSuggestion.file_no, suggestionFileName)"
      ></div>
    </div>
    <div class="button-group">
      <v-btn class="delete-button" @click="deleteSuggestion">건의삭제</v-btn>
    </div>
    <div class="form-group" v-if="action === 'U' || action === 'I'">
      <div class="form-label">답변</div>
      <textarea name="content" class="form-textarea" v-model="replyContent">
      </textarea>
    </div>
    <div class="form-group" v-else>
      <div class="form-label">답변</div>
      <textarea
        name="content"
        class="form-textarea"
        v-model="replyContent"
        disabled
      >
      </textarea>
    </div>
    <div class="form-group" v-if="responseReply.file_no">
      <div class="form-label">첨부파일</div>
      <div
        id="preview"
        v-html="replyPreviewHtml"
        @click="download(responseReply.file_no, replyFileName)"
      ></div>
    </div>
    <!-- 첨부파일 input 추가 -->

    
      <template v-if="action === 'I'">
        <form id="file-form" enctype="multipart/form-data">
          <input
            type="file"
            id="file-insert"
            name="file-insert"
            class="insert-button"
            @change="handleFileChange"
          />
          <v-btn class="insert-button" @click.prevent="deleteFile">첨부파일 삭제</v-btn>
          <v-btn class="insert-button" @click.prevent="insertSuggestion"
            >등록</v-btn
          >
        </form>
      </template>
      <template v-else-if="action === 'U'">
        <form id="file-form" enctype="multipart/form-data">
          <input
            type="file"
            id="file-insert"
            name="file-insert"
            @change="handleFileChange"
          />
        </form>
        <div class="button-group">
          <v-btn class="delete-button" @click.prevent="deleteFile">첨부파일 삭제</v-btn>
          <v-btn class="insert-button" @click.prevent="updateSuggestion">등록</v-btn>
        </div>
      </template>
      <template v-else>
        <div class="button-group">
          <v-btn class="update-button" @click="toggleUpdate">수정</v-btn>
          <v-btn class="delete-button" @click="deleteReply">답변삭제</v-btn>
        </div>
      </template>
    
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    selectedSuggestion: {
      suggestion_no: Number,
      suggestion_answered: String,
    },
  },
  mounted() {
    this.selectSuggestion();
  },
  data() {
    return {
      action: this.action,
      selectedSuggestion: this.selectedSuggestion,
      responseSuggestion: [],
      responseReply: [],
      selectedFile: null,
      removeFile: "N",
      replyContent: "",
      suggestionPreviewHtml: "",
      replyPreviewHtml: "",
      suggestionFileName: "",
      replyFileName: "",
    };
  },
  methods: {
    selectSuggestion() {
      let vm = this;

      let params = new URLSearchParams();
      params.append("suggestion_no", this.selectedSuggestion.suggestion_no);
      params.append(
        "suggestion_answered",
        this.selectedSuggestion.suggestion_answered
      );

      this.axios
        .post("/aSuggestion/select", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          this.responseSuggestion = response.data.suggestion;
          this.suggestionFileName = this.responseSuggestion.file_origin;
          this.suggestionPreviewHtml = this.previewHtml(
            response.data.suggestion
          );
          if (response.data.suggestionReply.suggestion_reply_no !== undefined) {
            this.responseReply = response.data.suggestionReply;
            this.replyContent = this.responseReply.suggestion_reply_content;
            this.replyFileName = this.responseReply.file_origin;
            this.replyPreviewHtml = this.previewHtml(
              response.data.suggestionReply
            );
            this.action = "";
          } else {
            this.action = "I";
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    updateSuggestion() {
      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);

      dataWithFile.append("suggestion_reply_content", this.replyContent);
      console.log(this.replyContent)
      dataWithFile.append(
        "suggestion_reply_no",
        this.responseReply.suggestion_reply_no
      );
      dataWithFile.append("removeFile", this.removeFile);

      if (this.selectedFile) {
        dataWithFile.append("file", this.selectedFile);
      }

      this.axios
        .post("/aSuggestion/reply/update", dataWithFile)
        .then(() => {
          this.$emit("close");
          this.$emit("searchList");
          this.action = "";
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    deleteReply() {
      let params = new URLSearchParams();
      params.append("suggestion_reply_no", this.responseReply.suggestion_reply_no);
      params.append("suggestion_no", this.responseSuggestion.suggestion_no);

      this.axios
        .post("/aSuggestion/reply/delete", params)
        .then(() => {
          alert("성공적으로 삭제되었습니다.");
          this.$emit("close");
          this.$emit("searchList");
          this.action = "";
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    deleteSuggestion() {
      let params = new URLSearchParams();
      params.append("suggestion_no", this.responseSuggestion.suggestion_no);

      this.axios
        .post("/aSuggestion/delete", params)
        .then(() => {
          alert("성공적으로 삭제되었습니다.");
          this.$emit("close");
          this.$emit("searchList");
          this.action = "";
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    insertSuggestion() {
      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);

      dataWithFile.append("suggestion_reply_content", this.replyContent);
      dataWithFile.append(
        "suggestion_no",
        this.selectedSuggestion.suggestion_no
      );
      if (this.selectedFile) {
        dataWithFile.append("file", this.selectedFile);
      }
      this.axios
        .post("/aSuggestion/reply/new", dataWithFile)
        .then(() => {
          this.$emit("close");
          this.$emit("searchList");
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
        this.action = "";
    },
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },
    deleteFile() {
      this.replyPreviewHtml = "";
      this.removeFile = "Y";
    },
    toggleUpdate(){
      this.action = "U";
    },
    previewHtml(suggestion) {
      if (suggestion.file_no) {
        let ext = suggestion.file_extension;
        if (
          ext.toLowerCase() == "jpg" ||
          ext.toLowerCase() == "jpeg" ||
          ext.toLowerCase() == "png" ||
          ext.toLowerCase() == "gif"
        ) {
          return (
            "<img src='" +
            suggestion.file_local_path +
            "' id 'imgFile' style='width:100px; height 100px;' />"
          );
        } else {
          return "<div>" + suggestion.file_origin + "</div>";
        }
      }
      return "";
    },
    download: function (fileNo, fileName) {
      let params = new URLSearchParams();
      params.append("file_no", fileNo);

      this.axios({
        url: "/aSuggestion/fileDownload",
        data: params,
        method: "POST",
        responseType: "blob",
      })
        .then((response) => {
          let FILE = window.URL.createObjectURL(new Blob([response.data]));
          let docUrl = document.createElement("a");
          docUrl.href = FILE;
          docUrl.setAttribute("download", fileName);
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
</style>
