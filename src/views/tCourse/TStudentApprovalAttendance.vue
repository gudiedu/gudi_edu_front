<template>
  <v-table class="dashboard-table">
    <thead>
      <tr>
        <th>이름</th>
        <th>연락처</th>
        <th>이메일</th>
        <th>설문</th>
        <th>점수</th>
        <th>승인여부</th>
        <template v-if="this.stateMsg === '진행예정'">
          <th>승인/취소</th>
        </template>
      </tr>
    </thead>
    <tbody>
      <template v-if="totalCnt > 0">
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.name }}</td>
          <td>{{ user.hp }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.survey_exists }}</td>
          <td>{{ user.grade }}</td>
          <td>{{ user.enrollment_confirmed }}</td>
          <template v-if="this.stateMsg === '진행예정'">
            <td>
              <button class="confirm-button" @click="toggleApproval(index)">
                {{ user.enrollment_confirmed === "Y" ? "취소" : "승인" }}
              </button>
            </td>
          </template>
        </tr>
      </template>
      <template v-else>
        <tr>
          <td colspan="7">조회된 데이터가 없습니다.</td>
        </tr>
      </template>
    </tbody>
  </v-table>

  <div id="noticePagination">
    <paginate
      class="justify-content-center"
      v-model="currentPage"
      :page-count="page()"
      :page-range="5"
      :margin-pages="0"
      :click-handler="searchList"
      :prev-text="'이전'"
      :next-text="'다음'"
      :container-class="'pagination'"
      :page-class="'page-item'"
    ></paginate>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";

export default {
  components: { Paginate },
  props: {
    courseNo: Number,
    stateMsg: String,
  },
  data() {
    return {
      users: [],
      status: "",
      enno: "",
      totalCnt: 0,
      pageSize: 5,
      currentPage: 1,
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    searchList: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append("courseNo", this.courseNo);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/tCourse/listEnrollment", params)
        .then((response) => {
          // console.log(JSON.stringify(response))

          vm.users = response.data.listdata;
          vm.totalCnt = response.data.totalcnt;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    enyn() {
      //alert(this.enno);
      let params = new URLSearchParams();
      params.append("courseNo", this.courseNo);
      params.append("status", this.status);
      params.append("enNo", this.enno);

      this.axios
        .post("/tCourse/updateEnroll", params)
        .then((response) => {
          // console.log(JSON.stringify(response))
          alert(response.data.resultMsg);
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    toggleApproval(index) {
      //enrollment_confirmed
      if (this.users[index].enrollment_confirmed === "Y") {
        this.enno = this.users[index].enrollment_no;
        this.status = "cancel";
        this.enyn();

        this.users[index].enrollment_confirmed = "N";
        this.$emit("execute-search-list");
      } else {
        this.enno = this.users[index].enrollment_no;
        this.status = "approval";
        this.enyn();

        this.users[index].enrollment_confirmed = "Y";
        this.$emit("execute-search-list");
      }
    },
    page: function () {
      var total = this.totalCnt;
      var page = this.pageSize;
      var xx = total % page;
      var result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
  },
};
</script>

<style scoped>
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
  font-size: 14px;
  width: 200px;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

button {
  padding: 8px 16px;
  border: none;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  border-radius: 4px;
}

button:hover {
  background-color: #0056b3;
}

.confirm-button {
  display: flex;
  width: 55px;
  height: 35px;
  align-items: center;
  background-color: #ffffff;
  color: #407bff;
  border: 1px solid #407bff;
  border-radius: 10px;
  padding: 0px 14px;
  font-size: 12px;
  font-weight: 600;
}

.confirm-button:hover {
  display: flex;
  width: 55px;
  height: 35px;
  align-items: center;
  background-color: #407bff;
  color: #ffffff;
  border: 1px solid #ffffff;
  border-radius: 10px;
  padding: 0px 14px;
  font-size: 12px;
  font-weight: 600;
}
</style>
