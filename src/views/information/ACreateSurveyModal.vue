<template>
  <div class="lecture-detail">
    <v-btn class="close-button" icon @click="$emit('close')">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    <h1>설문조사생성</h1>
    
    <div class="form-group">
      <div class="form-label">강의번호</div>
      <input type="text" v-model="localCourse_no" class="form-input" readonly />
    </div>

    <div class="form-group">
      <div class="form-label">강의명</div>
      <input type="text" v-model="localCourse_name" class="form-input" readonly />
    </div>

    <div class="form-group">
      <div class="form-label">질문선택</div>
      <select v-model="selectedSurvey" style="height:200px; width:500px" size="3">
        <option value="none" disabled>===설문번호 : 설문명 ===</option>
        <option v-for="(item) in surveyList" :key="item.survey_no" :value="item.survey_no">
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {{ item.survey_no }} : {{ item.survey_name }}
        </option>
      </select>
    </div>
  </div>
  <div class="button-group">
      <template v-if="paction === 'U'">
        <v-btn class="update-button" @click="updateNotice">수정</v-btn>
        <v-btn class="delete-button" @click="deleteNotice">삭제</v-btn>
      </template>
      <template v-else>
        <v-btn class="insert-button" @click="insertNotice">등록</v-btn>
      </template>
    </div>
</template>


<script>
import axios from 'axios';
export default {
props: {
    action: String,
    course_name: String,
    course_no: Number,
  },
  data() {
    return {
      paction: this.action,
      localCourse_name: this.course_name,
      localCourse_no: this.course_no,
      selectedSurvey: "",
      questionName: "",
      surveyList: [], //설문지 리스트 목록 저장할 배열
    };
  },
  mounted() {
    this.getSurveyList();
  },

  methods: {
    getSurveyList(){
        axios.get('/survey/modalSurveyList.do')
        .then(response => {
        console.log('SurveyList response:', response.data); // 전체 응답 데이터 콘솔 출력
        this.surveyList = response.data.listdate; // 데이터 바인딩
        console.log('SurveyList:', this.surveyList); // 바인딩된 데이터 콘솔 출력
      })
      .catch(error => {
        console.error('Error fetching surveyList:', error);
      });
    },

    insertNotice() {
        if (!this.selectedSurvey) {
      alert('설문을 선택해 주세요.');
      return;
    }
      const params = new URLSearchParams();
      params.append('survey_no', this.selectedSurvey);
      params.append('course_no', this.localCourse_no);

      axios.post('/survey/surveyIntoCourse.do', params)
        .then(response => {
          console.log("surveyIntoCourse:", response)
          alert(this.localCourse_name + " 강의에 설문이 등록되었습니다.");
          this.$emit('close'); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
        })
        .catch(error => {
          console.error('Error surveyIntoCourse:', error);
          alert('Error surveyIntoCourse');
          this.$emit('close'); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
        });
      }



      
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

.form-radio {
  display: flex;
  border-radius: 4px;
  margin-bottom: 8px;
}
.form-label {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.close-button {
  position: absolute;
  top: 0; /* 상단 여백 조정 */
  right: 0; /* 오른쪽 여백 조정 */
  margin: 8px; /* 버튼과 모달의 경계 사이에 약간의 여백 추가 */
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
</style>