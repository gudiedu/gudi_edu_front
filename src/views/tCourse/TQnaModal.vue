<template>
  <div class="lecture-detail">
    <h2 class="title">질의응답</h2>

    <table class="info-table">
      <tr>
        <td class="label">글제목</td>
        <td class="content" colspan="3">{{ questionTitle }}</td>
      </tr>
      <tr>
        <td class="label">작성자</td>
        <td class="content">{{ name }}</td>
        <td class="label">등록일</td>
        <td class="content">{{ question_created_at }}</td>
      </tr>
      <tr class="full">
        <td class="content" colspan="4">{{ questionContent }}</td>
      </tr>
    </table>

    <v-table class="dashboard-table">
      <thead>
        <tr>
          <th class="col-number">답변번호</th>
          <th class="col-content">답변내용</th>
          <th class="col-author">답변작성자</th>
          <th class="col-date">등록일</th>
        </tr>
      </thead>
      <tbody>
        <template v-if="listdata.length > 0">
          <template v-for="item in listdata" :key="item.reply_no">
            <tr>
              <td style="text-align: center">
                {{ item.reply_no }}
              </td>
              <!--<td @click="questionModifyFile(item.question_no)">-->

              <!--<td @click="replyModify(item.reply_title)">-->

              <td>{{ item.reply_content }}</td>
              <td style="text-align: center">{{ item.name }}</td>
              <td style="text-align: center">
                {{ formattedDate(item.reply_created_at) }}
              </td>
            </tr>
          </template>
        </template>
        <template v-else>
          <tr>
            <td colspan="4">답변이 없습니다.</td>
          </tr>
        </template>
      </tbody>
    </v-table>

    <div class="form-group">
      <div class="form-label">답변</div>
      <textarea name="content" class="form-textarea"></textarea>
    </div>

    <!-- CKEditor 사용 -->
    <!-- 첨부파일 input 추가 -->

    <div class="button-group">
      <template v-if="totalCnt > 0">
        <v-btn class="update-button" @click="updateQuestion">수정</v-btn>
        <v-btn class="delete-button" @click="deleteQuestion">삭제</v-btn>
      </template>
      <template v-else>
        <v-btn class="insert-button" @click="insertQuestion">등록</v-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TQuestionsAndAnswersModal",
  props: {
    action: String,
    questionTitle: String,
    questionContent: String,
    question_created_at: String,
    name: String,
    reply_no: String,
    question_no: String,
  },
  data() {
    return {
      listdata: [],
      paction: this.action,
    };
  },
  mounted() {
    this.selectQuestion();
  },
  methods: {
    formattedDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    updateQuestion() {},
    deleteQuestion() {},
    insertQuestion() {},
    selectQuestion() {
      console.log(this.question_no, this.reply_no);
      this.axios
        .get("/tCourse/listquestionreply.do", {
          params: {
            question_no: this.question_no,
            reply_no: this.reply_no,
          },
        })
        .then((response) => {
          this.listdata = response.data.listdata;
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
  flex-direction: center;
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-input {
  flex: 1; /* 변경: 남은 공간을 입력 필드에 할당 */
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.form-textarea {
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
  height: 200px;
  resize: vertical;
}

/* 새로운 answer-box 스타일 */
.answer-box {
  padding: 16px;
  background-color: #f9f9f9; /* 배경 색상을 약간 회색으로 설정 */
  border: 1px solid #ddd; /* 연한 테두리 설정 */
  border-radius: 8px; /* 모서리를 둥글게 설정 */
  margin-top: 20px;
}

.answer-box .form-group {
  margin-bottom: 10px;
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
  width: 15%; /* 레이블 셀의 너비를 20%로 설정 */
}

.info-table .content {
  background-color: #ffffff;
  width: 40%; /* 내용 셀의 너비를 40%로 설정 */
  text-align: left;
  border: 1px solid #ddd;
  padding: 8px;
}

.info-table .full .content {
  width: 100%;
}

.info-table tr.full .content {
  text-align: left;
}

.dashboard-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
  text-align: center !important;
}

.dashboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
/* 열 너비 조정 */
.col-number {
  width: 10%;
  text-align: center;
}

.col-content {
  width: 55%;
  text-align: center;
}

.col-author {
  width: 15%;
  text-align: center;
}

.col-date {
  width: 20%;
  text-align: center;
}
</style>
