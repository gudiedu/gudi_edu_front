<template>
  <div class="lecture-detail">
    <h2 class="title">수업만족도 조사</h2>

    <!-- 객관식 -->
    <div class="form-group">
      <div class="form-label">1. 강의 내용이 유익했습니까?</div>
      <v-radio-group v-model="objectiveAnswers.q1" row>
        <v-radio label="매우 그렇다" value="5"></v-radio>
        <v-radio label="그렇다" value="4"></v-radio>
        <v-radio label="보통이다" value="3"></v-radio>
        <v-radio label="아니다" value="2"></v-radio>
        <v-radio label="매우 아니다" value="1"></v-radio>
      </v-radio-group>
    </div>

    <div class="form-group">
      <div class="form-label">2. 강사의 설명이 이해하기 쉬웠습니까?</div>
      <v-radio-group v-model="objectiveAnswers.q2" row>
        <v-radio label="매우 그렇다" value="5"></v-radio>
        <v-radio label="그렇다" value="4"></v-radio>
        <v-radio label="보통이다" value="3"></v-radio>
        <v-radio label="아니다" value="2"></v-radio>
        <v-radio label="매우 아니다" value="1"></v-radio>
      </v-radio-group>
    </div>

    <!-- 주관식 -->
    <div class="form-group">
      <div class="form-label">3. 강의에서 개선할 점은 무엇입니까?</div>
      <textarea name="improvements" class="form-textarea"></textarea>
    </div>

    <div class="button-group">
      <v-btn class="submit-button" @click="submitSurvey">제출</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    courseNo: Number,
  },
  data() {
    return {
      pCourseNo: this.courseNo,
      objectiveAnswers: {
        q1: null,
        q2: null,
      },
      subjectiveAnswers: {
        improvements: "",
      },
    };
  },
  methods: {
    submitSurvey() {
      alert(this.pCourseNo);
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
  flex-direction: column;
  margin-bottom: 16px;
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

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.update-button,
.delete-button,
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

.update-button,
.insert-button,
.submit-button {
  background-color: #407bff;
}

.update-button:hover,
.insert-button:hover,
.submit-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.delete-button {
  background-color: #d32f2f;
}

.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}
</style>
