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
          <select class="search-category" v-model="scategory">
            <option value="" disabled>카테고리를 선택하세요.</option>
            <option value="">선택 취소</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
          <div class="button-group">
            <button class="search-button" @click="searchList">검색</button>
          </div>
        </div>
      </div>

      <v-divider></v-divider>

      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th>글번호</th>
            <th>분류</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>답변여부</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in suggestionList" :key="item.suggestion_no">
              <tr
                class="table_row"
                @click="suggestionModify(item.suggestion_no)"
              >
                <td>{{ item.suggestion_no }}</td>
                <td>{{ item.suggestion_category }}</td>
                <td>
                  {{ item.suggestion_title }}
                </td>
                <td>{{ item.name }}</td>
                <td>{{ item.suggestion_created_at }}</td>
                <td>{{ item.suggestion_answered ? "완료" : "대기중" }}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="10" style="text-align: center">
                조회된 데이터가 없습니다.
              </td>
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

    <div class="button-group">
      <button class="insert-button" @click="insertSuggestion">등록</button>
    </div>

    <v-dialog v-model="suggestionInsertModal" max-width="600px">
      <v-card>
        <v-card-text>
          <SSuggestionsInsertModal
            @close-modal="closeInsertModal"
            :action="action"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="suggestionModifyModal" max-width="600px">
      <v-card>
        <v-card-text>
          <SSuggestionsModifyModal
            @close-modal="closeModifyModal"
            :action="action"
            :suggestionNo="suggestionNo"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import SSuggestionsInsertModal from "./SSuggestionsInsertModal.vue";
import SSuggestionsModifyModal from "./SSuggestionsModifyModal.vue";
import Paginate from "vuejs-paginate-next";

export default {
  components: {
    SSuggestionsInsertModal,
    SSuggestionsModifyModal,
    Paginate,
  },
  data() {
    return {
      titleText: "건의사항",
      suggestionInsertModal: false,
      suggestionModifyModal: false,
      action: "",
      activeFilter: "all",
      stitle: "",
      scategory: "",
      suggestionList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      suggestionNo: 0,
      categories: ["학사", "시설", "장비", "서비스", "기타"],
    };
  },
  mounted() {
    this.searchList();
  },
  methods: {
    suggestionModify(suggestionNo) {
      this.suggestionNo = suggestionNo;
      this.suggestionModifyModal = true;
    },

    insertSuggestion() {
      this.suggestionInsertModal = true;
    },

    closeInsertModal() {
      this.suggestionInsertModal = false;
      this.searchList();
    },

    closeModifyModal() {
      this.suggestionModifyModal = false;
      this.searchList();
    },

    searchList() {
      let params = new URLSearchParams();
      params.append("stitle", this.stitle);
      params.append("scategory", this.scategory);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/sAlert/sSuggestionList.do", params)
        .then((response) => {
          this.suggestionList = response.data.listData;
          this.totalCnt = response.data.totalCnt;
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
    },
  },
};
</script>

<style scoped>
.table_row {
  cursor: pointer;
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
  align-items: center;
}

.search-container {
  display: flex;
  align-items: center;
  flex-grow: 1;
}

.search-input {
  flex-grow: 1;
  padding: 8px;
  border: none;
  outline: none;
  font-size: 16px;
}

.search-category {
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 16px;
  font-size: 16px;
  background-color: #fff;
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
