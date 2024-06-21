<template>
  <div class="lecture-detail">
    <h2 class="title">설문지관리</h2>

    <div class="form-group">
      <div class="form-label">설문코드</div>
      <!-- <template v-if="paction === 'U'"> -->
      <input type="text" name="title" :value="nextsurvey_no" class="form-input" readonly />
    <!-- </template> -->
    <!-- <template v-else>
    <input type="text" name="title" :value="survey_no" class="form-input" readonly />
  </template> -->
    </div>
    <div class="form-group">
      <div class="form-label">설문조사명</div>
      <input type="text" v-model="localSurvey_name" class="form-input"  />
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
  </div>
</template>

<script>
import axios from 'axios';
export default {
  props: {
    action: String,
    survey_no: String,
    survey_name: String
  },
  data() {
    return {
      paction: this.action,
      nextsurvey_no: this.survey_no || "", // 처음에는 survey_no를 사용하고, 없는 경우에만 nextSurveyCode를 가져옴
      localSurvey_name: this.survey_name || '',

    };
  },
  mounted() {
    // 페이지 로드될 때 설문 코드 목록을 가져오는 메서드 호출 (수정인 경우에는 가져오지 않음)
    if (!this.survey_no) {
      this.getNextSurveyNo();
    }
  },
  
  methods: {
    getNextSurveyNo(){
      axios.get('/survey/nextSurveyCode.do')
      .then(response => {
      console.log('nextSurvey_no response:', response.data); // 전체 응답 데이터 콘솔 출력
      this.nextsurvey_no = response.data; // 데이터 바인딩
      console.log('nextSurveyCode:', this.nextsurvey_no); // 바인딩된 데이터 콘솔 출력
    })
    .catch(error => {
      console.error('Error fetching nextSurveyCode:', error);
     });
    },
    

    updateNotice() {
      if (this.localSurvey_name.trim() === '') {
        alert('설문지 이름을 입력해주세요.');
        return;
      }
      const params = new URLSearchParams()
      params.append('survey_name', this.localSurvey_name);
      params.append('survey_no', this.survey_no);

      axios.post('/survey/surveyUpdate.do', params)
      .then(response => {
          console.log("updatNotice:", response)
          alert(this.localSurvey_name + " 설문지 이름이 수정되었습니다.");
          this.$emit('close');
        })
        .catch(error => {
          alert(this.localSurvey_name + " 설문지 이름이 수정되었습니다.");
          console.error('Error updating survey:', error);
          // alert('Error updating course');
          this.$emit('close');
        })
    },
    deleteNotice() {
      if (confirm(this.localSurvey_name + " 이 설문지를 정말로 삭제하시겠습니까?")) {
        axios.delete('/survey/surveyDelete.do', {
          params: {
            survey_no: this.survey_no
          }
        })
        .then(response => {
          console.log("deleteNotice:", response)
          alert(this.localSurvey_name + " 설문지가 삭제되었습니다.");
          this.$emit('close'); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
        })
        .catch(error => {
          console.error('Error deleting survey:', error);
          alert('Error deleting survey');
        });
      }

    },
    
    insertNotice() {
      if (this.localSurvey_name.trim() === '') {
        alert('설문지 이름을 입력해주세요.');
        return;
      }
      axios.post('/survey/surveyInsert.do', {
        survey_name: this.localSurvey_name,
      })
      .then(response => {
        alert(this.localSurvey_name + " 설문지가 새로 등록되었습니다.");
        this.$emit('close'); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
      })
      .catch(error => {
        console.error('Error adding survey_name:', error);
        alert('Error adding survey_name');
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
