<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <div class="container">


        <div class="search">
          <div class="search-container">
            <v-icon class="search-icon">mdi-magnify</v-icon>
            <input
              type="text"
              class="search-input"
              placeholder="검색어를 입력해주세요."
              v-model="stitle"
            />
          </div>
          <div class="button-group">
            <button class="search-button" @click="searchMethod">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>번호</th>
            <th>설문코드</th>
            <th>설문조사명</th>
            <th>총문항수</th>
            <th>객관식문항수</th>
            <th>주관식문항수</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in surveyList" :key="item.survey_no">
            <td>{{ index + 1 }}</td>
            <td>{{ item.survey_no }}</td>
            <td  @click="surveyRegister(item.survey_no, item.survey_name)">{{ item.survey_name }}</td>
            <td>{{ item.total_questions }}</td>
            <td>{{ item.choice_questions }}</td>
            <td>{{ item.written_questions }}</td>
            <td @click="surveyModify(item)"><img src="https://cdn-icons-png.flaticon.com/512/17/17452.png" alt="setting" width="20" height="20"></td>
          </tr>
         
        </tbody>
      </v-table>
    </v-card>

    <!-- 페이지네이션 추가-->
    <!-- 설문지 세트 만들기 추가 -->

    <div class="button-group">
      <button class="insert-button" @click="openAddModal">설문지 등록</button>
    </div>
    <v-dialog v-model="addModal" max-width="800px">
      <v-card>
        <v-card-text>
          <ASurveyManagementModal 
            :action="action" 
            :survey_no="survey_no" 
            :survey_name="survey_name" 
            @close="closeAddModal" 
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from 'axios';
import ASurveyManagementModal from "./ASurveyManagementModal.vue";
export default {
  components: { ASurveyManagementModal },
  data() {
    return {
      titleText: "설문조사문항관리",
      addModal: false,
      action: "",
      activeFilter: "all",
      selectedNotice: null,
      stitle: "",
      surveyList: [], //설문지 리스트 목록 저장할 배열
      survey_no: "",
      survey_name: "",
    };
  },
  mounted(){
    this.getSurveyList();
  },


  methods: {
    getSurveyList(){
      axios.get('/survey/SurveyList.do')
      .then(response => {
      console.log('SurveyList response:', response.data); // 전체 응답 데이터 콘솔 출력
      this.surveyList = response.data.listdate; // 데이터 바인딩
      console.log('SurveyList:', this.surveyList); // 바인딩된 데이터 콘솔 출력
    })
    .catch(error => {
      console.error('Error fetching surveyList:', error);
    });
    },

    surveyModify(survey){
      this.selectedNotice = survey;
      this.survey_no = survey.survey_no;
      this.survey_name = survey.survey_name;
      this.action = "U";
      this.addModal = true;
      
    },
    

    findAll() {
      this.activeFilter = "all";
    },
    findAdmin() {
      this.activeFilter = "admin";
    },
    findTeacher() {
      this.activeFilter = "teacher";
    },
    searchMethod() {},

    surveyRegister(survey_no,survey_name) {
      this.$router.push({
        name: "aSurveyQuestion",
        params: { 
          survey_no,
          survey_name
         },
      });
    },
    
    openAddModal() {
      this.action = "";
      this.survey_no = "";
      this.survey_name = "";
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
      this.getSurveyList();
    },
  },
};
</script>

<style scoped>
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
  justify-content: flex-end;
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
  border-collapse: collapse;
  margin: 16px 0;
}

.dashboard-table th,
.dashboard-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
