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
            <input type="text" class="search-input" placeholder="검색어를 입력해주세요." v-model="stitle" @keydown.enter="handleSearch" />
          </div>
          <div class="button-group">
            <button class="search-button" @click="handleSearch">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>글번호</th>
            <th>과목명</th>
            <th>강의명</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in resourceList" :key="item.resource_no">
              <tr class="table_row" @click="resourceModify(item.resource_no)">
                <td>{{ item.display_no }}</td>
                <td>{{ item.course_subject }}</td>
                <td>{{ item.course_name }}</td>
                <td>
                  {{ item.resource_title }}
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.resource_created_at }}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="10" style="text-align: center">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </v-table>
    </v-card>

    <!-- 페이지네이션 추가-->
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

    <v-dialog v-model="resourceModal" max-width="600px">
      <v-card>
        <v-card-text>
          <ResourceModal :action="action" :resourceNo="resourceNo" @close-modal="closeResourceModal" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ResourceModal from "../sAlert/SResourcesModal.vue";
import Paginate from "vuejs-paginate-next";
export default {
  components: {
    ResourceModal,
    Paginate,
  },
  data() {
    return {
      titleText: "학습자료",
      resourceModal: false,
      action: "",
      selectedNotice: null,
      activeFilter: "all",
      stitle: "",
      resourceList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      resourceNo: 0,
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    resourceModify(resourceNo) {
      this.resourceModal = true;
      this.resourceNo = resourceNo;
    },

    closeResourceModal() {
      this.resourceModal = false;
      this.searchList();
    },

    handleSearch() {
      this.currentPage = 1; // 검색 시 페이지를 1페이지로 리셋
      this.searchList(); // 검색 실행
    },

    searchList: function () {
      let vm = this;

      let params = new URLSearchParams(); // 파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/sAlert/sListResources.do", params)
        .then((response) => {
          vm.resourceList = response.data.listData;
          console.log(vm.resourceList);
          vm.totalCnt = response.data.totalCnt;

          let totalData = vm.resourceList.map((item, index) => {
            item.display_no = vm.totalCnt - ((vm.currentPage - 1) * vm.pageSize + index) + 2;
            return item;
          });

          // 페이지 내에서는 최신 글이 위로 오도록 함
          vm.resourceList = totalData;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
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
      // var result = Math.ceil(this.totalCnt / this.pageSize);
      // return result;
    },
  },
};
</script>

<style scoped>
.table_row {
  cursor: pointer;
}

.dashboard-card {
  margin-bottom: 20px;
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
  height: 50px;
  align-items: center;
  justify-content: flex-end;
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold !important;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}
</style>
