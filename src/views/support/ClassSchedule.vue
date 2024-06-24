<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <v-card-title class="d-flex align-center pe-2">
        <div class="titletext">{{ titleText }}</div>
        <v-spacer></v-spacer>
      </v-card-title>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>날짜</th>
            <th>공휴일</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in schedulelist" :key="item.dayoff_no">
              <tr>
                <td @click="holidayModify(item.dayoff_no)">
                  {{ item.dayoff_date }}
                </td>
                <td @click="holidayModify(item.dayoff_no)">
                  {{ item.dayoff_detail }}
                </td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="2">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>

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

    <!-- 페이지네이션 추가-->

    <div class="button-group">
      <!-- <button class="insert-button" @click="publicApi" style="margin-right:20px; float:left;">공공데이터 가져오기</button> -->
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>
    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <TClassScheduleManagementModal
            :action="this.action"
            :dayoff_no="this.dayoff_no"
            @execute-search-list="searchList()"
            @close-modal="closeModal()"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TClassScheduleManagementModal from "./TClassScheduleModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: { TClassScheduleManagementModal, Paginate },
  data() {
    return {
      titleText: "공휴일관리",
      addModal: false,
      action: "",
      totalCnt: 0,
      pageSize: 5,
      currentPage: 1,
      schedulelist: [],
      dayoff_no: "",
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    searchList: function () {
      let vm = this;

      let params = new URLSearchParams();
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/support/listClassSchedule", params)
        .then((response) => {
          // console.log(JSON.stringify(response))

          vm.schedulelist = response.data.listdata;
          vm.totalCnt = response.data.totalcnt;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    publicApi() {
      if (confirm("기존 데이터를 모두 삭제합니다 진행 하시겠습니까?")) {
        this.axios
          .post("/support/apiHoliday")
          .then((response) => {
            console.log(JSON.stringify(response));
            alert(response.data.resultMsg);

            this.searchList();
          })
          .catch(function (error) {
            alert("에러! API 요청에 오류가 있습니다. " + error);
          });
      }
    },
    holidayModify(dayoff_no) {
      this.action = "U";
      this.dayoff_no = dayoff_no;
      this.addModal = true;
    },
    openAddModal() {
      this.action = "";
      this.addModal = true;
    },
    closeModal() {
      this.addModal = false;
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
  text-align: center !important;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
