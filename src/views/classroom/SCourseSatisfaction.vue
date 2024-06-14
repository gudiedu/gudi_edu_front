<template>
  <div class="lecture-detail">
    <h2 class="title">{{ courseName }}_{{ surveyName }}</h2>

    <!-- 객관식 및 주관식 -->
    <div class="form-group">
      <template
        v-for="question in surveyQuestions"
        :key="question.survey_question_no"
      >
        <div class="form-label">
          {{ question.survey_question_no }}. {{ question.survey_question_text }}
        </div>
        <div v-if="question.survey_question_type === 'written'">
          <textarea
            v-model="question.selectedAnswer"
            class="form-textarea"
          ></textarea>
        </div>
        <v-radio-group v-else v-model="question.selectedAnswer">
          <template v-for="choice in question.choices" :key="choice.choice_no">
            <v-radio
              :label="choice.choice_result"
              :value="choice.choice_no"
            ></v-radio>
          </template>
        </v-radio-group>
      </template>
    </div>

    <div class="button-group">
      <v-btn class="submit-button" @click="submitSurvey">제출</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      surveyQuestions: [],
      courseName: "",
      surveyName: "",
      surveyNo: 0,
      //sCourseNo: 0,
    };
  },
  computed: {
    courseNo() {
      return this.$route.params.courseNo;
    },
  },
  mounted() {
    this.surveyList();
  },
  methods: {
    surveyList() {
      let vm = this;

      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("courseNo", this.courseNo);

      this.axios
        .post("/classroom/sStudentSatisfaction.do", params)
        .then((response) => {
          //console.log(JSON.stringify(response));
          //vm.sCourseNo = response.data.sSatisfactionQuestion[0].course_no;
          vm.courseName = response.data.sSatisfactionQuestion[0].course_name;
          vm.surveyName = response.data.sSatisfactionQuestion[0].survey_name;
          vm.surveyNo = response.data.sSatisfactionQuestion[0].survey_no;

          let questions = response.data.sSatisfactionQuestion;
          console.log(questions);
          let answers = response.data.sSatisfactionAnswer;
          console.log(answers);

          // 질문과 그에 해당하는 선택지를 결합
          questions.forEach((question) => {
            question.choices = answers.filter(
              (answer) =>
                answer.survey_question_no === question.survey_question_no
            );
            question.selectedAnswer =
              question.survey_question_type === "written" ? "" : null; // 이 질문에 대한 선택된 답변을 저장
          });

          vm.surveyQuestions = questions;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    submitSurvey() {
      let params = [];
      this.surveyQuestions.forEach((question) => {
        let param = {
          courseNo: this.courseNo,
          surveyNo: this.surveyNo,
          surveyQuestionNo: question.survey_question_no,
          questionChoiced: question.question_choiced,
          choiceNo:
            question.survey_question_type === "written"
              ? null
              : question.selectedAnswer,
          writtenAnswer:
            question.survey_question_type === "written"
              ? question.selectedAnswer
              : null,
        };
        params.push(param);
      });

      this.axios
        .post("/classroom/sInsertSurvey.do", params, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.result >= 0) {
            alert("설문이 저장되었습니다.");
          } else {
            alert("설문 저장 실패: " + response.data.resultMsg);
          }
        })
        .catch((error) => {
          alert("에러! 설문 저장에 실패했습니다. " + error);
        });
    },
  },
};
</script>

<style scoped>
.lecture-detail {
  padding: 32px;
  background-color: #f9f9f9; /* 페이지 배경색 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 32px;
  max-width: 800px;
  margin: auto;
}

.title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 24px;
}

.form-label {
  font-size: 16px;
  color: #555;
  margin-bottom: 8px;
  margin-top: 8px;
}

.form-textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
  width: 100%;
  min-height: 120px;
  resize: vertical;
}

.v-radio-group {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
}

.button-group {
  display: flex;
  justify-content: flex-end;
}

.submit-button {
  /* padding: 12px 24px; */
  background-color: #4285f4;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.submit-button:hover {
  background-color: #357ae8;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
