<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="titleHeader">
        <div class="titletext">내 정보 수정</div>
      </v-card-title>

      <v-divider></v-divider>

      <v-form>
        <v-card class="dashboard-card">
          <div class="form-group">
            <div class="form-label">이름</div>
            <input
              readonly
              type="text"
              name="name"
              v-model="name"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <div class="form-label">아이디</div>
            <input
              readonly
              type="text"
              name="userId"
              v-model="userId"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <div class="form-label">현재 비밀번호</div>
            <input
              type="password"
              name="currentPassword"
              v-model="currentPassword"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <div class="form-label">새 비밀번호</div>
            <input
              type="password"
              name="newPassword"
              v-model="newPassword"
              class="form-input"
              :class="{
                'password-mismatch':
                  newPassword !== confirmNewPassword &&
                  confirmNewPassword !== '',
              }"
            />
            <span
              v-if="
                newPassword !== confirmNewPassword && confirmNewPassword !== ''
              "
              class="mismatch-text"
              >새 비밀번호와 확인이 일치하지 않습니다.</span
            >
            <span
              v-if="
                newPassword === confirmNewPassword && confirmNewPassword !== ''
              "
              class="match-text"
              >일치합니다.</span
            >
          </div>

          <div class="form-group">
            <div class="form-label">새 비밀번호 확인</div>
            <input
              type="password"
              name="confirmNewPassword"
              v-model="confirmNewPassword"
              class="form-input"
              :class="{
                'password-mismatch':
                  newPassword !== confirmNewPassword && newPassword !== '',
              }"
            />
          </div>

          <div class="form-group">
            <div class="form-label">이메일</div>
            <input
              type="text"
              name="userEmail"
              v-model="userEmail"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <div class="form-label">휴대폰 번호</div>
            <input
              type="text"
              name="userPhone"
              v-model="userPhone"
              class="form-input"
            />
          </div>

          <div class="button-group">
            <v-btn
              class="update-button"
              @click="updateMyPage"
              :disabled="
                newPassword !== confirmNewPassword ||
                newPassword === '' ||
                currentPassword !== userPw
              "
              >수정</v-btn
            >
          </div>
        </v-card>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      userId: "",
      userPw: "",
      userEmail: "",
      userPhone: "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    };
  },
  mounted() {
    this.myPageInfo();
  },
  methods: {
    myPageInfo() {
      let params = new URLSearchParams(); // 파라미터를 넘길 때 사용

      this.axios
        .post("/sAlert/sMyPage.do", params)
        .then((response) => {
          this.name = response.data.listData.name;
          this.userId = response.data.listData.loginID;
          this.userPw = response.data.listData.password;
          this.userEmail = response.data.listData.email;
          this.userPhone = response.data.listData.hp;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    updateMyPage() {
      let params = new URLSearchParams(); // 파라미터를 넘길 때 사용

      params.append("userPw", this.newPassword); // 새 비밀번호로 변경
      params.append("userEmail", this.userEmail);
      params.append("userPhone", this.userPhone);

      this.axios
        .post("/sAlert/sUpdateMyPage.do", params)
        .then((response) => {
          if (response.data.result > 0) {
            alert(response.data.resultMsg);

            this.$router.push({ name: "dashboard" });
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
.titleHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.titletext {
  font-size: 24px;
  font-weight: bold;
}

.subtitletext {
  font-size: 20px;
  font-weight: bold;
}

.dashboard-card {
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
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
  text-align: right;
}

.update-button {
  /* padding: 10px 17px; */
  width: 50px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.update-button:hover {
  background-color: #0056b3;
}

.password-mismatch {
  border-color: red;
}

.mismatch-text {
  color: red;
  font-size: 12px;
}

.match-text {
  color: green;
  font-size: 12px;
}
</style>
