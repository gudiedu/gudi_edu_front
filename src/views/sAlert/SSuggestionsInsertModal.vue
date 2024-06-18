<template>
  <div class="lecture-detail">
    <h2 class="title">건의사항</h2>

    <form id="file-form" enctype="multipart/form-data">
      <div class="form-group">
        <div class="form-label">제목</div>
        <input
          type="text"
          name="suggestionTitle"
          v-model="suggestionTitle"
          class="form-input"
        />
      </div>
      <div class="form-group">
        <div class="form-label">카테고리</div>
        <select
          name="suggestionCategory"
          v-model="suggestionCategory"
          class="form-input"
        >
          <option value="" disabled>카테고리를 선택하세요.</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <div class="form-label">내용</div>
        <textarea
          name="suggestionContent"
          v-model="suggestionContent"
          class="form-textarea"
        ></textarea>
      </div>

      <input
        type="file"
        id="file-insert"
        name="file-insert"
        @change="handleFileChange"
      />

      <div class="button-group">
        <v-btn class="insert-button" @click="insertSuggestion">등록</v-btn>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      suggestionTitle: "",
      suggestionContent: "",
      suggestionCategory: "",
      selectedFile: null,
      categories: ["학사", "시설", "장비", "서비스", "기타"],
    };
  },
  methods: {
    insertSuggestion() {
      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("suggestionTitle", this.suggestionTitle);
      dataWithFile.append("suggestionContent", this.suggestionContent);
      dataWithFile.append("suggestionCategory", this.suggestionCategory);
      if (this.selectedFile) {
        dataWithFile.append("file", this.selectedFile);
      }

      this.axios
        .post("/sAlert/sInsertSuggestion.do", dataWithFile)
        .then((response) => {
          if (response.data.result > 0) {
            alert(response.data.resultMsg);
            this.$emit("close-modal"); // 모달 닫기 이벤트 발생
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
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
