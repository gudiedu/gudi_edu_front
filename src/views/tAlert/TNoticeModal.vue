<template>
  <div class="lecture-detail">
    <h2 class="title">공지사항</h2>

    <form id="file-form" enctype="multipart/form-data" @submit.prevent="insertNotice">
      <table class="info-table">
        <tr>
          <td class="label">제목</td>
          <td class="content">
            <input type="text" name="noticeTitle" v-model="noticeTitle" class="form-input" />
          </td>
        </tr>
        <tr class="content">
          <td class="label">내용</td>
          <td class="content">
            <textarea name="noticeContent" v-model="noticeContent" class="form-textarea"></textarea>
          </td>
        </tr>
        <tr>
          <td class="label">파일</td>
          <td class="content">
            <input type="file" id="file-insert" name="file-insert" @change="handleFileChange" />
          </td>
        </tr>
      </table>
      <div class="button-group">
        <v-btn class="insert-button" @click="insertNotice">등록</v-btn>
        <v-btn class="cancel-button" @click="cancel">닫기</v-btn>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    //loginID: String,
  },
  data() {
    return {
      paction: this.action,
      noticeTitle: "",
      noticeContent: "",
      selectedFile: null,
    };
  },

  methods: {
    insertNotice() {
      console.log("Notice Title: ", this.noticeTitle);
      console.log("Notice Content: ", this.noticeContent);

      let formTag = document.getElementById("file-form");
      let dataWithFile = new FormData(formTag);
      dataWithFile.append("noticeTitle", this.noticeTitle);
      dataWithFile.append("noticeContent", this.noticeContent);
      // dataWithFile.append("loginID", this.loginID);

      if (this.selectedFile) {
        dataWithFile.append("file", this.selectedFile);
      }

      this.axios
        .post("/tAlert/insertNotice.do", dataWithFile)
        .then((response) => {
          console.log(JSON.stringify(response));

          if (response.data.result > 0) {
            alert(response.data.resultMsg);
            this.$emit("close-modal"); // 모달 닫기 이벤트 발생
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    cancel() {
      // 취소 로직을 여기에 추가
      this.$emit("close-modal");
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

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.info-table .label {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: center;
  border: 1px solid #ddd;
  width: 15%; /* 레이블 셀의 너비를 15%로 설정 */
  padding: 8px; /* 추가: 패딩 설정 */
}

.info-table .content {
  background-color: #ffffff;
  width: 85%; /* 내용 셀의 너비를 85%로 설정 */
  text-align: left;
  border: 1px solid #ddd;
  padding: 8px;
}

.info-table .full .content {
  width: 100%;
  text-align: left;
}

.info-table tr.full .content {
  text-align: left;
}

.form-input {
  width: 100%; /* 입력 필드의 너비를 100%로 설정 */
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
  height: 400px; /* 높이를 400px로 조정 */
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
  resize: none;
}

.content-input {
  height: 400px; /* 높이를 400px로 설정 */
  overflow-y: scroll; /* 세로 스크롤바 적용 */
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.insert-button,
.cancel-button {
  /* padding: 10px 16px; */
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.insert-button {
  background-color: #407bff;
}

.insert-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.cancel-button {
  background-color: #686767;
  margin: 0;
}

.cancel-button:hover {
  background-color: #c2c2c2;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}
</style>
