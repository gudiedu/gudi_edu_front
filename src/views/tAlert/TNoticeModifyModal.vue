<template>
  <div class="lecture-detail">
    <h2 class="title">공지사항</h2>

    <table class="info-table">
      <!-- <tr>
        <td class="label">번호</td>
        <td class="content">
          <input readonly type="text" pNoticeNo="pNoticeNo" v-model="pNoticeNo" class="form-input" />
        </td>
      </tr> -->

      <tr>
        <td class="label">제목</td>
        <td class="content">{{ noticeTitle }}</td>
      </tr>

      <tr>
        <td class="label">작성자</td>
        <td class="content">
          {{ userLoginId }}
        </td>
      </tr>

      <tr>
        <td class="label">등록일</td>
        <td class="content">
          {{ noticeCreatedAt }}
        </td>
      </tr>

      <tr class="content">
        <td class="label">내용</td>
        <td class="content">
          <textarea readonly noticeContent="noticeContent" v-model="noticeContent" class="form-textarea"></textarea>
        </td>
      </tr>

      <tr class="content" v-if="fileName">
        <td class="label">첨부파일</td>
        <td class="content">
          <div id="preview" @click="downLoad">{{ fileName }}</div>
        </td>
      </tr>
    </table>
    <div class="button-group">
      <!-- <v-btn class="update-button" @click="updateNotice" v-if="isMyNotice">수정</v-btn> -->
      <v-btn class="delete-button" @click="deleteNotice" v-if="isMyNotice">삭제</v-btn>
      <v-btn class="cancel-button" @click="cancel">닫기</v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    action: String,
    noticeNo: Number,
  },
  data() {
    return {
      paction: this.action,
      pNoticeNo: this.noticeNo,
      noticeTitle: "",
      noticeContent: "",
      noticeCreatedAt: "",
      sessionLoginId: "",
      userLoginId: "",
      name: "",
      previewHtml: "",
      fileName: "",
    };
  },
  computed: {
    isMyNotice() {
      return this.sessionLoginId === this.userLoginId;
    },
  },

  mounted() {
    this.selectNotice();
  },

  methods: {
    selectNotice() {
      let params = new URLSearchParams();
      params.append("pNoticeNo", this.pNoticeNo);

      this.axios
        .post("/tAlert/selectNotice.do", params)
        .then((response) => {
          //console.log(JSON.stringify(response));
          console.log(response.data);

          this.sessionLoginId = response.data.loginId;
          this.userLoginId = response.data.result.loginID;
          this.noticeCreatedAt = response.data.result.notice_created_at;
          this.noticeTitle = response.data.result.notice_title;
          this.noticeContent = response.data.result.notice_content;

          console.log("Session Login ID:", this.sessionLoginId);
          console.log("User Login ID:", this.userLoginId);

          this.ext = response.data.result.file_extension;

          // //파일 이미지 보여주거나, 파일 이름 보여주기
          // if (response.data.result.file_origin === "" || response.data.result.file_origin === null) {
          //   this.previewHtml = "";
          //   this.fileName = "";
          // } else {
          //   this.previewHtml = response.data.result.file_origin;
          //   this.fileName = response.data.result.file_origin;

          //   let ext = response.data.result.file_extension;

          //   if (["jpg", "jpeg", "png", "gif"].includes(ext.toLowerCase())) {
          //     this.previewHtml = "<img src='" + response.data.result.file_local_path + "' id 'imgFile' style='width:100px; height 100px;' />";
          //   } else {
          //     this.previewHtml = response.data.result.file_origin;
          //   }
          // }

          if (response.data.result.file_origin) {
            this.fileName = response.data.result.file_origin;
          } else {
            this.fileName = "";
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    deleteNotice() {
      if (this.isMyNotice) {
        let params = new URLSearchParams();
        params.append("pNoticeNo", this.pNoticeNo);

        this.axios
          .post("/tAlert/deleteNotice.do", params)
          .then((response) => {
            if (response.data.result > 0) {
              alert(response.data.resultMsg);
              this.$emit("close-modal"); // 모달 닫기 이벤트 발생
            }
          })
          .catch((error) => {
            alert("에러! API 요청에 오류가 있습니다. " + error);
          });
      } else {
        alert("삭제할 수 없습니다");
      }
    },

    cancel() {
      // 취소 로직을 여기에 추가
      this.$router.go(-1);
    },

    downLoad: function () {
      let params = new URLSearchParams();
      params.append("pNoticeNo", this.pNoticeNo);

      this.axios({
        url: "/tAlert/noticeFileDownload.do",
        data: params,
        method: "POST",
        responseType: "blob", //파일에 대한 내용을 받으려면 추가해줘야 한다.
      }).then((response) => {
        //브라우저 있는 자바스크립 버전은 사용안함, node.js꺼 사용 => 그래서 이런 작업을 처리 해야함
        console.log(response);
        console.log(response.data);
        //Blob 데이터를 이진파일로 변환, 파일 데이터를 받아 바이너리 데이터로 만든 후 URL을 만든다.
        let FILE = window.URL.createObjectURL(new Blob([response.data]));
        //a 태그를 만들어서 이 태그 안에 파일 이름을 넣어
        let docUrl = document.createElement("a");
        docUrl.href = FILE;
        docUrl.setAttribute("download", this.fileName);
        document.body.appendChild(docUrl); //만든 a태그를 끼어넣어
        docUrl.click(); //강제로 클릭하게 만들어 //url을 클릭하면 다운로드가 됨
        //console.log('FILE : ' + FILE)
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

.update-button,
.delete-button,
.cancel-button {
  /* padding: 10px 16px; */
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.update-button {
  background-color: #407bff;
}

.update-button:hover {
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

.cancel-button {
  background-color: #686767;
  margin: 0;
}

.cancel-button:hover {
  background-color: #c2c2c2;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

#preview {
  cursor: pointer;
  color: #407bff;
  text-decoration: underline;
  display: inline-block;
  margin-top: 10px;
}
</style>
