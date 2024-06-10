<template>
  <v-container>
    <v-card class="lecture-detail">
      <h2 class="title">질문/답변조회</h2>

      <v-row>
        <v-col cols="12" sm="2" class="box1">
          <div class="form-group">
            <div class="form-label">질문번호</div>
            <input
              readonly
              type="text"
              name="SelectedQuestionNo"
              v-model="SelectedQuestionNo"
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
              name="questionCreatedAt"
              v-model="questionCreatedAt"
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
              name="questionTitle"
              v-model="questionTitle"
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
              name="questionContent"
              v-model="questionContent"
              class="form-textarea"
            />
          </div>
        </v-col>


        <template v-if="questionAnswered">
          <v-col cols="12" class="box1">
            <div class="form-group">
              <div class="form-label">답변</div>
              <textarea
                readonly
                type="text"
                name="questionReplyContent"
                v-model="questionReplyContent"
                class="form-textarea"
              />
            </div>
          </v-col>
        </template>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    action: String,
    sQuestionNo: Number,
  },
  data() {
    return {
      paction: this.action,
      SelectedQuestionNo: this.sQuestionNo,
      name: "",
      questionTitle: "",
      questionContent: "",
      questionCreatedAt: "",
      questionAnswered: "",
      questionReplyContent: "",
    };
  },
  mounted() {
    this.sQnaSelected();
    this.sQnaReplyContent();
  },
  methods: {

    sQnaSelected() {
      let params = new URLSearchParams();
      params.append("pSuggestionNo", this.pSuggestionNo);

      this.axios
        .post("/sAlert/sQnaSelected.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response.data);

          this.name = response.data.result.name;
          this.questionTitle = response.data.result.question_title;
          this.questionContent = response.data.result.question_content;
          this.questionCreatedAt = response.data.result.question_created_at;
          this.questionAnswered = response.data.result.reply_no;
        })
        .catch(function (error) {
          alert("sQnaSelected에서 오류나수다 " + error);
        });
    },

    sQnaReplyContent() {
      let params = new URLSearchParams();
      params.append("SQuestionNo", this.SQuestionNo);

      this.axios
        .post("/sAlert/sQnaSelectedReply.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response.data);

          this.QnaContentReply =
            response.data.result.question_reply_content;
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