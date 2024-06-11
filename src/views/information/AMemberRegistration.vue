<template>
  <v-container fluid>
    <v-card class="registration-card">
      <v-card-title class="d-flex align-center">
        <div class="titletext">회원등록</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-card-text>
        <v-form>
          <!-- 값은 들어옴 + css 수정 필요--> 
           <div  class="form-group">
            <select id="userType" class="form-group"  v-model="user_type">
              <option  v-for="(type, index) in user_types" :key="index" :value="type.value" >{{ ' ' + type.text }}</option>
            </select>
           </div>
          <div class="form-group">
            <v-text-field
              label="이름"  
              v-model="name"
              outlined
              dense
            ></v-text-field>
          </div>
          <div class="form-group">
            <v-text-field
              label="휴대폰 번호"
              type="number"
              v-model="hp"
              outlined
              dense
            ></v-text-field>
            {{"*주의: - 를 제외하고 입력해 주세요."}}
          </div>
          <div  id="loginID">
            <v-text-field
              label="아이디"
              v-model="loginID"
              outlined
              dense
            ></v-text-field>
            <v-btn id="checkId-button" @click="doCheckDuplicId">중복 확인</v-btn>
          </div>
          <div class="form-group">
            <v-text-field
              label="비밀번호"
              type="password"
              v-model="password"
              outlined
              dense
            ></v-text-field>
          </div>
          <div class="form-group">
            <v-text-field
              label="비밀번호 확인"
              type="password"
              v-model="confirmPassword"
              outlined
              dense
            ></v-text-field>
          </div>

          <div class="form-group">
            <v-text-field
              label="메일"
              v-model="email"
              outlined
              dense
            ></v-text-field>
          </div>
          <div class="form-group">
            <template v-if="paction === 'U'">
              <div class="form-group">
                <v-btn class="update-button" @click="updateMember">수정</v-btn>
              </div>
              <div class="form-group">
                <v-btn class="delete-button" @click="deleteMember">삭제</v-btn>
              </div>
            </template>

            <template v-else>
              <div class="form-group">
                <v-btn class="register-button" @click="registerMember"
                  >등록</v-btn
                >
              </div>
            </template>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
export default {
  props: {
    action: String,
  },
  data() {
    return {
       user_types: [
        { text: "관리자", value: "a" },
        { text: "강사", value: "t" },
        { text: "학생", value: "s" }
      ],
      user_type: "a",
      name: "",
      hp: "",
      loginID: "",
      password: "",
      confirmPassword: "",
      email:"",
      idCount:0,
      years: [],
      months: [],
      days: [],
      paction: this.action,
    };
  },
  mounted() {
    this.initializeDates();
  },
  methods: {
    searchPostalCode() {},
    doCheckDuplicId(){
      const params = new URLSearchParams();
      console.log(this.loginID);
      params.append('loginID', this.loginID);
      const idRegex = new RegExp('^(?![0-9!@#$%^&*()-+=])[a-zA-z0-9]{3,8}');  // 숫자 또는 부호로 시작하는 것을 부정하는 부정형 전방 탐색
      const isIdPattern = idRegex.test(this.loginID);

      this.axios
      .post('/api/doCheckDuplicLoginID.do', params)
      .then(result => {

        if(result.data > 0 ) {
          this.idCount = result.data;
          alert(`${this.loginID} 아이디가 이미 존재합니다!`);
          return false;
        } else if(this.loginID.length < 3 ){
          alert('고객님 아이디를 3글자 이상으로 입력해주세요');
          return false;
        } else if(!isIdPattern ){
          alert('아이디가 숫자 또는 부호로 시작할 수 없습니다.')
        }else {
          this.idCount = result.data;
          alert(`${this.loginID} 아이디 사용이 정상적으로 사용이 가능합니다!`);
          return true;
        }
      })
    },
    initializeDates() {

    },
    registerMember() {
        //시작 전 회원 아이디 존재 
        console.log("회원가입 시작요!")
        try{
            //const mail_regex = new RegExp('[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,3}$');
            //const isMailTrue = mail_regex.test(this.email)
            const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
            const isEmailTrue = email_regex.test(email_regex);
            const ph_regex = new RegExp('[0-9]{10,11}');
            const isPhTrue = ph_regex.test(this.hp);
          if(this.user_type === ''){
            alert('멤버 유형이 없습니다!')
            return false;
          }else if(this.name === ''){
            alert('이름이 없습니다!');
            return false;
          }else if(this.hp === ''){
            alert('휴대폰 번호를 입력해 주세요!')
            return false;
          }else if(!isPhTrue){
            alert('휴대폰 번호 형식을 확인해 주세요!')
            return false;
          }else if(this.loginID === null || this.loginID === ''){
            alert('아이디가 빈칸입니다!');
            return false;
          }else if(this.idCount  > 0){
            alert('아이디가 존재합니다. 아이디 중복 확인해주세요!');
          }else if(this.password != this.confirmPassword){
            alert('비밀번호가 일치하지 않습니다! ');
            return false;
          }else if(this.email === ''){
            alert('메일이 빈칸입니다!')
          }else if(!isEmailTrue){
            alert('메일 형식을 확인해 주세요!')
            return false;
          }else {
            console.log("loginID:" + this.loginID, this.password, this.name, this.email, this.user_type);
            const params = new URLSearchParams();
            params.append('action', "I");
            params.append('loginID', this.loginID);
            params.append('user_type', this.user_type);
            params.append('name', this.name);
            params.append('hp', this.hp);
            params.append('password', this.password);
            params.append('email', this.email);
            this.axios
            .post('/api/register.do', params)
            .then(res => res.status === 200? window.location.reload() : alert('회원등록이 정상적으로 되지 않았습니다! ') );
            alert("회원 가입이 정상적으로 되었습니다!")
          }

        } catch(e) {
            console.error(e);
          }


  },
    delMember() {},
  },
};
</script>

<style scoped>
#loginID{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center; 
  margin-bottom: 16px;
}
#checkId-button{
  color: white;
  font-weight: bold;
  height: 50px;
  margin-bottom: 18px;
  margin-left: 5px;
  transition: background-color 0.5s;
  background-color:#007bff;
}
#checkId-button:hover{
  background-color:#4B89DC;
}

#userType{
  width: 100%;
  padding: 10px 0;
  border-radius: 4px;
  margin-bottom: 16px;
}

.registration-card {
  margin: 20px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #fff;
}

.titletext {
  font-size: 24px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 16px;
}

.postal-code-group {
  display: flex;
  align-items: center;
}

.postal-code-group .search-button {
  margin-left: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.search-button:hover {
  background-color: #0056b3;
}

.register-button,
.update-button {
  width: 100%;
  padding: 10px 0;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover,
.update-button:hover {
  background-color: #0056b3;
}

.delete-button {
  width: 100%;
  padding: 10px 0;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.delete-button:hover {
  background-color: #a33030;
}
</style>
