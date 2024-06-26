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
            <button class="search-button" @click="searchList(stitle)">
              검색
            </button>
          </div>
        </div>
      </div>
      <v-divider></v-divider>
      <v-table class="dashboard-table">
        <thead>
          <tr>
            <th class="suggestion-no">글번호</th>
            <th>분류</th>
            <th>제목</th>
            <th>작성자</th>
            <th>등록일</th>
            <th>답변</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in pageList" :key="item.suggestion_no">
            <td
              @click="
                selectSuggestion(item.suggestion_no, item.suggestion_answered)
              "
            >
              {{ item.suggestion_no }}
            </td>
            <td
              @click="
                selectSuggestion(item.suggestion_no, item.suggestion_answered)
              "
            >
              {{ item.suggestion_category }}
            </td>
            <td
              @click="
                selectSuggestion(item.suggestion_no, item.suggestion_answered)
              "
            >
              {{ item.suggestion_title }}
            </td>
            <td>{{ item.loginID }}</td>
            <td>{{ item.suggestion_created_at }}</td>
            <td v-if="item.suggestion_answered === 'Y'">완료</td>
            <td v-else>대기중</td>
          </tr>
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
        :click-handler="pagination()"
        :prev-text="'이전'"
        :next-text="'다음'"
        :container-class="'pagination'"
        :page-class="'page-item'"
      ></paginate>
    </div>

    <v-dialog v-model="addModal" max-width="600px">
      <v-card>
        <v-card-text>
          <ASuggestionsModal
            :action="action"
            :selectedSuggestion="selectedSuggestion"
            @close="closePopup"
            @searchList="searchList"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import ASuggestionsModal from "./ASuggestionsModal.vue";
import Paginate from "vuejs-paginate-next";
export default {
  components: {
    ASuggestionsModal,
    Paginate,
  },
  data() {
    return {
      titleText: "건의사항",
      addModal: false,
      action: "",
      selectedSuggestion: {},
      activeFilter: "all",
      stitle: "",
      suggestionList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      pageList: [],
    };
  },
  mounted() {
    this.searchList();
    this.page();
  },
  methods: {
    /**
     * 건의사항 전체 조회 메서드
     * @param {String} stitle - 검색어
     */
    searchList: function (stitle) {
      let vm = this;

      if (stitle !== undefined) {
        vm.stitle = stitle;
      }

      let params = new URLSearchParams();
      params.append("stitle", this.stitle);

      this.axios
        .post("/aSuggestion", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          this.suggestionList = response.data;
          this.totalCnt = this.suggestionList.length;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },
    /**
     * 선택된 건의사항 저장 및 모달 open
     * @param {Number} suggestionNo - 건의사항 번호
     * @param {String} suggestionAnswered - 답변 여부
     */
    selectSuggestion(suggestionNo, suggestionAnswered) {
      this.selectedSuggestion = {
        suggestion_no: suggestionNo,
        suggestion_answered: suggestionAnswered,
      };
      this.openPopup();
    },
    /**
     * 건의사항 수정 메서드
     * @param {Property} suggestion - 건의 사항 번호, 답변 여부가 포함된 객체
     */
    suggestionModify(suggestion) {
      this.selectedSuggestion = suggestion;
      this.addModal = true;
    },
    openPopup: async function () {
      this.addModal = true;
    },
    closePopup: async function () {
      this.addModal = false;
    },
    page: function () {
      let total = this.totalCnt;
      let page = this.pageSize;
      let xx = total % page;
      let result = parseInt(total / page);

      if (xx == 0) {
        return result;
      } else {
        result = result + 1;
        return result;
      }
    },
    pagination() {
      let endElement = this.currentPage * this.pageSize;
      let startElement = endElement - this.pageSize;
      this.pageList = this.suggestionList.slice(startElement, endElement);
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
  cursor: pointer;
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

.search-container {
  display: flex;
  align-items: center;
  /* padding: 10px; */
  /* padding: 20px; */
  border: 1px solid #ccc;
  border-radius: 25px;
  margin: 16px 0;
}

.search-icon {
  margin: 8px;
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

.suggestion-no {
  width: 80px;
}
</style>
