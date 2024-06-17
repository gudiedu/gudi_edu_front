<template>
  <v-container fluid>
    <v-card class="registration-card">
      <v-card-title class="d-flex align-center">
        <div class="titletext">{{ this.selectedID }}님의 정보 수정</div>
        <v-spacer></v-spacer>
      </v-card-title>
      <v-card-text>
        <v-form>

           <div  class="form-group">
            <select id="userType" class="form-group"  v-model="user_type">
              <option  v-for="(type, index) in user_types" :key="index" :value="type.value" >{{ ' ' + type.text }}</option>
            </select>
           </div>
           
          <div class="form-group" id="nameForm">
            <v-text-field
              v-if="nameAction === false"
              label="이름"  
              v-model="name"
              outlined 
            ></v-text-field> 
            <v-text-field
              v-if="nameAction === true"
              label="이름"  
              v-model="name_updated"
              outlined 
            ></v-text-field> 
            <v-btn id="modibtn" @click="modifyNameAction" >초기화</v-btn>
          </div>
          <div class="form-group" id="hpForm">
            <v-text-field
              v-if="hpAction === false"
              label="휴대폰 번호"

              v-model="hp"
              outlined
              dense
            ></v-text-field>
            
            <v-text-field
              v-if="hpAction === true"
              label="휴대폰 번호"
  
              v-model="hp_updated"
              outlined
              dense
            ></v-text-field>
            <v-btn id="modibtn" @click="modifyHpAction" >초기화</v-btn>
          </div>
          
          <div class="form-group" id="emailForm">
            <v-text-field
              v-if="emailAction === false"
              label="메일"
              v-model="email"
              outlined
              dense
            ></v-text-field>
            <v-text-field
              v-if="emailAction === true"
              label="메일"
              v-model="email_updated"
              outlined
              dense
            ></v-text-field>
            <v-btn id="modibtn" @click="modifyEmailAction" >초기화</v-btn>
          </div>
          <div class="form-group">
            <template v-if="paction === 'U'">
              <div class="form-group">
                <v-btn class="delete-button" @click="deleteMember">삭제</v-btn>
              </div>
            </template>

            <template v-else>
              <div class="form-group">
                <v-btn class="update-button" @click="updateUserinfo"
                  >수정</v-btn
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
export default{
  name:"EditMember",
  props:["selectedID", "selectedHP", "selectedNAME", "selectedEMAIL"],
  data(){
    return {
      user_types: [
        { text: "관리자", value: "a" },
        { text: "강사", value: "t" },
        { text: "학생", value: "s" }
      ],
      user_type:"a",
      name:this.selectedNAME,
      name_updated:"",
      email:this.selectedEMAIL,
      email_updated:"",
      hp:this.selectedHP,
      hp_updated:"",
      nameAction:false,
      hpAction:false,
      emailAction:false,
      paction: "",

    }
  },
  methods:{
     modifyNameAction(){
      //(status) => !status;
      this.nameAction = true;
     },
     modifyHpAction(){
      this.hpAction = true;
     },
     modifyEmailAction(){
      this.emailAction = true;
     },
     updateUserinfo(){

      const selectedName = this.nameAction ? this.name_updated : this.name;
      
      const name_regEx = /^[a-zA-Z0-9]{2,}/i;
      const isName = name_regEx.test(selectedName);
      const email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
      const selectedEmail = this.emailAction ? this.email_updated : this.email;
      const isEmailTrue = email_regex.test(selectedEmail);  
      
      const ph_regex = /^[0-9]{10,11}$/i;
      const selectedPh = this.hpAction ? this.hp_updated : this.hp;
      const isPhTrue = ph_regex.test(selectedPh);
      
      if(!isName){
        alert('이름을 2글자 이상 적어주세요!')
      }else if(!isPhTrue){
        alert('휴대폰 번호 형식을 확인해 주세요!')
      } else if(!isEmailTrue){
        alert('메일 형식을 확인해 주세요!')
      } else{
        const params = new URLSearchParams();
         params.append('loginID', this.selectedID)
         params.append('user_type', this.user_type);
         params.append('name', selectedName);
         params.append('email', selectedEmail);
         params.append('hp', selectedPh);
         this.axios
         .post('/api/adm/doUpdateUserInfo.do', params)
         .then(result => result.status === 200 ?  window.location.reload() : alert('회원 정보 수정을 실패하였습니다! '))
      }
    },
  }
}

</script>

<style>



#modibtn{
  color:white;
  font-weight: bold;
  margin-left: 10px;
  background-color: rgb(167, 167, 172);
  margin-bottom: 20px;
}
#modibtn:hover{
  background-color: rgb(197, 192, 192);
}

#nameForm{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
#hpForm{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
#emailForm{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
  text-align: center;
  font-size: 24px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 16px;
}


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