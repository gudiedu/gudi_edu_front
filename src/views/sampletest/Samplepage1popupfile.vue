<template>
  <div>
    <form id="regFrom">
      <dl id="grpInfoWrap">
        <dd class="content"></dd>
        <!-- s : 여기에 내용입력 -->
        <table id="grpInfo" style="width: 800px">
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
            <tr>
              <th scope="row">
                파일
                <span class="font_red">*</span>
              </th>
              <td>
                <!--newPreview라고 만 적으면 태그 이벤트 정보 파라메터로 다 넘어간다. newPreview()라고 적으면 파라메터 정보 안넘어감-->
                <input type="file" id="upFileTag" name="upFileTag" @change="newPreview" />
                <br />
                <template v-if="checkShow">
                  파일 유지
                  <input type="checkbox" id="checkyn" name="checkyn" true-value="Y" false-value="N" v-model="checkyn" />
                </template>
              </td>
              <td colspan="5">
                <div id="preview" v-html="previewHtml" @click="downLoad"></div>
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
    </form>
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
      previewHtml: "",
      fileName: "",
      checkShow: false,
      checkyn: "Y",
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

          //response.data.result.file_name //파일이름
          //response.data.result.logical_path //논리경로
          //response.data.result.phygical_path //물리경로
          //response.data.result.file_size //파일크기
          //response.data.result.file_ext //파일확장자

          if (response.data.result.file_name === "" || response.data.result.file_name === null) {
            this.previewHtml = "";
            this.checkShow = false;
          } else {
            this.previewHtml = response.data.result.file_name;
            this.fileName = response.data.result.file_name;
            this.checkShow = true;

            let ext = response.data.result.file_ext;

            if (ext.toLowerCase() == "jpg" || ext.toLowerCase() == "jpeg" || ext.toLowerCase() == "png" || ext.toLowerCase() == "gif") {
              this.previewHtml = "<img src='" + response.data.result.logical_path + "' id 'imgFile' style='width:100px; height 100px;' />";
            } else {
              this.previewHtml = response.data.result.file_name;
            }
          }
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

      let formTag = document.getElementById("regFrom");
      formTag.enctype = "multipart/form-data"; //enctype이 multipart/form-data일때 파일 업로드 가능

      var dataWithFile = new FormData(formTag); //FormData하면 form의 id가 아닌 name이 넘어간다 //form에 있는 name이 다 넘어감
      dataWithFile.append("paction", this.paction);

      this.axios
        .post("/sampletest/saveNoticeFile.do", dataWithFile)
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

    closePopup: function () {
      closeModal(this);
    },

    newPreview: function (e) {
      let item = e.target;

      if (item.files[0]) {
        //alert('파일 선택 : ' + item.files[0].name)

        //previewHtml
        let fileName = item.files[0].name; //파일 이름 .jpg .xlsx
        var imgPath = window.URL.createObjectURL(item.files[0]); //로컬에 있는 파일을 강제로 URL을 만듬
        let extend = fileName.split("."); //파일 확장자 //.을 기준으로 배열로 저장 => extend[1] 하면 확장자가 나옴
        let ext = extend[1].toLowerCase();

        //alert(extend[0] + ' : ' + extend[1] + ' : ' + imgPath)

        //imgPath = '/serverfile/everland1.jpg'

        if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif") {
          this.previewHtml = "<img src='" + imgPath + "' id 'imgFile' style='width:100px; height 100px;' />";
        } else {
          this.previewHtml = fileName;
        }
      } else {
        alert("파일 선택 안함");
      }
    },
    downLoad: function () {
      let params = new URLSearchParams();
      params.append("noticeNo", this.noticeNo);

      this.axios({
        url: "/sampletest/noticeFileDownload.do",
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
        docUrl.setAttribute("download", this.fileName);
        document.body.appendChild(docUrl); //만든 a태그를 끼어넣어
        docUrl.click(); //강제로 클릭하게 만들어 //url을 클릭하면 다운로드가 됨
        //console.log('FILE : ' + FILE)
      });
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
