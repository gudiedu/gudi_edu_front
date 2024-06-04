<template>
  <div class="lecture-detail">
    <h2 class="title">공지사항</h2>

    <div class="form-group">
      <div class="form-label">글번호</div>
      <input type="text" name="title" class="form-input" :value="notice_no" />
    </div>
    <div class="form-group">
      <div class="form-label">제목</div>
      <input
        type="text"
        name="author"
        class="form-input"
        v-model="notice_title"
      />
    </div>
    <div class="form-group">
      <div class="form-label">작성자</div>
      <input type="text" name="date" class="form-input" :value="loginID" />
    </div>
    <div class="form-group">
      <div class="form-label">등록일</div>
      <input
        type="text"
        name="title"
        class="form-input"
        :value="notice_created_at"
      />
    </div>
    <div class="form-group">
      <div class="form-label">내용</div>
      <textarea name="content" class="form-textarea">
        {{ notice_content }}
      </textarea>
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
export default {
  props: {
    action: String,
    notice_title: String,
    loginID: String,
    notice_content: String,
    notice_created_at: String,
    notice_no: Number,
  },
  data() {
    return {
      paction: this.action,
      notice_title: this.notice_title,
      loginID: this.loginID,
      notice_content: this.notice_content,
      notice_created_at: this.notice_created_at,
      notice_no: this.notice_no,

    };
  },
  mounted() {
    // console.log(notice_no, notice_created_at, notice_title, notice_content)
  },
  methods: {
    updateNotice() {},
    deleteNotice() {},
    insertNotice() {},
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
