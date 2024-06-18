<template>
  <div id="survey-detail">
    <h2 class="title">수업만족도 결과</h2>

    <div v-if="surveyResults.length > 0">
      <template v-for="(result, index) in surveyResults" :key="result.survey_question_no">
        <div class="modal-content" v-if="index === 0 || surveyResults[index - 1].survey_question_no !== result.survey_question_no">
          <h2 id="surveyNumber">{{ result.survey_question_no }}번 문항</h2>
          <p id="qsurveyText">{{ result.survey_question_text }}</p>
        </div>
        <div class="chart-container" id="chartContainer">
          <!-- 조건부로 선택지 및 작성된 답변을 표시 -->
          <p v-if="result.choice_result">선택지: {{ result.choice_result }} (선택수: {{ result.choice_count }})</p>
          <p v-if="result.written_answer">{{ result.written_answer }}</p>
        </div>
      </template>
    </div>
    <div v-else>
      <p>설문조사 결과가 없습니다.</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    courseNo: {
      type: String, // String으로 설정
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

    cancel() {
      this.$emit("close");
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

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.cancel-button {
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
  background-color: #686767;
}

.cancel-button:hover {
  background-color: #c2c2c2;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}
</style>
