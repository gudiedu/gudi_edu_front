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
              @keyup.enter="searchMethod"
              @input="handleInputChange"
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
            <th class="centered">번호</th>
            <th class="centered">제목</th>
            <th class="centered">강의명</th>
            <th class="centered">작성자</th>
            <th class="centered">등록일</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in lectureItems" :key="item.resource_no">
            <td class="centered">{{ (currentPage - 1) * pageSize + index + 1 }}</td>
            <td @click="learningMaterialsModify(item)" class="centered clickable">{{ item.resource_title }}</td>
            <td @click="learningMaterialsModify(item)" class="centered clickable">{{ item.course_name }}</td>
            <td class="centered">{{ item.name }}</td>
            <td class="centered">{{ item.resource_created_at }}</td>
          </tr>
          <tr v-if="lectureItems.length === 0">
            <!-- 데이터가 없을 때 표시되는 행 -->
            <td colspan="5" class="text-center">조회된 데이터가 없습니다.</td>
          </tr>
        </tbody>
      </v-table>

      <div class="pagination">
        <paginate
          v-model="currentPage"
          :page-count="Math.max(pageCount, 1)"
          :page-range="3"
          :margin-pages="2"
          :click-handler="handlePageChange"
          :container-class="'pagination-container'"
          :page-class="'pagination-page'"
          :prev-text="'이전'"
          :next-text="'다음'"
        ></paginate>
      </div>
    </v-card>

    <div class="button-group">
      <button class="insert-button" @click="openAddModal">등록</button>
    </div>

    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <TResourcesModal :action="'C'" @close="closeAddModal" />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="modifyModal" max-width="600px">
      <v-card>
        <v-card-text>
          <TResourcesModal :action="'U'" :materials="selectedNotice" @close="closeModifyModal" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TResourcesModal from "./TResourcesModal.vue";
import axios from 'axios';
import Paginate from 'vuejs-paginate-next';

export default {
  components: {
    TResourcesModal,
    Paginate,
  },
  data() {
    return {
      titleText: "학습자료",
      addModal: false,
      modifyModal: false,
      selectedNotice: null,
      stitle: "",
      lectureItems: [],
      currentPage: 1,
      pageSize: 5,
      totalItems: 0,
    };
  },
  created() {
    this.fetchResourceList();
  },
  watch: {
    stitle(newVal) {
      if (newVal === "") {
        this.fetchResourceList();
      }
    },
  },
  methods: {
    searchMethod() {
      this.fetchResourceList();
    },
    handleInputChange() {
      if (this.stitle === "") {
        this.fetchResourceList();
      }
    },
    fetchResourceList() {
      axios.get('/tCourse/resourceList', {
        params: {
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          stitle: this.stitle // 검색어 추가
        }
      })
        .then(response => {
          this.lectureItems = response.data.resourceList;
          this.totalItems = response.data.totalCnt;
          console.log(this.lectureItems);
        })
        .catch(error => {
          console.error("There was an error fetching the resource list!", error);
        });
    },
    handlePageChange(pageNum) {
      this.currentPage = pageNum;
      this.fetchResourceList();
    },
    openAddModal() {
      this.addModal = true;
    },
    closeAddModal() {
      this.addModal = false;
      this.fetchResourceList(); // 모달을 닫을 때 목록을 갱신
    },
    learningMaterialsModify(materials) {
      this.selectedNotice = materials;
      this.modifyModal = true;
    },
    closeModifyModal() {
      this.modifyModal = false;
      this.fetchResourceList(); // 모달을 닫을 때 목록을 갱신
    },
  },
  computed: {
    pageCount() {
      return Math.ceil(this.totalItems / this.pageSize);
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
  height: 50px;
  align-items: center;
  justify-content: flex-end;
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
  text-align: center;
  vertical-align: middle;
  border-bottom: 1px solid #ddd;
  font-size: 16px;
  color: #000;
}

.dashboard-table th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.dashboard-table tr:hover {
  background-color: #f1f1f1;
}

.clickable {
  cursor: pointer;
  color: #000;
}

.clickable:hover {
  text-decoration: underline;
}

.dashboard-table td:nth-child(4) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
}

.centered {
  text-align: center !important;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  flex-wrap: wrap-reverse;
}

.pagination-page {
  margin: 0 5px;
  padding: 8px 12px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  border-radius: 10px;
}

.pagination-page:hover {
  background-color: #0056b3;
}

.no-data-message {
  text-align: center;
  font-size: 18px;
  color: #888;
  padding: 20px;
}
</style>
