<template>
  <div class="lecture-detail">
    <h2 class="title">질문관리</h2>

    <div class="form-group">
      <div class="form-label">질문번호</div>
      <input
        type="text"
        name="title"
        :value="survey_question_no"
        class="form-input"
        readonly
      />
    </div>

    <div class="form-group">
      <div class="form-label">질문명</div>
      <input type="text" v-model="localSurveyQuestionText" class="form-input" />
    </div>

    <div class="form-radio">
      <div class="form-label">유형</div>
      &nbsp;
      <input
        type="radio"
        id="option1"
        name="survey_question_type"
        v-model="selectedQuestionType"
        value="choice"
      /><label for="option1">선택형</label>
      <input
        type="radio"
        id="option2"
        name="survey_question_type"
        v-model="selectedQuestionType"
        value="written"
      /><label for="option2">서술형</label>
    </div>

    <div v-if="selectedQuestionType === 'choice'">
      <div class="form-group">
        <div class="form-label">선택지종류</div>
        <select
          v-model="selectedCategory"
          style="height: 70px; width: 200px"
          size="3"
        >
          <option value="none" disabled>=== 선택 ===</option>
          <option
            v-for="item in categoryList"
            :key="item.question_choiced"
            :value="item.question_choiced"
          >
            {{ item.category_name }}
          </option>
        </select>

        <div v-if="selectedCategory !== '0'">
          <br />
          <div class="form-label">선택지 미리보기</div>
          <div>
            <div v-for="item in choiceList" :key="item.question_choiced">
              <template v-if="item.question_choiced === selectedCategory">
                {{ item.choice_result }}
              </template>
            </div>
          </div>
        </div>
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
  </div>
</template>

<script>
import axios from "axios";
export default {
  props: {
    action: String,
    survey_no: Number, // survey_no를 props로 받음
    survey_question_no: Number,
    survey_question_text: String,
    question_choiced: Number,
    survey_question_type: String,
  },
  data() {
    return {
      paction: this.action,
      categoryList: [], // 카테고리 데이터를 저장할 배열
      selectedCategory: this.question_choiced, // 선택된 카테고리를 저장할 변수
      choiceList: [],
      selectedQuestionType: this.survey_question_type, // 기본값은 선택형으로 설정
      localSurveyQuestionText: this.survey_question_text || "",
    };
  },

  mounted() {
    this.fetchCategoryList();
  },

  methods: {
    fetchCategoryList() {
      axios
        .get("/survey/categoryList.do")
        .then((response) => {
          this.categoryList = response.data.categoryList; // 응답 데이터를 categoryList에 저장
          this.choiceList = response.data.choiceList; // 응답 데이터를 choiceList에 저장
          console.log("category list1:", this.categoryList);
          console.log("choiceList list1:", this.choiceList);
          console.log("category list2:", response.data);
        })
        .catch((error) => {
          console.error("Error fetching category list:", error);
        });
    },

    updateNotice() {
      if (confirm("수정하시겠습니까?")) {
        const params = new URLSearchParams();
        if (this.selectedQuestionType == "written") {
          params.append("question_choiced", 0);
        } else {
          params.append("question_choiced", this.selectedCategory);
        }
        params.append("survey_no", this.survey_no);
        params.append("survey_question_no", this.survey_question_no);
        params.append("survey_question_text", this.localSurveyQuestionText);
        params.append("survey_question_type", this.selectedQuestionType);

        axios
          .post("/survey/questionUpdate.do", params)
          .then((response) => {
            console.log("UpdateNotice:", response);
            alert(this.localSurveyQuestionText + " 질문지가 수정되었습니다.");
            this.$emit("close"); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
          })
          .catch((error) => {
            console.error("Error updating question:", error);
            alert("Error updating question");
          });
      }
    },

    deleteNotice() {
      if (
        confirm(
          this.localSurveyQuestionText + " 이 질문을 정말로 삭제하시겠습니까?"
        )
      ) {
        axios
          .delete("/survey/questionDelete.do", {
            params: {
              survey_no: this.survey_no,
              survey_question_no: this.survey_question_no,
            },
          })
          .then((response) => {
            console.log("deleteNotice:", response);
            alert(this.localSurveyQuestionText + " 설문지가 삭제되었습니다.");
            this.$emit("close"); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
          })
          .catch((error) => {
            console.error("Error deleting question:", error);
            alert("Error deleting question");
          });
      }
    },

    insertNotice() {
      if (this.localSurveyQuestionText.trim() === "") {
        alert("추가할 질문명을 입력해주세요.");
        return;
      }

      const params = new URLSearchParams();
      if (this.selectedQuestionType == "written") {
        params.append("question_choiced", 0);
      } else {
        params.append("question_choiced", this.selectedCategory);
      }
      params.append("survey_no", this.survey_no);
      params.append("survey_question_text", this.localSurveyQuestionText);
      // params.append('question_choiced', this.selectedCategory);
      params.append("survey_question_type", this.selectedQuestionType);

      axios
        .post("/survey/questionInsert.do", params)
        .then((response) => {
          console.log("updatNotice:", response);
          alert(this.localSurveyQuestionText + " 질문이 등록되었습니다.");
          this.$emit("close");
        })
        .catch((error) => {
          console.error("Error updating questionInsert:", error);
          // alert('Error updating questionInsert');
          this.$emit("close");
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
  width: 50px;
  height: 40px;
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
