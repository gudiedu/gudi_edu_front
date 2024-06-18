<template>
  <div id="survey-detail">
    <h2 class="title">수업만족도 결과</h2>

    <div v-if="surveyResults.length > 0">
      <template v-for="(result, index) in surveyResults" :key="result.survey_question_no">
        <div class="modal-content" v-if="index === 0 || surveyResults[index - 1].survey_question_no !== result.survey_question_no">
          <h2 id="surveyNumber" class="survey-number">{{ result.survey_question_no }}번 문항</h2>
          <p id="qsurveyText" class="survey-text">{{ result.survey_question_text }}</p>

          <div v-if="hasChoices(result.survey_question_no)">
            <BarChart :results="getResultsByQuestionNo(result.survey_question_no)" />
          </div>

          <div v-else>
            <div v-for="answer in getResultsByQuestionNo(result.survey_question_no)" :key="answer.survey_question_no">
              <p v-if="answer.written_answer">{{ answer.written_answer }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
    <div v-else>
      <p>설문조사 결과가 없습니다.</p>
    </div>
  </div>
</template>

<script>
import BarChart from "./BarChart.vue";

export default {
  components: {
    BarChart,
  },
  props: {
    courseNo: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      surveyResults: [],
    };
  },
  mounted() {
    this.selectClassSurvey();
  },
  methods: {
    selectClassSurvey() {
      const params = new URLSearchParams();
      params.append("course_no", this.courseNo);

      this.axios
        .post("/support/fetchSurveyResults.do", params)
        .then((response) => {
          this.surveyResults = response.data.surveyResults || [];
          console.log("-  ", response.data);
        })
        .catch((error) => {
          console.error("설문조사 결과를 가져오는 도중 오류가 발생했습니다.", error);
          this.surveyResults = [];
        });
    },
    getResultsByQuestionNo(questionNo) {
      return this.surveyResults.filter((result) => result.survey_question_no === questionNo);
    },
    hasChoices(questionNo) {
      return this.getResultsByQuestionNo(questionNo).some((result) => result.choice_count > 0);
    },
    cancel() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped>
.survey-number {
  font-size: 18px; /* 원하는 크기로 설정 */
  text-align: center;
}

.survey-text {
  font-size: 18px; /* 원하는 크기로 설정 */
  text-align: center;
}

#survey-detail {
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

.modal-content {
  margin-bottom: 16px;
}

.chart-container {
  margin-top: 16px;
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
