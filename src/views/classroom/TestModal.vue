<template>
  <div class="lecture-detail">
    <v-btn class="close-button" icon @click="$emit('close-modal')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    <h2 class="title">시험</h2>

    <!-- 객관식 -->
    <div class="question-container">
      <template v-for="question in sTestInfo" :key="question.test_no">
        <div class="form-label">{{ question.test_question }}</div>
        <v-radio-group v-model="testSubmit">
          <v-radio value="1">
            <template v-slot:label>
              {{ question.test_choice1 }}
            </template>
          </v-radio>
          <v-radio value="2">
            <template v-slot:label>
              {{ question.test_choice2 }}
            </template>
          </v-radio>
          <v-radio value="3">
            <template v-slot:label>
              {{ question.test_choice3 }}
            </template>
          </v-radio>
          <v-radio value="4">
            <template v-slot:label>
              {{ question.test_choice4 }}
            </template>
          </v-radio>
        </v-radio-group>
      </template>
    </div>
    <div class="button-group">
      <template v-if="paction === 'I'">
        <v-btn class="insert-button" @click="insertTest">등록</v-btn>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    courseNo: Number,
    testCategory: String,
  },
  data() {
    return {
      paction: this.action,
      SelectedCourseNo: this.courseNo,
      SelectedTestCategory: this.testCategory,
      createTest: [],
      sTestInfo: [],
      objectiveAnswers: {
        q1: null,
        q2: null,
      },
      subjectiveAnswers: {
        improvements: "",
      },
    };
  },
  mounted(){
    this.sCreateTest();
  },
  methods: {

    sCreateTest(){
      let testParams = new URLSearchParams();
      testParams.append("SelectedCourseNo", this.SelectedCourseNo);
      testParams.append("SelectedTestCategory", this.SelectedTestCategory);
      console.log("정체를밝혀랏 : ", this.SelectedTestCategory);
      console.log("너는누구냣: ", this.SelectedCourseNo);

      this.axios
      .post("/classroom/sCreateTest.do", testParams)
      .then((response) => {
        console.log("JSON좀봅시당: "+ JSON.stringify(response));

        this.sTestInfo = response.data.createTest;

        response.data.createTest.forEach(each =>{
          this.testQuestion = each.test_question;
          this.testChoice1 = each.test_choice1;
          this.testChoice2 = each.test_choice2;
          this.testChocie3 = each.test_choice3;
          this.testChoice4 = each.test_choice4;
          this.testScore = each.test_score;

        });
      })
    },
    insertTest() {},
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

.insert-button,
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
