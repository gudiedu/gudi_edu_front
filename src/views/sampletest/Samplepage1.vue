<template>
  <div id="comnCodMgr">
    <p class="Location">
      <a href="/dashboard/home" class="btn_set home"></a>
      <span class="btn_nav bold">기준정보</span>
      <span class="btn_nav bold">공지사항 관리</span>
      <a href="../system/comnCodMgr.do" class="btn_set refresh">새로고침</a>
    </p>

    <p class="conTitle">
      <span>그룹 코드</span>
      <span>
        <table style="border: 1px #50bcdf" width="100%" cellpadding="5" cellspacing="0" border="1" align="left">
          <tr style="border: 0px; border-color: blue">
            <td width="50" height="25" style="font-size: 100%; text-align: left">
              <div id="searchArea" class="d-flex justify-content-around">
                제목
                <input type="text" style="width: 15%" class="form-control" v-model="stitle" />

                등록일자
                <input type="date" style="width: 15%" class="form-control" v-model="ssdate" />
                ~
                <input type="date" style="width: 15%" class="form-control" v-model="sedate" />

                <span class="fr">
                  <a class="btn btn-primary mx-2" id="searchGrpcod" name="btnSearch" @click="searchList">
                    <span>검 색</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="newReg">
                    <span>신규</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="newRegFile">
                    <span>신규파일</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="excel">
                    <span>excel</span>
                  </a>
                  <a class="btn btn-primary mx-2" name="btnNew" @click="pdf">
                    <span>PDF</span>
                  </a>
                </span>
              </div>
            </td>
          </tr>
        </table>
      </span>
    </p>

    <div class="divComGrpCodList">
      <table class="col">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="10%" />
          <col width="70%" />
          <col width="20%" />
        </colgroup>

        <thead>
          <tr>
            <th scope="col">번호</th>
            <th scope="col">제목</th>
            <th scope="col">등록일자</th>
          </tr>
        </thead>
        <tbody>
          <template v-if="totalCnt > 0">
            <template v-for="item in noticeList" :key="item.ntc_no">
              <tr>
                <td @click="noticeModify(item.ntc_no)">{{ item.ntc_no }}</td>
                <td @click="noticeModifyFile(item.ntc_no)">
                  {{ item.ntc_title }}
                </td>
                <td>{{ item.ntc_regdate }}</td>
              </tr>
            </template>
          </template>
          <template v-else>
            <tr>
              <td colspan="7">조회된 데이터가 없습니다.</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div id="noticePagination">
      <paginate class="justify-content-center" v-model="currentPage" :page-count="page()" :page-range="5"
        :margin-pages="0" :click-handler="searchList" :prev-text="'이전'" :next-text="'다음'"
        :container-class="'pagination'" :page-class="'page-item'"></paginate>
    </div>

    <div>
      <ComCombo group_code="industryCD" selectid="testSel" type="all" selvalue="" eventid="testSelEvent"
        v-model="selComboVar"></ComCombo>
      <a class="btn btn-primary mx-2" name="btnNew" @click="selVarCheck">
        <span>확인</span>
      </a>
      <a class="btn btn-primary mx-2" name="btnNew" @click="changeSel">
        <span>변경</span>
      </a>

      <br />
      <ComCombo group_code="workCD" selectid="testSelWorkCD" type="all" selvalue="" eventid="testSelEventWorkCD"
        v-model="selComboVarWorkCD"></ComCombo>
    </div>
  </div>
</template>

<script>
import { openModal } from "jenesius-vue-modal";
import Samplepage1Popup from "../sampletest/Samplepage1popup.vue";
import Samplepage1PopupFile from "../sampletest/Samplepage1popupfile.vue";
import Paginate from "vuejs-paginate-next";
import ComCombo from "@/components/common/ComCombo.vue";

export default {
  data: function () {
    return {
      stitle: "",
      ssdate: "",
      sedate: "",
      noticeList: [],
      totalCnt: 0,
      pageSize: 10,
      currentPage: 1,
      modNoticeNo: 0,
      action: "",
      pTitle: "",
      opoupreturn: "",
      selComboVar: "",
      selComboVarWorkCD: "",
    };
  },
  
  mounted() {
    this.searchList();
  },

  methods: {
    searchList: function () {
      // 화살표 함수 대신 일반 함수 사용 , ES6문법을 사용해서 에러..
      //alert('searchlist')

      let vm = this; //this를 axios안에서 사용할 수 없으므로 별도로 할달을 빼놓았음

      let params = new URLSearchParams(); //파라미터를 넘길 때 사용
      params.append("stitle", this.stitle);
      params.append("ssdate", this.ssdate);
      params.append("sedate", this.sedate);
      params.append("currentPage", this.currentPage);
      params.append("pageSize", this.pageSize);

      this.axios
        .post("/sampletest/listNotice.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));
          vm.noticeList = response.data.listData;
          vm.totalCnt = response.data.totalCnt;
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

    newReg: function () {
      this.action = "I";
      this.pTitle = "공지사항 등록";
      this.openPopup();
    },

    noticeModify: function (noticeNo) {
      this.action = "U";
      this.pTitle = "공지사항 수정";
      this.modNoticeNo = noticeNo;
      this.openPopup();
    },

    openPopup: async function () {
      const popUpVar = await openModal(Samplepage1Popup, {
        //json type으로 Samplepage1Popup에 넘겨줌
        title: this.pTitle,
        pnoticeNo: this.modNoticeNo,
        action: this.action,
        retrunval: (value) => {
          this.opoupreturn = value;
          console.log("return val : " + value);
        },
      });

      popUpVar.onclose = () => {
        console.log("Close");
        //팝업창이 닫히면 리스트 다시 새로고침 (등록, 수정 한 데이터가 업로드 된다.)
        if (this.opoupreturn === "Y") {
          this.searchList();
        }
        // return false;
      };

      console.log(popUpVar);
    },
    returnpopup: function (flag) {
      alert(flag);
    },
    newRegFile: function () {
      this.action = "I";
      this.pTitle = "공지사항 등록";
      this.openPopupFile();
    },
    noticeModifyFile: function (noticeNo) {
      this.action = "U";
      this.pTitle = "공지사항 수정";
      this.modNoticeNo = noticeNo;
      this.openPopupFile();
    },

    openPopupFile: async function () {
      const popUpVar = await openModal(Samplepage1PopupFile, {
        //json type으로 Samplepage1Popup에 넘겨줌
        title: this.pTitle,
        pnoticeNo: this.modNoticeNo,
        action: this.action,
        retrunval: (value) => {
          this.opoupreturn = value;
          console.log("return val : " + value);
        },
      });

      popUpVar.onclose = () => {
        console.log("Close");
        //팝업창이 닫히면 리스트 다시 새로고침 (등록, 수정 한 데이터가 업로드 된다.)
        if (this.opoupreturn === "Y") {
          this.searchList();
        }
        // return false;
      };

      console.log(popUpVar);
    },

    excel: function () {
      //파라메터가 없고 요청만 들어감
      let params = new URLSearchParams();
      params.append("ssdate", this.ssdate);
      params.append("sedate", this.sedate);

      this.axios({
        url: "/sampletest/noticeExcelDownload.do",
        data: params,
        method: "POST",
        responseType: "blob", //파일에 대한 내용을 받으려면 추가해줘야 한다.
      }).then((response) => {
        //브라우저 있는 자바스크립 버전은 사용안함, node.js꺼 사용 => 그래서 이런 작업을 처리 해야함
        console.log(response);
        console.log(response.data);
        //Blob 데이터를 이진파일로 변환, 파일 데이터를 받아 바이너리 데이터로 만든 후 URL을 만든다.
        let FILE = window.URL.createObjectURL(new Blob([response.data]));
        //a 태그를 만들어서 이 태그 안에 파일 이름을 넣어
        let docUrl = document.createElement("a");
        docUrl.href = FILE;
        docUrl.setAttribute("download", "listExcel.xlsx");
        document.body.appendChild(docUrl); //만든 a태그를 끼어넣어
        docUrl.click(); //강제로 클릭하게 만들어 //url을 클릭하면 다운로드가 됨
        //console.log('FILE : ' + FILE)
      });
    },

    pdf: function () {
      let params = new URLSearchParams();
      params.append("stitle", this.stitle);
      params.append("ssdate", this.ssdate);
      params.append("sedate", this.sedate);

      this.axios({
        url: "/sampletest/noticePDFDownload.do", // File URL Goes Here
        data: params,
        method: "POST",
        responseType: "blob",
      }).then((res) => {
        console.log(res);
        console.log(res.data);
        let FILE = window.URL.createObjectURL(new Blob([res.data]));
        let docUrl = document.createElement("a");
        docUrl.href = FILE;
        docUrl.setAttribute("download", "list.pdf");
        document.body.appendChild(docUrl);
        docUrl.click();
        //console.log('FILE : ' + FILE);
      });
    },
    selVarCheck: function () {
      alert(this.selComboVar);
    },
    changeSel: function () {
      this.selComboVar = "F41";

      //사용자 이벤트 예시
      //이벤트를 발생시 F41을 넘겨줌 그럼 SELECT BOX에 F41에 맞는 건설업을 띄어줌
      //prop으로 eventid 넘겨주는 이유 : 이벤트 이름을 따로 따로 줘서 동작을 다르게 하기 위해서,
      //prop으로 안넘기고 고정하면 버튼을 눌렀을 때 동일하게 작동하기 때문
      this.emitter.emit("testSelEvent", "F41");
      this.emitter.emit("testSelEventWorkCD", "W13");
    },
  },
  //다른 페이지로 이동할 때, 죽이고 이동한다.
  beforeUnmount() {
    console.log("beforeUnmount");
    this.emitter.off("testSelEvent");
    this.emitter.off("testSelEventWorkCD");
  },

  components: { Paginate, ComCombo },
};
</script>

<style></style>
