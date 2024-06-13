<template>
  <v-container>
    <v-card class="lecture-detail">
       <v-btn class="close-button" icon @click="$emit('close-modal')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
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
              name="qName"
              v-model="qName"
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
      </v-row>
      <v-divider></v-divider>
    <v-table class="dashboard-table">
      <template v-if="replyNo > 0">
        <tbody class="reply-section">
          <tr class="reply-item">
            <th>작성자</th>
            <th>답변일</th>
            <th>답변내용</th>
            </tr>
            <template v-for="reply in QnaContentReply" :key="reply.replyNo">
            <tr class="reply-item">
              <td>{{ reply.name }}</td>
              <td>{{ reply.reply_created_at }}</td>
              <td>{{ reply.reply_content }}</td>
            </tr>
          </template>
        </tbody>
      </template>
      <template v-else>
        <tbody>
          <tr style="text-align: center">
            <td colspan="2">아직 답변되지 않았습니다.</td>
          </tr>
        </tbody>
      </template>
    </v-table>
    </v-card>
  </v-container>
  <div class="button-group">
      <template v-if="replyNo == 0">
        <v-btn class="delete-button" @click="sQnaDelete">삭제</v-btn>
      </template>
  </div>
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
      qName: "",
      questionTitle: "",
      questionContent: "",
      questionCreatedAt: "",
      questionAnswered: "",
      QnaContentReply: [],
      sQnaSelectedReply: [],
      replyNo: 0,
      replyContent:"",
      replyCreatedAt:"",

    };
  },
  mounted() {
    this.sQnaSelected();
    //this.sQnaReplyContent();
  },
  methods: {

    sQnaSelected() {
      let params = new URLSearchParams();
      params.append("SelectedQuestionNo", this.SelectedQuestionNo);
      //params.append("replyNo", this.reply_no);


      this.axios
      .post("/sAlert/sQnaSelected.do", params)
      .then((response) => {
        console.log("JSON.stringify(response) : " + JSON.stringify(response));
        console.log(response.data);
        
        
        
        this.questionTitle = response.data.result.question_title;
        this.qName = response.data.result.name; // 질문 작성자 이름
        this.questionContent = response.data.result.question_content;
        this.questionCreatedAt = response.data.result.question_created_at;
        
        
        this.QnaContentReply = response.data.sQnaSelectedReply; // 배열을 직접 할당
        // console.log("this.questionTitle: ", this.questionTitle);

        response.data.sQnaSelectedReply.forEach(reply => {
          this.replyNo = reply.reply_no;
          this.replyContent = reply.reply_content;
          this.replyCreatedAt = reply.reply_created_at;

        });

        console.log("QnaContentReply: ", this.QnaContentReply[0]);
        console.log("1st replyContent: ", this.replyContent);
        console.log("1st replyNo: ", this.replyNo);
        alert("this.replyNo: " + this.replyNo);
        
        })
        .catch(function (error) {
          alert("sQnaSelected에서 오류 " + error);
        });
    },

    sQnaDelete() {
      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("SelectedQuestionNo", this.SelectedQuestionNo);
      
      console.log("this.SelectedQuestionNo", this.SelectedQuestionNo);

      this.axios
        .post("/sAlert/sQnaDelete.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          if (response.data.result > 0) {
            alert(response.data.resultMsg);
            this.$emit("close-modal"); // 모달 닫기 이벤트 발생
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });


    },

    // closeModal(){
    //   this.$emit('close-modal');
    // },
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
  max-width: 1500px;
  margin: auto;
}

.close-button {
  position: absolute;
  top: 16px;
  right: 16px;
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
.dashboard-table {
  width: 100%;
  border-collapse: collapse;
}

.reply-section {
  border-bottom: 2px solid #ddd;
  margin-bottom: 20px;
}

.reply-section th, .reply-section td {
  padding: 8px;
  text-align: left;
}

.reply-section th {
  background-color: #f2f2f2;
}

.reply-section tr:nth-child(even) th {
  background-color: #e6e6e6;
}

.reply-section tr {
  border-bottom: 1px solid #ddd;
}

.reply-section tr:last-child {
  border-bottom: none;
}

tbody tr:not(.reply-section) {
  text-align: center;
}

tbody tr:not(.reply-section) td {
  text-align: center;
  padding: 16px;
  border: 1px solid #ddd;
}

tbody th {
  text-align: center;
}
.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.delete-button,
.insert-button{
  /* padding: 10px 16px; */
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.insert-button,
.goBack-button {
  background-color: #407bff;
}

.insert-button:hover,
.goBack-button:hover {
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