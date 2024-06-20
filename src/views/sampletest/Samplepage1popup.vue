<template>
  <div>
    <dl id="grpInfoWrap">
      <dd class="content"></dd>
      <!-- s : 여기에 내용입력 -->
      <table id="grpInfo" style="width: 400px">
        <caption>
          caption
        </caption>
        <colgroup>
          <col width="60px" />
          <col width="*" />
          <col width="60px" />
          <col width="*" />
        </colgroup>

        <tbody>
          <tr>
            <td colspan="4" class="text-center">
              <div class="my-4">
                <strong style="font-size: 30px">{{ title }}</strong>
              </div>
            </td>
          </tr>
          <!--paction이 U일때만 보임-->
          <tr v-if="paction === 'U'">
            <th scope="row">
              번호
              <span class="font_red">*</span>
            </th>
            <td>
              <input type="text" class="form-control" name="noticeNo" id="noticeNo" readonly v-model="noticeNo" />
            </td>
            <th scope="row">작성자</th>
            <td>
              <input type="text" class="form-control" name="loginName" id="loginName" readonly v-model="loginName" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              제목
              <span class="font_red">*</span>
            </th>
            <td colspan="3">
              <input type="text" class="form-control" name="noticeTitle" id="noticeTitle" v-model="noticeTitle" />
            </td>
          </tr>
          <tr>
            <th scope="row">
              내용
              <span class="font_red">*</span>
            </th>
            <td colspan="3">
              <textarea name="noticeContent" id="noticeContent" v-model="noticeContent"></textarea>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- e : 여기에 내용입력 -->

      <div class="btn_areaC mt30">
        <a class="btn btn-primary" id="btnSaveGrpCod" name="btn" @click="saveNotice">
          <span>저장</span>
        </a>
        <a class="btn btn-danger mx-2" v-show="delshow" @click="delNotice">
          <span>삭제</span>
        </a>
        <a class="btn btn-info mx-2" @click="closePopup">
          <span>닫기</span>
        </a>
      </div>
    </dl>
  </div>
</template>

<script>
import { closeModal } from "jenesius-vue-modal";

export default {
  props: {
    title: String,
    pnoticeNo: Number,
    action: String,
    retrunval: Function,
  },
  beforeModalClose() {
    this.retrunval(this.saveyn);
  },
  data: function () {
    return {
      noticeNo: this.pnoticeNo,
      paction: this.action,
      loginId: "",
      noticeTitle: "",
      noticeContent: "",
      noticeRegdate: "",
      loginName: "",
      delshow: true,
      saveyn: "N",
    };
  },
  mounted() {
    //넘겨받은 action I이면 삭제 버튼 숨김 처리
    if (this.paction === "I") {
      console.log(this.paction);
      this.delshow = false;
    } else {
      this.delshow = true;

      let params = new URLSearchParams();
      params.append("noticeNo", this.noticeNo);

      // 수정을 위한 그 게시글 불러오기
      this.axios
        .post("/sampletest/selectNotice.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          this.loginName = response.data.result.writer;
          this.noticeTitle = response.data.result.ntc_title;
          this.noticeContent = response.data.result.ntc_content;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    }
  },
  methods: {
    saveNotice: function () {
      //let vm = this

      // let checkreturn = this.nullcheck([
      //   { checkval: this.noticeTitle, checkmsg: '제목을 입력해주세요' },
      //   { checkval: this.noticeContent, checkmsg: '내용을 입력해주세요' },
      // ])

      let checkreturn = this.$emptyValidation([
        { checkval: this.noticeTitle, checkmsg: "제목을 입력해주세요" },
        { checkval: this.noticeContent, checkmsg: "내용을 입력해주세요" },
      ]);

      if (!checkreturn) return;

      let params = new URLSearchParams();
      params.append("noticeTitle", this.noticeTitle);
      params.append("noticeContent", this.noticeContent);
      params.append("noticeNo", this.noticeNo);
      params.append("paction", this.paction);

      this.axios
        .post("/sampletest/saveNotice.do", params)
        .then((response) => {
          console.log(JSON.stringify(response));

          if (response.data.result > 0) {
            alert(response.data.resultMsg);
            this.saveyn = "Y";
            this.closePopup();
          }
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    delNotice: function () {
      this.paction = "D";
      this.saveNotice();
    },

    nullcheck: function (arrlist) {
      let checklist = [...arrlist];

      for (let i = 0; i < checklist.length; i++) {
        let item = checklist[i];
        //console.log(item.checkval + " : " + item.checkmsg);

        if (item.checkval === "") {
          alert(item.checkmsg);

          return false;
        }
      }

      return true;
    },

    closePopup: function () {
      closeModal(this);
    },
  },
  components: {},
};
</script>

<style>
#grpInfo {
  border-collapse: separate;
  border-spacing: 20px;
}

#grpInfoWrap {
  background-color: #fff;
  padding: 3rem;
  border-radius: 10px;
  border: 2px solid rgb(59, 59, 59);
}
</style>
