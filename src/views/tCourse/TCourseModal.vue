<template>
  <div class="modal-content">
    <template v-if="paction === 'U'">
      <h2>강의 수정</h2>
    </template>
    <template v-else>
      <h2>강의 등록</h2>
    </template>
    
    <div class="lectureForm">
      <div class="left">
        <div class="form-group">
          <label for="subject">강의명</label>
          <input type="text" v-model="courseName" required />
        </div>

        <div class="form-group">
          <label for="classroom">강의실</label>
          <input type="text" v-model="classroom" required />
        </div>
        <div class="form-group">
          <label for="courseName">강의과목</label>
        <ComCombo
          group_code="S1000"
          selectid="subjectCD"
          type="all"
          :selvalue="detail_code"
          v-model="course_subject"
          @change="handleSelectChange"
        >
        </ComCombo>
        </div>
        <div class="form-group">
          <label for="">설문조사항목</label>
          <select v-model="selectedSurvey" id="surveyCD">
            <option disabled value="">선택</option>
            <option v-for="option in options" :key="option.survey_no" :value="option.survey_no">
              {{option.survey_name}}
            </option>

          </select>

        </div>

      </div>
      <div class="right">
        <div class="form-group">
          <label for="capacity">수강정원</label>
          <input type="text" v-model="capacity" required />
        </div>
        <div class="form-group">
          <label for="startDate">개강일</label>
          <input type="date" v-model="startDate" required />
        </div>
        <div class="form-group">
          <label for="endDate">종강일</label>
          <input type="date" v-model="endDate" required />
        </div>
      </div>
    </div>
    <div class="form-group">
      <label for="courseDescription">강의소개</label>
      <textarea v-model="courseDescription" required></textarea>
    </div>
    <div id="weeksContainer">
      <h3>주차</h3>
      <div v-for="(week, index) in weeks" :key="index" class="week-entry">
        <h4>{{ index + 1 }}주차</h4>
        <div class="form-group">
          <label :for="'weekGoal-' + index">학습 목표</label>
          <input
            type="text"
            v-model="week.goal"
            :id="'weekGoal-' + index"
            required
          />
        </div>
        <div class="form-group">
          <label :for="'weekContent-' + index">학습 내용</label>
          <textarea
            v-model="week.content"
            :id="'weekContent-' + index"
            required
          ></textarea>
        </div>
      </div>
    </div>
    <div class="form-buttons">
      <button type="button" @click="addWeek" class="addWeek-button">
        주차추가
      </button>
      <button type="button" @click="removeWeek" class="removeWeek-button">
        주차삭제
      </button>
    </div>
    <div class="form-button2">
      <template v-if="action === 'U'">
        <button type="button" class="insert-button" @click="saveCourse">강의수정</button>
      </template>
      <template v-else
        ><button type="button" class="insert-button" @click="saveCourse">강의등록</button></template
      >
    </div>
  </div>
</template>

<script>

import ComCombo from '@/components/common/ComCombo.vue'
import { closeModal } from 'jenesius-vue-modal'

export default {
  props: {
    courseNo: Number,
    action: String,
    retrunval: Function,
  },
    beforeModalClose() {
    this.retrunval(this.saveyn)
  },
  data() {
    return {
      courseName:"",
      classroom: "",
      courseSubjectText:"",
      capacity: "",
      startDate: "",
      endDate: "",
      courseDescription: "",
      weeks: [],
      paction: this.action,
      course_subject:"",
      saveyn:"N",
      detail_code:"",
      surveyNo:"",
      selectedSurvey:"",
      options: [],

      
      
    };
  },
  mounted() {
      if (this.paction === "U") {
        // this.handleSelectChange()
        let params = new URLSearchParams()
        params.append('courseNo', this.courseNo)

      
        this.axios
          .post('/tCourse/detailCourse', params)
          .then((response) => {
            // console.log(JSON.stringify(response))
          
            this.course =  response.data.course;
            this.detailList = response.data.detail;

            this.course_subject = this.course.detail_code;
            this.detail_code = this.course.detail_code;
            this.courseSubjectText = this.course.course_subject;

            this.courseName = this.course.course_name;
            this.classroom = this.course.course_loc;
            this.capacity = this.course.course_quota;
            this.startDate = this.course.course_start_date;
            this.endDate = this.course.course_end_date;
            this.courseDescription = this.course.course_description;
            this.surveyNo = this.course.survey_no;

            console.log(">>>" + this.surveyNo);

            this.detailList.forEach(item => {
            this.weeks.push({ goal: item.course_detail_goal, content: item.course_detail_content, weekNo: item.course_detail_week_no, courseNo: item.course_no });
          });

          })
          .catch(function (error) {
            alert('에러! API 요청에 오류가 있습니다. ' + error)
          })

        }

        this.selectbox();

  },

  methods: {
    handleSelectChange(event) {
      const selectedOption = event.target.options[event.target.selectedIndex];
      this.courseSubjectText = selectedOption.text;
    },
    addWeek() {
      const weekNo = this.weeks.length + 1;
      const courseNo = this.courseNo;
      console.log(">>>>" + courseNo);
      this.weeks.push({ goal: "", content: "", weekNo: weekNo, courseNo: courseNo});
    },
    removeWeek() {
      if (this.weeks.length > 0) {
        this.weeks.pop();
      } else {
        alert("더 이상 삭제할 주차가 없습니다.");
      }
    },
    closePopup: function () {
      closeModal(this)
    },
    selectbox() {
      this.axios
          .post('/tCourse/survey')
          .then((response) => {
            // console.log(JSON.stringify(response))
            this.options = response.data.listdata;

          })
          .catch(function (error) {
            alert('에러! API 요청에 오류가 있습니다. ' + error)
          })
    },
    saveCourse() {

      let checkreturn = this.$emptyValidation([
        { checkval: this.courseName, checkmsg: '강의명을 입력해주세요' },
        { checkval: this.classroom, checkmsg: '강의실을 입력해주세요' },
        { checkval: this.courseSubjectText, checkmsg: '과목명을 선택해주세요' },
        { checkval: this.capacity, checkmsg: '수강정원을 입력해주세요' },
        { checkval: this.startDate, checkmsg: '개강일을 선택해주세요' },
        { checkval: this.endDate, checkmsg: '종강일을 선택해주세요' },
        { checkval: this.selectedSurvey, checkmsg: '설문조사를 선택해주세요' },
      ])

      if (!checkreturn) return

      let params = new URLSearchParams()
      params.append('paction', this.paction)
      params.append('weeks', JSON.stringify(this.weeks))
      params.append('courseName', this.courseName)
      params.append('classroom', this.classroom)
      params.append('courseSubjectText', this.courseSubjectText)
      params.append('capacity', this.capacity)
      params.append('startDate', this.startDate)
      params.append('endDate', this.endDate)
      params.append('courseDescription', this.courseDescription)
      params.append('courseNo', this.courseNo)
      params.append('selectedSurvey', this.selectedSurvey)

      this.axios
        .post('/tCourse/saveCourse', params)
        .then((response) => {
          console.log(JSON.stringify(response))

          alert(response.data.resultMsg)
          
          if (response.data.result > 0) {
            
            this.saveyn = 'Y'
            this.closePopup()
          }
        })
        .catch(function (error) {
          alert('에러! TCourseModal.vue saveCourse()함수 ' + error)
        })
    },
    


  },
  watch: {
    options(newOptions) {
      if (newOptions.length > 0 && this.surveyNo) {
        this.selectedSurvey = this.surveyNo;
      }
    }
  },

   components: {ComCombo },
};
</script>

<style scoped>
.lectureForm {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  animation: animatetop 0.4s;
  max-width: 600px;
  max-height: 700px;
  overflow-y: auto;
  
}

@keyframes animatetop {
  from {
    top: -300px;
    opacity: 0;
  }
  to {
    top: 0;
    opacity: 1;
  }
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #dfdfdf;
}

.form-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.form-buttons button {
  margin-right: 10px;
}

.form-button2 {
  display: flex;
  justify-content: flex-end;
  position: relative;
  top: 10px;
  right: 10px;
}

#weeksContainer {
  margin-top: 20px;

}

.week-entry {
  margin-bottom: 20px;
  border: 1px solid #ddd;
  padding: 10px;
  border-radius: 5px;
}

.insert-button,
.addWeek-button {
  padding: 10px 17px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.insert-button:hover,
.addWeek-button:hover {
  background-color: #0056b3;
}

.removeWeek-button {
  padding: 10px 17px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.removeWeek-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

#subjectCD,#surveyCD {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  color: #333;
}
</style>
