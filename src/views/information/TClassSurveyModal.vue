<template>
  <div id="survey-detail">
    <h2 class="title">수업만족도 결과</h2>

    <div v-if="loading">
      <div class="loading">로딩 중...</div>
    </div>

    <div v-else>
      <div v-if="surveyResults.length > 0">
        <template v-for="(result, index) in surveyResults" :key="result.survey_question_no">
          <div class="modal-content" v-if="index === 0 || surveyResults[index - 1].survey_question_no !== result.survey_question_no">
            <h2 id="surveyNumber" class="survey-number">{{ result.survey_question_no }}번 문항</h2>
            <p id="qsurveyText" class="survey-text">{{ result.survey_question_text }}</p>

            <div v-if="hasChoices(result.survey_question_no)">
              <div class="chart-wrapper">
                <PieChart :results="getResultsByQuestionNo(result.survey_question_no)" />
              </div>
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
  </div>
</template>

<script>
import PieChart from "../support/PieChart.vue";

export default {
  components: {
    PieChart,
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
      loading: true,
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
          this.loading = false; // 데이터 로드 완료 후 로딩 상태 false로 변경
        })
        .catch((error) => {
          console.error("설문조사 결과를 가져오는 도중 오류가 발생했습니다.", error);
          this.surveyResults = [];
          this.loading = false; // 오류 발생 시에도 로딩 상태 false로 변경
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
  font-size: 17px; /* 원하는 크기로 설정 */
  font-weight: 600;
  text-align: center;
  margin-bottom: 8px; /* 텍스트와 그래프 사이의 간격을 줄이기 위해 수정 */
}

.survey-text {
  font-size: 17px; /* 원하는 크기로 설정 */
  font-weight: 600;
  text-align: center;
  margin-bottom: 0; /* 텍스트와 그래프 사이의 간격을 줄이기 위해 수정 */
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
  margin-bottom: 50px;
}

.modal-content {
  margin-bottom: 50px; /* 문항 간의 간격을 넓히기 위해 수정 */
}

.chart-wrapper {
  margin-top: 8px; /* 그래프와 문항 텍스트 사이의 간격을 줄이기 위해 추가 */
}

.chart-container {
  background-color: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.loading {
  text-align: center;
  font-size: 18px;
  color: #2c3e50;
  padding: 20px;
}
</style>
