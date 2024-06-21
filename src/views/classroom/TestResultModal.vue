<template>
  <div class="lecture-detail">
    <v-btn class="close-button" icon @click="$emit('close-modal')">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <h2 class="title">{{ SelectedTestCategory }}</h2>

    <form id="showing">
      <div class="question-container">
        <div v-for="(result, index) in showingResult" :key="result.test_no">
          <div class="form-label">{{ index + 1 }}. {{ result.test_question }} (점수: {{ result.question_score }})</div>
          <v-radio-group v-model="studentChoiced[index]" :key="index">
            <v-radio :color="isCorrect(studentChoiced[index], result.test_answer)" :label="result.test_choice1.toString()" value="1"></v-radio>
            <v-radio :color="isCorrect(studentChoiced[index], result.test_answer)" :label="result.test_choice2.toString()" value="2"></v-radio>
            <v-radio :color="isCorrect(studentChoiced[index], result.test_answer)" :label="result.test_choice3.toString()" value="3"></v-radio>
            <v-radio :color="isCorrect(studentChoiced[index], result.test_answer)" :label="result.test_choice4.toString()" value="4"></v-radio>
          </v-radio-group>
        </div>
      </div>

      <div class="button-group">
        <v-btn class="goBack-button" @click="goBack">나가기</v-btn>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    courseNo: Number,
    testCategory: String,
    testResultNo: Number
  },
  data() {
    return {
      paction: this.action,
      SelectedCourseNo: this.courseNo,
      SelectedTestCategory: this.testCategory,
      SelectedTestResultNo: this.testResultNo,
      showingResult: [],
      studentChoiced: []
    };
  },
  mounted() {
    this.viewResult();
  },
  methods: {
    viewResult() {
      let resultParams = new URLSearchParams();
      resultParams.append("SelectedCourseNo", this.SelectedCourseNo);
      resultParams.append("SelectedTestCategory", this.SelectedTestCategory);
      resultParams.append("SelectedTestResultNo", this.SelectedTestResultNo);

      this.axios
        .post("/classroom/sShowingTestResult.do", resultParams)
        .then(response => {
          console.log(JSON.stringify(response));
          this.showingResult = response.data.showingResult.filter(result =>
            result.course_no === this.SelectedCourseNo &&
            result.test_category === this.SelectedTestCategory
          );



          this.studentChoiced = this.showingResult.map(result => result.answer_selected);
        })
        .catch(error => {
          console.error("Error fetching test results: ", error);
          alert("시험 결과를 가져오는 중 오류가 발생했습니다.");
        });
    },
    goBack() {
      this.$router.go(-1);
      this.$nextTick(() => {
        window.location.reload();
      });
    },
    isCorrect(answerSelected, testAnswer, resultIndex) {
      if (answerSelected === testAnswer) {
        return "indigo-darken-4";
      } else if (this.studentChoiced[resultIndex] === testAnswer) {
        return "indigo-darken-4";
      } else {
        return "red-darken-4";
      }
},
    closeModal(){
      this.$emit('close-modal');
    }
  }
};
</script>

<style scoped>
.lecture-detail {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
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

.submit-button {
  padding: 10px 16px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.submit-button {
  background-color: #407bff;
}

.submit-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.close-button {
  position: absolute;
  top: 0; /* 상단 여백 조정 */
  right: 0; /* 오른쪽 여백 조정 */
  margin: 8px; /* 버튼과 모달의 경계 사이에 약간의 여백 추가 */
}

.question-container {
  margin-bottom: 20px;
}

.form-label {
  font-weight: bold;
  margin-bottom: 10px;
  word-wrap: break-word;
  white-space: pre-wrap;
  max-width: 100%; /* Adjust as necessary */
}

.v-radio-group {
  display: flex;
  flex-direction: column;
}

.v-radio {
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  word-wrap: break-word;
  white-space: pre-wrap;
}

</style>