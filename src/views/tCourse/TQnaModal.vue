<template>
  <div class="lecture-detail">
    <h2 class="title">질의응답</h2>

    <table class="info-table">
      <tr>
        <td class="label">글제목</td>
        <td class="content" colspan="3">{{ question_title }}</td>
      </tr>
      <tr>
        <td class="label">작성자</td>
        <td class="content">{{ name }}</td>
        <td class="label">등록일</td>
        <td class="content">{{ question_created_at }}</td>
      </tr>
      <tr class="full">
        <td class="content" colspan="4">
          <div class="content-scroll">{{ question_content }}</div>
        </td>
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
          <template v-for="(item, index) in listdata" :key="item.reply_no">
            <tr @click="flag_changed(true, item.reply_no)" :class="{ selected: reply_num === item.reply_no, 'non-selected': reply_num !== item.reply_no }">
              <td style="text-align: center">
                {{ index + 1 }}
                <!-- 여기서 index를 사용합니다 -->
              </td>
              <td>{{ item.reply_content }}</td>
              <td style="text-align: center">{{ item.name }}</td>
              <td style="text-align: center">
                {{ item.reply_created_at }}
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
      <textarea name="content" class="form-textarea content-scroll" v-model="reply_content"></textarea>
    </div>

    <!-- CKEditor 사용 -->
    <!-- 첨부파일 input 추가 -->

    <div class="button-group">
      <template v-if="this.flag_seleted">
        <v-btn class="update-button" @click="updateReply">수정</v-btn>
        <v-btn class="delete-button" @click="deleteReply">삭제</v-btn>
        <v-btn class="cancel-button" @click="flag_changed(false)">취소</v-btn>
      </template>
      <template v-else>
        <v-btn class="insert-button" @click="insertReply">등록</v-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "TQuestionsAndAnswersModal",
  props: {
    action: String,
    question_title: String,
    question_content: String,
    question_created_at: String,
    name: String,
    question_no: Number,
    loginID: String,
    loginNM: String,
  },
  data() {
    return {
      listdata: [],
      paction: this.action,
      flag_seleted: false,
      reply_num: null,
      reply_no: this.reply_no,
      reply_content: "",
      reply_created_at: "",
      course_no: 0,
    };
  },
  mounted() {
    this.selectQuestion();
    console.log(name);
  },
  methods: {
    flag_changed(stat, reply_no) {
      this.reply_num = stat ? reply_no : null;
      this.flag_seleted = stat;
      if (stat) {
        const selectedReply = this.listdata.find((item) => item.reply_no === reply_no);
        this.reply_content = selectedReply ? selectedReply.reply_content : "";
      } else {
        this.reply_content = "";
      }
    },

    insertReply() {
      this.axios
        .post("/tCourse/insertquestionreply.do", {
          question_no: this.question_no,
          loginID: this.loginID,
          name: this.loginNM,
          reply_content: this.reply_content,
          reply_created_at: this.reply_created_at,
          course_no: this.course_no,
        })
        .then((response) => {
          if (response.data.result >= 0) {
            alert(response.data.resultMsg);
            // 필요한 경우 추가 후 목록을 갱신합니다.
            this.selectQuestion();
            this.reply_content = "";
          } else {
            alert(response.data.resultMsg);
          }
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    updateReply() {
      this.axios
        .post("/tCourse/updatequestionreply.do", {
          reply_no: this.reply_num,
          reply_content: this.reply_content,
          question_no: this.question_no,
        })
        .then((response) => {
          if (response.data.result >= 0) {
            alert(response.data.resultMsg);
            this.selectQuestion();
            this.flag_changed(false); // 수정 완료 후 상태 초기화
          } else {
            alert(response.data.resultMsg);
          }
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    deleteReply() {
      console.log("Deleting reply with reply_no:", this.reply_num);
      this.axios
        .post("/tCourse/deletequestionreply.do", {
          reply_no: this.reply_num,
        })
        .then((response) => {
          if (response.data.result >= 0) {
            alert(response.data.resultMsg);
            // 필요한 경우 삭제 후 목록을 갱신합니다.
            this.selectQuestion();
          } else {
            alert(response.data.resultMsg);
          }
        })
        .catch((error) => {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    selectQuestion() {
      console.log(this.question_no);
      this.axios
        .get("/tCourse/listquestionreply.do", {
          params: {
            question_no: this.question_no,
          },
        })
        .then((response) => {
          this.listdata = response.data.listdata.map((reply) => {
            console.log(reply);
            // 날짜에 "수정됨"을 추가
            if (reply.is_updated) {
              reply.reply_created_at += " (수정됨)";
            }
            return reply;
          });
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
.insert-button,
.cancel-button {
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

.cancel-button {
  background-color: #686767;
  margin: 0;
}

.cancel-button:hover {
  background-color: #c2c2c2;
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
  height: 200px;
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

.selected {
  background-color: #f1f1f1;
}
.non-selected {
  background-color: none;
}
.content-scroll {
  height: 200px;
  overflow-y: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* Internet Explorer 10+ */
}

.content-scroll::-webkit-scrollbar {
  display: none; /* Safari and Chrome */
}
</style>
