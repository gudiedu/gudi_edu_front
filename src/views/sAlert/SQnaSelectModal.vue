<template>
  <div class="lecture-detail">
    <h2 class="title">질의응답</h2>

    <div class="form-group">
      <div class="form-label">글번호</div>
      <input type="text" name="title" class="form-input" />
    </div>
    <div class="form-group">
      <div class="form-label">작성자</div>
      <input type="text" name="author" class="form-input" />
    </div>
    <div class="form-group">
      <div class="form-label">등록일</div>
      <input type="text" name="date" class="form-input" />
    </div>
    <div class="form-group">
      <div class="form-label">제목</div>
      <input type="text" name="title" class="form-input" />
    </div>
    <div class="form-group">
      <div class="form-label">내용</div>
      <textarea name="content" class="form-textarea"></textarea>
    </div>
    <div class="form-group">
      <div class="form-label">답변</div>
      <textarea name="content" class="form-textarea"></textarea>
    </div>

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
    };
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
</style>
