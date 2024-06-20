<template>
  <div class="lecture-detail">
    <v-btn class="close-button" icon @click="closeModal">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    <h2 class="title">시험</h2>

    <!-- 객관식 -->
     <form id="submitting">
      <div class="question-container">
        <template v-for="(question, index) in sTestInfo" :key="question.test_no">          
          <div class="form-label">{{ index + 1 }}. {{ question.test_question }}</div>
          <v-radio-group  v-model="selectedChoice[index]">
            <v-radio value="1">
              <template v-slot:label>
                1. {{ question.test_choice1 }}
              </template>
            </v-radio>
            <v-radio value="2">
              <template v-slot:label>
                2. {{ question.test_choice2 }}
              </template>
            </v-radio>
            <v-radio value="3">
              <template v-slot:label>
                3. {{ question.test_choice3 }}
              </template>
            </v-radio>
            <v-radio value="4">
              <template v-slot:label>
                4. {{ question.test_choice4 }}
              </template>
            </v-radio>
          </v-radio-group>
        </template>
      </div>
      <div class="button-group">
        <v-btn class="goBack-button" @click="goBack">취소</v-btn>
        <v-btn class="submit-button" @click="submitTest">등록</v-btn>
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
  },
  data() {
    return {
      paction: this.action,
      SelectedCourseNo: this.courseNo,
      SelectedTestCategory: this.testCategory,
      createTest: [],
      sTestInfo: [],
      testSubmit: null,
      selectedChoice:[],
      testNo : [],
      choice1: "1",
      choice2: "2",
      choice3: "3",
      choice4: "4",
      
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

        response.data.createTest.forEach((each, index) =>{
          this.testQuestion = each.test_question;
          this.testChoice1 = each.test_choice1;
          this.testChoice2 = each.test_choice2;
          this.testChocie3 = each.test_choice3;
          this.testChoice4 = each.test_choice4;
          this.testScore = each.test_score;
          this.testNo[index] = each.test_no;
        });
         // testNo에 값을 잘 추가했는지 확인하는 alert
           for (let [key, value] of this.testNo.entries()) {
             console.log(`${key}: ${value}`);
           }
      })
    },
    // 시험 채점
    calculateTest(){

      let testcalcuateParams = new URLSearchParams();
      testcalcuateParams.append("selectedCourseNo", this.SelectedCourseNo);
      testcalcuateParams.append("selectedTestCategory", this.SelectedTestCategory);
      console.log("카테고리왔느뇨 : ", this.SelectedTestCategory);
      console.log("강의번호왔느뇨: ", this.SelectedCourseNo);

      this.axios
        .post("/classroom/sTestCalculate.do", testcalcuateParams)
        .then ((response) => {
          console.log("시험 채점 JSON : ", JSON.stringify(response));

          if(response.data.calculateResult > 0){
            alert(response.data.calculateResultMsg);
          }
        })
    },
    // 시험 결과값 제출
    submitTest() {
      let formTag = document.getElementById("submitting");
      let data = new FormData(formTag);

      data.append("selectedChoice", this.selectedChoice);
      data.append("selectedCourseNo", this.SelectedCourseNo);
      data.append("selectedTestCategory", this.SelectedTestCategory);
      data.append("testScore", this.testScore);
      data.append("testQuestion", this.testQuestion);
      data.append("testNo", this.testNo);

       // FormData에 값을 잘 추가했는지 확인하는 alert
       for (let [key, value] of data.entries()) {
         alert(`${key}: ${value}`);
       }

      this.axios
        .post("/classroom/sTestSubmit.do", data)
        .then((response) => {
          console.log("너의 정체가 무엇이냐: ",JSON.stringify(response));

          if (response.data.result > 0) {
            alert("result값알려주라: " + response.data.result);
            alert(response.data.resultMsg);
            
            this.calculateTest();
            alert("시험 채점 결과가 들어갔겠쬬?@.@");
            
            this.$emit("close-modal"); // 모달 닫기 이벤트 발생
          }

        })
        .catch(function (error){
          alert("에러! API 요청에 오류가 있습니다" + error);
        });

    },
    goBack(){
      this.$router.go(-1);
    },

    closeModal(){
      this.$emit('close-modal');
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