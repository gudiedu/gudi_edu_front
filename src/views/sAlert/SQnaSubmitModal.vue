<template>
  <div class="lecture-detail">
    <h2 class="title">질의응답 등록</h2>
    <v-btn class="close-button" icon @click="$emit('close-modal')">
      <v-icon>mdi-close</v-icon>
    </v-btn>

    <form id="submitting">
      <div class="form-group">
        <div class="form-label">과목명</div>
        <select v-model="selectedCourseNo" class="form-input">
          <option disabled value="">선택하세요</option>
          <option v-for="course in enrolledCourses" :key="course.course_no" :value="course.course_no">
            {{ course.course_name }}
          </option>
        </select>
        <input type="hidden" v-model="studentName" />
      </div>
      <div class="form-group">
        <div class="form-label">제목</div>
        <input type="text" name="questionTitle" v-model="questionTitle" class="form-input" />
      </div>
      <div class="form-group">
        <div class="form-label">내용</div>
        <textarea name="questionContent" v-model="questionContent" class="form-textarea"></textarea>
      </div>
      <!-- CKEditor 사용
        code mirror 사용 예정-->

      <div class="button-group">
        <v-btn class="insert-button" @click="submitQuestion">등록</v-btn>
      </div>
    </form>
  </div>
</template>
<script>
export default {
  props: {
    action: String,
  },
  data() {
    return {
      paction: this.action,
      questionTitle: "",
      questionContent: "",
      sSQuestionNo: this.sQuestionNo,
      studentName: "",
      enrolledCourses: [],
      sQnaGetCourseName: [],
      selectedCourseNo: "",
      studentSignedInID: "",
    };
  },
  mounted() {
    this.init();
    // //$('#summernote').summernote({
    // //  height: 800,
    // //  minHeight: null,
    // //  maxHeight: null,
    // //  focus: true,
    // //  toolbar: [
    // //    ['style', ['bold', 'italic', 'underline']],
    //  //   ['fontsize', ['fontsize']],
    //     ['color', ['color']],
    //     ['para', ['paragraph']],
    //     ['height', ['height']],
    //     ['Insert', ['picture']],
    //     ['Mics',['codeview']]
    //   ]
    // });
  },
  methods: {
    init() {
      let courseParams = new URLSearchParams();
      courseParams.append("courseNo", this.course_no);
      courseParams.append("courseName", this.course_name);
      courseParams.append("studentSignedInID", this.studentSignedInID);

      console.log("studentSignedInID : ", this.studentSignedInID);
      console.log("courseNo : ", this.courseNo);

      this.axios
        .post("sAlert/sQnaGetCourseName.do", courseParams)
        .then((response) => {
          console.log("JSON.stringify(response) : ", JSON.stringify(response.data));

          this.enrolledCourses = response.data.sQnaGetCourseName;

          response.data.sQnaGetCourseName.forEach((each) => {
            this.courseName = each.course_name;
            this.studentName = each.name;
            this.courseNo = each.course_no;
            this.sQnaGetCourseName = each.loginId;

            console.log("this.studentName:", this.studentName);
          });

          this.courseName = response.data.sQnaGetCourseName.course_name;
          this.courseNo = response.data.sQnaGetCourseName.course_no;

          console.log("두번째 studentName확인 : ", this.studentName);
          console.log("sQnaGetCourseName : ", this.sQnaGetCourseName);
        })
        .catch(function (error) {
          alert("init에서 오류 발생!" + error);
        });
    },

    submitQuestion() {
      let formTag = document.getElementById("submitting");
      let data = new FormData(formTag);
      data.append("questionTitle", this.questionTitle);
      data.append("questionContent", this.questionContent);
      data.append("selectedCourseNo", this.selectedCourseNo);
      data.append("studentName", this.studentName);

      // FormData에 값을 잘 추가했는지 확인하는 alert
      // for (let [key, value] of data.entries()) {
      //   alert(`${key}: ${value}`);
      // }

      this.axios
        .post("/sAlert/sQnaInsert.do", data)
        .then((response) => {
          console.log(JSON.stringify(response));

          this.enrolledCourses = response.data.sQnaGetCourseName;

          if (response.data.result > 0) {
            alert(response.data.resultMsg);
            this.$emit("close-modal"); // 모달 닫기 이벤트 발생
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
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
  width: 55px;
  height: 35px;
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
  width: 55px;
  height: 35px;
  background-color: #d32f2f;
  margin: 0;
}

.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}
.close-button {
  position: absolute;
  top: 0; /* 상단 여백 조정 */
  right: 0; /* 오른쪽 여백 조정 */
  margin: 8px; /* 버튼과 모달의 경계 사이에 약간의 여백 추가 */
}
</style>
