<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <div class="container">
        <div class="filter-button-group">
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'all' }"
            @click="findAll"
            >전체</v-btn
          >
          <v-btn
            :class="{ 'filter-button': true, active: activeFilter === 'admin' }"
            @click="findAdmins"
            >관리자</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'teacher',
            }"
            @click="findTeachers"
            >강사</v-btn
          >
          <v-btn
            :class="{
              'filter-button': true,
              active: activeFilter === 'student',
            }"
            @click="findStudents"
            >학생</v-btn
          >
        </div>

        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
            <input
              type="text"
              class="search-input"
              placeholder="검색어를 입력해주세요."
              v-model="search_word"
            />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchForUser">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>
      <v-table class="dashboard-table" >
        <thead>
          <tr>
            <th>회원유형</th>
            <th>아이디</th>
            <th>이름</th>
            <th>이메일</th>
            <th>휴대전화</th>
            <th> 회원수정 </th>
            <th>출석</th>
          </tr>
        </thead>
        <!-- 전체 조회 -->
        <tbody v-if="activeFilter !== 'a' && activeFilter !== 't' && activeFilter !== 's'&& activeFilter !== 'search' ">
          <tr v-for="(person, index) in people" :key="index"> 
            <td>{{person.user_type}}</td>
            <td>{{person.loginID}}</td>
            <td>{{person.name}}</td>
            <td>{{person.email}}</td>
            <td>{{person.hp}}</td>
            <td><button id="edit" @click="EditMemberModal(person.loginID, person.hp, person.name, person.email)"> 편집</button></td>
            <td><a href=""></a></td>
          </tr>
        </tbody>
        <!-- 관리자 조회 -->
        <tbody v-if="activeFilter !== 'all' && activeFilter !== 't' && activeFilter !== 's' && activeFilter !== 'search' ">
          <tr v-for="(admin, index) in admins" :key="index"> 
            <td>{{admin.user_type}}</td>
            <td>{{admin.loginID}}</td>
            <td>{{admin.name}}</td>
            <td>{{admin.email}}</td>
            <td>{{admin.hp}}</td>
            <td><button id="edit" @click="EditMemberModal(admin.loginID, admin.hp, admin.name, admin.email)" >편집</button></td>
            <td><a href=""></a></td>
          </tr>
        </tbody>
        <!-- 강사 조회 -->
        <tbody v-if="activeFilter !== 'all' && activeFilter !== 'a' && activeFilter !== 's' && activeFilter !== 'search'  ">
          <tr v-for="(teacher, index) in teachers" :key="index"> 
            <td>{{teacher.user_type}}</td>
            <td>{{teacher.loginID}}</td>
            <td>{{teacher.name}}</td>
            <td>{{teacher.email}}</td>
            <td>{{teacher.hp}}</td>
            <td><button id="edit" @click="EditMemberModal(teacher.loginID, teacher.hp, teacher.name, teacher.email)" >편집</button></td>
            <td><a href=""></a></td>
          </tr>
        </tbody>
        <!-- 학생 조회 -->
        <tbody v-if="activeFilter !== 'all' && activeFilter !== 'a' && activeFilter !== 't' && activeFilter !== 'search' ">
          <tr v-for="(student, index) in students" :key="index"> 
            <td>{{student.user_type}}</td>
            <td>{{student.loginID}}</td>
            <td>{{student.name}}</td>
            <td>{{student.email}}</td>
            <td>{{student.hp}}</td>
            <td><button id="edit" @click="EditMemberModal(student.loginID, student.hp, student.name, student.email)" >편집</button></td>
            <td><a href=""></a></td>
          </tr>
        </tbody>
        <!-- 검색 -->
        <tbody v-if="activeFilter !== 'all' && activeFilter !== 'a' && activeFilter !== 't' && activeFilter !== 's'">
          <tr v-for="(user, index) in users_searched" :key="index" >
            <td>{{user.user_type}}</td>
            <td>{{user.loginID}}</td>
            <td>{{user.name}}</td>
            <td>{{user.email}}</td>
            <td>{{user.hp}}</td>
            <td><button id="edit" @click="EditMemberModal(user.loginID, user.hp, user.name, user.email)" >편집</button></td>
            <td><a href=""></a></td>
          </tr>
        </tbody>
        
      </v-table>
    </v-card>

    
    <div class="button-group">
      <button class="insert-button" @click="openRegMemberModal">등록</button>
    </div>
    <!-- 회원 등록-->
    <v-dialog v-model="RegMemberModal" max-width="600px">
      <v-card>
        <v-card-text>
          <AMemberRegistration :action="action" />
        </v-card-text>
      </v-card>
    </v-dialog>
    <!-- 사용자 정보 수정 -->
    <v-dialog v-model="EditModal" max-width="600px">
      <v-card>
        <v-card-text>
          <EditMember :action="action" v-bind:selectedID="selectedID " v-bind:selectedHP="selectedHP" v-bind:selectedNAME="selectedNAME" v-bind:selectedEMAIL="selectedEMAIL" />
        </v-card-text>
      </v-card>
    </v-dialog>


    <!-- 페이지네이션 추가-->
  </v-container>
</template>

<script>
import AMemberRegistration from "./AMemberRegistration.vue";
import EditMember from "./EditMember";
//import EditMember from './EditMember.vue';

export default {
  
  components: {
    AMemberRegistration,
    EditMember,
    
  },
  mounted() {
      let user_type = sessionStorage.getItem('user_type');
      console.log(user_type)
      if(user_type != "a"){
        alert('관리자 페이지입니다!')
        this.$router.push('/dashboard');
      } else {
        this.$router.push('/dashboard/information/hrinfo');
      }
   },
  data() {
    return {
      titleText: "인원관리",
      activeFilter: "all",
      RegMemberModal:false,
      EditModal:false,
      people:[],
      admins:[],
      teachers:[],
      students:[],
      users_searched:[],
      search_word: "",
      action:"",
      selectedID:"",
      selectedHP:"",
      selectedNAME:"",
      selectedEMAIL:""
    };
  },
  methods: {
    findAll() {
      this.activeFilter = "all";
      this.axios.get('/api/adm/doGetAllPeopleList.do')
      .then(res=>{
        this.people = res.data.allUsers;
        console.log(res)
      })
      .catch(error => {
        console.error('Error fetching data:', error)
      }) 

    },
    findAdmins() {
      this.activeFilter = 'a';
      const params = new URLSearchParams();
      params.append('user_type', this.activeFilter);
      this.axios.post('/api/adm/doGetUsersByUserType.do', params)
      .then(res => {
        this.admins = res.data.members;
      })
      .catch(error => console.error(error)); 
    },
    findTeachers() {
      this.activeFilter = 't';
      const params = new URLSearchParams();
      params.append('user_type', this.activeFilter);
      this.axios.post('/api/adm/doGetUsersByUserType.do', params)
      .then(res => {
        this.teachers = res.data.members;
      })
      .catch(error => console.error(error)); 
    },
    findStudents(){
      this.activeFilter = 's';
      const params = new URLSearchParams();
      params.append('user_type', this.activeFilter);
      this.axios.post('/api/adm/doGetUsersByUserType.do', params)
      .then(res => {
        console.log(res)
        this.students = res.data.members;
      })
      .catch(error => console.error(error)); 
    },
    searchForUser() {
      this.activeFilter = 'search';
      const params = new URLSearchParams();
      params.append('search_word', this.search_word);
      this.axios
      .post('/api/adm/doSearchForUser.do', params)
      .then(res => {
        this.users_searched = res.data.users;
      })
      .catch(error => console.error(error));

    },

    EditMemberModal(userId, hp, name, email) {
      console.log("EditMemberModal:" + userId + hp + name + email)
      this.selectedID = userId;
      this.selectedHP = hp;
      this.selectedNAME = name;
      this.selectedEMAIL = email;
      
      this.EditModal = true;
      // 이름에 대한 변수 
    },
    openRegMemberModal() {
      //this.action = "";
      this.RegMemberModal = true;
    },
    closeAddModal() {
      this.RegMemberModall = false;
    },
  },
};
</script>

<style scoped>


#edit{
  font-weight: bold;
  background-color:rgb(240, 188, 91);
  width:80%;
  height: 80%;
  border-radius: 8px;
}
.dashboard-card {
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

.container {
  display: flex;
  justify-content: space-between;
  height: 50px;
  align-items: center;
}

.filter-button-group {
  display: flex;
  margin: 16px 0;
}

.filter-button {
  background-color: #f4f6f8;
  color: #2c3e50;
  border-radius: 20px;
  padding: 8px 16px;
  margin: 0 4px;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.filter-button.active {
  background-color: #407bff;
  color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.filter-button:hover {
  background-color: #5a9bff;
}

.search {
  display: flex;
  justify-content: flex-end;
}

.search-container {
  display: flex;
  align-items: center;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 16px 0;
}

.search-icon {
  margin-right: 8px;
  color: #555;
}

.search-input {
  flex-grow: 1;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 16px;
}

.button-group {
  text-align: right;
  padding: 16px;
}

.search-button,
.insert-button {
  padding: 10px 17px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.search-button:hover,
.insert-button:hover {
  background-color: #0056b3;
}

.dashboard-table {
  width: 100%;
  /* border-collapse: collapse;  */
  margin: 16px 0;
}


.dashboard-table td {
  text-align: center;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

.dashboard-table tr th {
  text-align: center;
  background-color: #f4f4f4;
  font-weight: bold;
  padding: 12px;
  border-bottom: 1px solid #ddd;
  font-size: 15px;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
