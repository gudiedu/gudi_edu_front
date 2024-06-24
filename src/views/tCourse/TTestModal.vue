<template>
  <div>
    <div v-if="action === 'C'">
      <!-- 시험 등록 모달 -->
      <div class="modal-header">
        <div class="course-subject">{{ courseSubject }}</div>
        <div class="course-name">{{ courseName }}</div>
      </div>
      <div class="form-group">
        <label for="testCategory">시험명</label>
        <select v-model="testCategory" id="testCategory" required>
          <option disabled value="">시험명을 선택해주세요</option>
          <option value="1차">1차</option>
          <option value="2차">2차</option>
          <option value="테스트">테스트</option>
        </select>
      </div>
      <div>
        <label
          ><input
            type="checkbox"
            v-model="selectAll"
            @change="toggleSelectAll"
          />
          전체 선택</label
        >
      </div>
      <div v-for="(question, index) in tempQuestions" :key="index">
        <label
          ><input type="checkbox" v-model="selectedQuestions" :value="index" />
          문제 {{ index + 1 }}</label
        >
        <div class="form-group">
          <label for="testQuestion">문제명</label>
          <input
            type="text"
            v-model="question.test_question"
            id="testQuestion"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice1">보기1</label>
          <input
            type="text"
            v-model="question.test_choice1"
            id="testChoice1"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice2">보기2</label>
          <input
            type="text"
            v-model="question.test_choice2"
            id="testChoice2"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice3">보기3</label>
          <input
            type="text"
            v-model="question.test_choice3"
            id="testChoice3"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice4">보기4</label>
          <input
            type="text"
            v-model="question.test_choice4"
            id="testChoice4"
            required
          />
        </div>
        <div class="form-group">
          <label for="testAnswer">정답</label>
          <div class="dropdown-container">
            <select v-model="question.test_answer" id="testAnswer" required>
              <option disabled value="">정답을 선택해주세요</option>
              <option value="보기1">보기1</option>
              <option value="보기2">보기2</option>
              <option value="보기3">보기3</option>
              <option value="보기4">보기4</option>
            </select>
            <i class="dropdown-icon">▼</i>
          </div>
        </div>
        <div class="form-group">
          <label for="testScore">배점</label>
          <input
            type="number"
            v-model.number="question.test_score"
            id="testScore"
            @input="validateScore(index)"
            required
          />
        </div>
      </div>
      <div class="score-display">총 점수: {{ totalScore }}</div>
      <!-- 총 점수 표시 영역 -->
      <div class="main-button-group">
        <button @click="addQuestion" class="addQuestion-button">추가</button>
        <button
          @click="deleteSelectedQuestions"
          class="removeQuestion-button spaced"
        >
          삭제
        </button>
        <!-- 삭제 버튼 수정 -->
        <button @click="registerExam" class="insert-button">등록</button>
      </div>
    </div>

    <div v-if="action === 'U'">
      <!-- 시험 수정 모달 -->
      <div class="modal-header">
        <div class="course-subject">{{ courseSubject }}</div>
        <div class="course-name">{{ courseName }} - {{ testCategory }}</div>
      </div>
      <div v-for="(question, index) in tempQuestions" :key="index">
        <div class="form-group">
          <label for="testQuestion">문제명</label>
          <input
            type="text"
            v-model="question.test_question"
            id="testQuestion"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice1">보기1</label>
          <input
            type="text"
            v-model="question.test_choice1"
            id="testChoice1"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice2">보기2</label>
          <input
            type="text"
            v-model="question.test_choice2"
            id="testChoice2"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice3">보기3</label>
          <input
            type="text"
            v-model="question.test_choice3"
            id="testChoice3"
            required
          />
        </div>
        <div class="form-group">
          <label for="testChoice4">보기4</label>
          <input
            type="text"
            v-model="question.test_choice4"
            id="testChoice4"
            required
          />
        </div>
        <div class="form-group">
          <label for="testAnswer">정답</label>
          <div class="dropdown-container">
            <select v-model="question.test_answer" id="testAnswer" required>
              <option disabled value="">정답을 선택해주세요</option>
              <option value="보기1">보기1</option>
              <option value="보기2">보기2</option>
              <option value="보기3">보기3</option>
              <option value="보기4">보기4</option>
            </select>
            <i class="dropdown-icon">▼</i>
          </div>
        </div>
        <div class="form-group">
          <label for="testScore">배점</label>
          <input
            type="number"
            v-model.number="question.test_score"
            id="testScore"
            @input="validateScore(index)"
            required
          />
        </div>
      </div>
      <div class="score-display">총 점수: {{ totalScore }}</div>
      <!-- 총 점수 표시 영역 -->
      <div class="main-button-group">
        <button @click="saveQuestion" class="insert-button">저장</button>
        <button @click="confirmDeleteExam" class="removeQuestion-button">
          시험 삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["action", "courseNo", "courseName", "courseSubject", "question"],
  data() {
    return {
      testCategory: "",
      questions: [
        {
          test_question: "",
          test_choice1: "",
          test_choice2: "",
          test_choice3: "",
          test_choice4: "",
          test_answer: "",
          test_score: 0,
        },
      ],
      tempQuestions: [],
      totalScore: 0,
      selectedQuestions: [], // 선택된 문제 인덱스를 저장하는 배열
      deletedQuestions: [], // 삭제된 질문을 저장하는 배열
      selectAll: false, // 전체 선택 체크박스 상태
    };
  },
  mounted() {
    if (this.action === "U" && this.question) {
      this.questions = this.question;
      this.testCategory = this.question[0].test_category;
    }
    this.tempQuestions = JSON.parse(JSON.stringify(this.questions));
    this.updateTotalScore();
  },
  methods: {
    validateScore(index) {
      if (this.tempQuestions[index].test_score > 100) {
        alert("배점은 100점을 초과할 수 없습니다.");
        this.tempQuestions[index].test_score = 100;
      }
      this.updateTotalScore();
      if (this.totalScore > 100) {
        const remainingScore =
          100 - (this.totalScore - this.tempQuestions[index].test_score);
        alert(
          `남은 점수는 ${remainingScore}점입니다. 배점을 ${remainingScore}점으로 조정합니다.`
        );
        this.tempQuestions[index].test_score = remainingScore;
        this.updateTotalScore();
      }
    },
    updateTotalScore() {
      this.totalScore = this.tempQuestions.reduce(
        (sum, question) => sum + (parseInt(question.test_score) || 0),
        0
      );
    },
    addQuestion() {
      const remainingScore = 100 - this.totalScore;
      if (remainingScore <= 0) {
        alert("총 점수가 100점을 초과할 수 없습니다. 추가할 수 없습니다.");
        return;
      }
      this.tempQuestions.push({
        test_question: "",
        test_choice1: "",
        test_choice2: "",
        test_choice3: "",
        test_choice4: "",
        test_answer: "",
        test_score: 0,
      });
    },
    deleteSelectedQuestions() {
      if (this.selectedQuestions.length === 0) {
        alert("체크박스를 선택하세요.");
        return;
      }
      if (confirm("정말로 선택된 문제를 삭제하시겠습니까?")) {
        this.selectedQuestions
          .sort((a, b) => b - a)
          .forEach((index) => {
            const questionToDelete = this.tempQuestions[index];
            this.deletedQuestions.push(questionToDelete); // 삭제된 질문을 deletedQuestions에 추가
            this.tempQuestions.splice(index, 1);
          });
        this.selectedQuestions = [];
        this.selectAll = false;
        this.updateTotalScore();
      }
    },
    registerExam() {
      this.updateTotalScore();
      if (!this.testCategory) {
        alert("시험 카테고리를 선택해주세요.");
        return;
      }
      if (this.totalScore > 100) {
        alert("총 점수가 100점을 초과할 수 없습니다.");
        return;
      }
      this.$emit("saveExam", {
        action: "C",
        testCategory: this.testCategory,
        questions: this.tempQuestions,
      });
    },
    saveQuestion() {
      this.updateTotalScore();

      if (this.totalScore !== 100) {
        // 남아있는 문제의 총점이 100점인지 확인합니다.
        alert("총 점수가 100점이 되질 않습니다.");
        return;
      }

      // 업데이트할 문제와 삭제할 문제를 별도로 처리합니다.
      const updatedQuestions = JSON.parse(JSON.stringify(this.tempQuestions));
      const deletedQuestionsCopy = JSON.parse(
        JSON.stringify(
          this.deletedQuestions.length ? this.deletedQuestions : []
        )
      );

      console.log("Updated Questions:", updatedQuestions);
      console.log("Deleted Questions:", deletedQuestionsCopy);

      this.$emit("updateExam", {
        action: "U",
        courseNo: this.courseNo,
        testCategory: this.testCategory,
        questions: updatedQuestions,
        deletedQuestions: deletedQuestionsCopy,
      });
    },
    confirmDeleteExam() {
      if (confirm("정말로 시험을 삭제하시겠습니까?")) {
        this.$emit("deleteExam", {
          courseNo: this.courseNo,
          testCategory: this.testCategory,
        });
      }
    },
    toggleSelectAll() {
      this.selectedQuestions = this.selectAll
        ? this.tempQuestions.map((_, index) => index)
        : [];
    },
  },
};
</script>

<style scoped>
.modal-header {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px;
  position: relative;
}

.course-subject {
  background-color: #e0f7fa;
  padding: 10px 40px;
  border-radius: 5px;
  font-weight: bold;
  position: absolute;
  left: 0;
}

.course-name {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  flex-grow: 0;
}

.form-group label {
  margin-top: 20px;
}

.v-dialog__content {
  max-height: 100vh;
  height: auto;
}

.form-group {
  margin-bottom: 15px;
}

.form-group:last-of-type {
  margin-bottom: 40px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #dfdfdf;
  box-sizing: border-box;
}

.dropdown-container {
  position: relative;
}

.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}

.insert-button,
.addQuestion-button,
.removeQuestion-button {
  padding: 10px 17px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 50px;
}

.main-button-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 60px;
}

.insert-button {
  background-color: #007bff;
  color: white;
  margin-left: 10px;
}

.insert-button:hover {
  background-color: #0056b3;
}

.addQuestion-button {
  background-color: #007bff;
  color: white;
}

.addQuestion-button:hover {
  background-color: #0056b3;
}

.removeQuestion-button {
  background-color: #d32f2f;
  color: white;
  margin-left: 10px;
}

.removeQuestion-button:hover {
  background-color: #e57373;
}

.modal-input {
  max-width: 100%;
  white-space: normal;
  overflow: visible;
  text-overflow: initial;
}

.score-display {
  font-weight: bold;
  font-size: 16px;
  margin-top: 10px;
}
</style>
