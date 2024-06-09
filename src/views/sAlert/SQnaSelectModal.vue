<template>
  <div class="modal">
    <h2 class="title">질문/답변 조회</h2>
    <!--Modal Selected Question Content-->
      <div class="selected-question">
        <v-table class="question">
          <template v-for="item in selectedListQna" :key="item.question_no">
            <tr>
              <th>과목</th>
              <td> {{ item.course_name }} </td>
            </tr>
            <tr>
              <th>등록일</th>
              <td> {{ itme.question_created_at }}</td>
            </tr>
            <tr>
              <th>제목</th>
              <td>{{ item.question_title }}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{{ item.question_content }}</td>
            </tr>
          </template>
        </v-table>
      </div> <!--This is the end of Selected Question div-->
      <!--This is the start of the reply content area -->
      <div class="qna-reply">
        <template v-for="item in selectedListQna" :key="item.question_no">
            <tr>
              <th>작성자</th>
              <td> {{ item.name }} </td>
            </tr>
            <tr>
              <th>등록일</th>
              <td> {{ itme.reply_created_at }}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td>{{ item.reply_content }}</td>
            </tr>
          </template>
      </div> <!--the end of div.qna-reply-->

  </div> <!--the end of div.modal-->
</template>

<script>
export default{
  props: {
    isSelectedModalOpen: Boolean,
    sQuestionNo: Number,
    action: String,
  },
  data(){
    return{
      isModalOpen: this.isSelectedModalOpen,
      selectedListQna: [],
      sqno: this.sQuestionNo,
      question_title: "",
      question_content: "",
      question_created_at: "",
      reply_no: "",
      reply_content: "",
      name: "",
    }
  },
  mounted(){
    this.qna_selected_list(); // method
  },
  methods: {
    qna_selected_list : function(){
      alert("선택한 질의응답 조회해보잰 하맨");

      let selectedParams = new URLSearchParams();
      selectedParams.append("sqno", this.sqno);

      this.axios
        .post("/sAlert/sSelectedQna.do", selectedParams)
        .then((response) => {
          console.log(JSON.stringify(response));
          console.log(response.data );

          // 과목, 등록일, 제목, 내용
          this.course_name = response.data.result.course_name;
          this.question_created_at = response.data.result.question_created_at;
          this.question_title = response.data.result.question_title;
          this.question_content = response.data.result.question_content;
          this.reply_no = response.data.result.reply_no;
          this.reply_content = response.data.result.reply_content;
          this.name = response.data.result.name;

        })

    }

  },

}

</script>
<style scoped>
/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* 모달 배경색 및 투명도 조절 */
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Modal Content */
.selected-question {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* 그림자 추가 */
}

/* Table Styles */
.v-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.v-table th,
.v-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd; /* 테이블 셀 아래 경계선 스타일 */
}

/* Button Style */
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}
</style>
