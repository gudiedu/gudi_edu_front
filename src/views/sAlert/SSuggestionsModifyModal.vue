<template>
  <v-container>
    <v-card class="lecture-detail">
      <h2 class="title">건의사항</h2>

      <v-row>
        <v-col cols="12" sm="2" class="box1">
          <div class="form-group">
            <div class="form-label">글번호</div>
            <input
              readonly
              type="text"
              name="pSuggestionNo"
              v-model="pSuggestionNo"
              class="form-input"
            />
          </div>
        </v-col>

        <v-col cols="12" sm="5" class="box1">
          <div class="form-group">
            <div class="form-label">작성자</div>
            <input
              readonly
              type="text"
              name="name"
              v-model="name"
              class="form-input"
            />
          </div>
        </v-col>

        <v-col cols="12" sm="5" class="box1">
          <div class="form-group">
            <div class="form-label">등록일</div>
            <input
              readonly
              type="text"
              name="suggestionCreatedAt"
              v-model="suggestionCreatedAt"
              class="form-input"
            />
          </div>
        </v-col>

        <v-col cols="12" class="box1">
          <div class="form-group">
            <div class="form-label">제목</div>
            <input
              readonly
              type="text"
              name="suggestionTitle"
              v-model="suggestionTitle"
              class="form-input"
            />
          </div>
        </v-col>

        <v-col cols="12" class="box1">
          <div class="form-group">
            <div class="form-label">내용</div>
            <textarea
              readonly
              type="text"
              name="suggestionContent"
              v-model="suggestionContent"
              class="form-textarea"
            />
          </div>
        </v-col>

        <v-col cols="12" class="box1">
          <div class="form-label">첨부파일</div>
          <div id="preview" v-html="previewHtml" @click="downLoad"></div>
        </v-col>

        <template v-if="suggestionAnswered">
          <v-col cols="12" class="box1">
            <div class="form-group">
              <div class="form-label">답변</div>
              <textarea
                readonly
                type="text"
                name="suggestionContentReply"
                v-model="suggestionContentReply"
                class="form-textarea"
              />
            </div>
          </v-col>

          <v-col cols="12" class="box1">
            <div class="form-label">첨부파일</div>
            <div id="preview" v-html="previewHtml2" @click="downLoad2"></div>
          </v-col>
        </template>
      </v-row>
    </v-card>

    <v-card-actions class="goBackButton">
      <v-btn color="primary" @click="goBack">뒤로가기</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script>
export default {
  props: {
    action: String,
    suggestionNo: Number,
    // selectedSuggestion: Object,
  },
  data() {
    return {
      paction: this.action,
      pSuggestionNo: this.suggestionNo,
      name: "",
      suggestionCreatedAt: "",
      suggestionTitle: "",
      suggestionContent: "",
      suggestionAnswered: "",
      suggestionContentReply: "",
      //suggestionAnswered: this.selectedSuggestion.suggestion_answered === true,
    };
  },
  mounted() {
    this.selectSuggestion();
    this.selectSuggestionReply();
  },
  methods: {
    goBack() {
      // 뒤로가기 로직 구현
      this.$router.go(-1);
    },

    selectSuggestion() {
      let params = new URLSearchParams();
      params.append("pSuggestionNo", this.pSuggestionNo);

      this.axios
        .post("/sAlert/sSelectSuggestion.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response.data);

          this.name = response.data.result.name;
          this.suggestionCreatedAt = response.data.result.suggestion_created_at;
          this.suggestionTitle = response.data.result.suggestion_title;
          this.suggestionContent = response.data.result.suggestion_content;
          this.suggestionAnswered = response.data.result.suggestion_answered;

          this.ext = response.data.result.file_extension;

          //response.data.result.file_name //파일이름
          //response.data.result.logical_path //논리경로
          //response.data.result.phygical_path //물리경로
          //response.data.result.file_size //파일크기
          //response.data.result.file_ext //파일확장자

          //파일 이미지 보여주거나, 파일 이름 보여주기
          if (
            response.data.result.file_origin === "" ||
            response.data.result.file_origin === null
          ) {
            this.previewHtml = "";
            this.fileName = "";
          } else {
            this.previewHtml = response.data.result.file_origin;
            this.fileName = response.data.result.file_origin;

            let ext = response.data.result.file_extension;

            if (
              ext.toLowerCase() == "jpg" ||
              ext.toLowerCase() == "jpeg" ||
              ext.toLowerCase() == "png" ||
              ext.toLowerCase() == "gif"
            ) {
              this.previewHtml =
                "<img src='" +
                response.data.result.file_local_path +
                "' id 'imgFile' style='width:100px; height 100px;' />";
            } else {
              this.previewHtml = response.data.result.file_origin;
            }
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    selectSuggestionReply() {
      let params = new URLSearchParams();
      params.append("pSuggestionNo", this.pSuggestionNo);

      this.axios
        .post("/sAlert/sSelectSuggestionReply.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response.data);

          this.suggestionContentReply =
            response.data.result.suggestion_reply_content;

          this.ext = response.data.result.file_extension;

          //response.data.result.file_name //파일이름
          //response.data.result.logical_path //논리경로
          //response.data.result.phygical_path //물리경로
          //response.data.result.file_size //파일크기
          //response.data.result.file_ext //파일확장자

          //파일 이미지 보여주거나, 파일 이름 보여주기
          if (
            response.data.result.file_origin === "" ||
            response.data.result.file_origin === null
          ) {
            this.previewHtml2 = "";
            this.fileName = "";
          } else {
            this.previewHtml2 = response.data.result.file_origin;
            this.fileName = response.data.result.file_origin;

            let ext = response.data.result.file_extension;

            if (
              ext.toLowerCase() == "jpg" ||
              ext.toLowerCase() == "jpeg" ||
              ext.toLowerCase() == "png" ||
              ext.toLowerCase() == "gif"
            ) {
              this.previewHtml2 =
                "<img src='" +
                response.data.result.file_local_path +
                "' id 'imgFile' style='width:100px; height 100px;' />";
            } else {
              this.previewHtml2 = response.data.result.file_origin;
            }
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    downLoad: function () {
      let params = new URLSearchParams();
      params.append("pSuggestionNo", this.pSuggestionNo);

      this.axios({
        url: "/sAlert/suggestionFileDownload.do",
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
        docUrl.setAttribute("download", this.fileName);
        document.body.appendChild(docUrl); //만든 a태그를 끼어넣어
        docUrl.click(); //강제로 클릭하게 만들어 //url을 클릭하면 다운로드가 됨
        //console.log('FILE : ' + FILE)
      });
    },

    downLoad2: function () {
      let params = new URLSearchParams();
      params.append("pSuggestionNo", this.pSuggestionNo);

      this.axios({
        url: "/sAlert/suggestionReplyFileDownload.do",
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
        docUrl.setAttribute("download", this.fileName);
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
  max-width: 800px;
  margin: auto;
}

.title {
  font-size: 22px;
  font-weight: 600;
  color: #2c3e50;
}

.form-group {
  display: flex;
  flex-direction: column;
  /* margin-bottom: 16px; */
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

.goBackButton {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
</style>
