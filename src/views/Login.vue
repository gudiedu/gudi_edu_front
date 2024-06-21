<template>
  <div id="background_board">
    <div class="login_form shadow" align="center">
      <div class="login-form-right-side" style="font-size: 15px">
        <div class="top-logo-wrap">
          <img id="login-logo" src="@/assets/images/admin/login/loginImg.png" />
        </div>
      </div>
      <div class="login-form-left-side">
        <fieldset>
          <legend>로그인</legend>
          <h1>GUDI Login</h1>
          <p class="id">
            <!-- <label for="userId">아이디</label> -->
            <input
              v-model="loginId"
              type="text"
              placeholder="아이디"
              style="ime-mode: inactive"
              id="userId"
              ref="userId"
            />
          </p>
          <p class="pw">
            <!-- <label for="userPwd">비밀번호</label> -->
            <input
              v-model="pwd"
              type="password"
              placeholder="비밀번호"
              onfocus="this.placeholder=''; return true"
              id="userPwd"
              ref="userPwd"
            />
          </p>
          <p class="member_info">
            <input v-model="saveId" id="cb_saveId" type="checkbox" />
            <span class="id_save">ID저장</span>
          </p>
          <!-- <div>
            <a href="" id="RegisterBtn" name="modal"
              ><strong>[회원가입]</strong></a
            >
            <a href=""><strong>[아이디/비밀번호 찾기]</strong></a>
          </div> -->
          <!-- Login Btn -->
          <a class="btn_login" id="btn_login" @click="fLoginProc($event)">
            <strong>로그인</strong>
          </a>
        </fieldset>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/css/admin/login.css";
export default {
  data: function() {
    return {
      loginID: "",
      password: "",
      saveId: false,    //기존 false
    }
  },
  mounted() {
    let id = this.getCookie("LOGIN_ID")
    console.log('id:::' + id)
    this.loginId = id
    this.saveId = id != "" ? true : false    //this.saveId = id != "" ? true : false

    //document.querySelector("#userPwd")
    //document.getElementById("userPwd")
    //$('#userPwd').focus()
    //this.$refs.userPwd.focus()
  },
  methods: {
    fLoginProc: function(event) {
      console.log("event객체")
      console.log(event)
      event.preventDefault();
      
      console.log('saveId::' + this.saveId)
      // cookie 1일 설정
      this.setCookie("LOGIN_ID", this.loginId, 1)  //false his.setCookie("LOGIN_ID", this.loginId, this.saveId == true ? 7 : -1) 
      //로그인 전에 필수 체크
      if(this.$refs.userId.value == "") {
        alert("로그인 ID를 입력하세요.")
        this.$refs.userId.focus()
        return false
      } else if(this.$refs.userPwd.value == "") {
        alert("비밀번호를 입력하세요.")
        this.$refs.userPwd.focus()
        return false
      } 

      const params = new URLSearchParams();
      params.append('loginID', this.loginId);
      params.append('password', this.pwd);
      this.axios.post('/api/loginProc.do', params)
      .then(res => {
        console.log("res:")
        console.log(res)
        let data = res.data;
        if(data.result == "SUCCESS") {
          this.$store.commit("setLoginInfo", {
            loginId: data.loginId,
            userNm: data.name,
            userType: data.user_type,
            usrMnuAtrt: data.usrMnuAtrt,
          })
          
          sessionStorage.setItem('loginInfo', JSON.stringify(data))
          sessionStorage.setItem('loginID', data.loginId)
          sessionStorage.setItem('name', data.name);
          sessionStorage.setItem('user_type', data.user_type)

          if(data.user_type === 'a'){
            this.$router.push('/dashboard/aAlert/notice');
          } else if(data.user_type === 't'){
            this.$router.push('/dashboard/tAlert/notice');
          } else if(data.user_type === 's'){
            this.$router.push('/dashboard/sAlert/notice');
          } else{
            this.$router.push('/dashboard');
          }
          //sessionStroage 값 확인
          //sessionStorage.getItem("세션값:" + JSON.stringify(data.loginId))
        } else {
          alert("ID 혹은 비밀번호가 틀립니다.");
        }
      }).catch(error => {
        console.log(error);
      })
    },
    //쿠키 설정 
    setCookie: function(name, value, day) {
      let today = new Date()
      today.setDate(today.getDate() + day)
      document.cookie = name + "=" + value +"; path=/; expires=" 
      + today.toUTCString() + ";"
      console.log("document.cookie:"  + document.cookie) //LOGIN_ID=admin
    },
    getCookie: function(name) {
      //쿠키에서 loginId 값을 가져온다.
      let cookie = document.cookie + ";"
      console.log('cookie:'+ cookie);    //LOGIN_ID=admin;
      let idx = cookie.indexOf(name, 0) // 0은 찾기 시작하는 위치
      let val = "";
      console.log('idx::' + idx)
      if(idx > -1){
        cookie = cookie.substring(idx, cookie.length)  //LOGIN_ID=admin;
        let begin = cookie.indexOf("=", 0) + 1



        
        let end = cookie.indexOf(";", begin)
        val = cookie.substring(begin, end)
      }
      console.log('val::' + val)
      return val
    },

  }
}
</script>

<style>
.member_info > .id_save {
  font-size: 15px;
}
#login-logo {
  width: 500px;
}
#cb_saveId {
  vertical-align: baseline;
  margin-right: 5px;
}
.id input,
.pw input {
  border-radius: 10px;
  background: #ffffff;
  position: relative;
  margin-bottom: 18px;
  display: flex;
  flex-direction: row;
  padding: 14.3px 0 15.5px 16.9px;
  width: 380px;
  box-sizing: border-box;
}
</style>
