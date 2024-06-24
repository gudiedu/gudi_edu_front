<template>
  <v-container fluid>
    <v-card class="dashboard-card">
      <div class="titleHeader">
        <v-card-title class="d-flex align-center pe-2">
          <div class="titletext">{{ titleText }}</div>
          <v-spacer></v-spacer>
        </v-card-title>

        <div class="button-group">
          <button class="goBack-button" @click="goBack">뒤로가기</button>
        </div>
      </div>

      <v-divider></v-divider>

      <v-card class="dashboard-card">
        <div class="titletext">강의 정보</div>
        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>강의명</th>
              <th>강의과목</th>
              <th>강의실</th>
              <th>시작일</th>
              <th>종료일</th>
              <th>수강정원</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ course.course_name }}</td>
              <td>{{ course.course_subject }}</td>
              <td>{{ course.course_loc }}</td>
              <td>{{ course.course_start_date }}</td>
              <td>{{ course.course_end_date }}</td>
              <td>{{ course.course_quota }}명</td>
            </tr>
          </tbody>
        </v-table>
      </v-card>

      <v-card class="dashboard-card">
        <div class="titletext">강의 소개</div>

        <v-textarea
          class="textarea"
          label="강의소개"
          :model-value="course.course_description"
          readonly
          row-height="30"
          rows="5"
          variant="outlined"
          auto-grow
          shaped
        ></v-textarea>
      </v-card>

      <v-card class="dashboard-card">
        <div class="titletext">주차별 계획</div>
        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>주차</th>
              <th>학습목표</th>
              <th>학습내용</th>
            </tr>
          </thead>
          <tbody>
            <template v-for="item in detailList" :key="item.course_detail_no">
              <tr>
                <td>{{ item.course_detail_week_no }}주차</td>
                <td>{{ item.course_detail_goal }}</td>
                <td>{{ item.course_detail_content }}</td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </v-card>

      <v-card class="dashboard-card">
        <div class="titletext">진도 현황</div>
        <v-table class="dashboard-table">
          <thead>
            <tr>
              <th>총 수업 일</th>
              <th>현 수업 일</th>
              <th>진행률</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ course.duration }}일</td>
              <td>{{ getCurrentCourse() }}일</td>
              <td>
                {{ ((getCurrentCourse() / course.duration) * 100).toFixed(2) }}%
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card>
      <div class="button-group">
        <v-btn class="update-button" @click="updateLecture">수정</v-btn>
        <v-btn class="delete-button" @click="deleteLecture">삭제</v-btn>
      </div>

      <!-- <v-dialog v-model="updateLectureModal" max-width="700px">
        <v-card>
          <v-card-text>
            <LectureManagementModal :action="action" :courseNo="courseNo" />
          </v-card-text>
        </v-card>
      </v-dialog> -->
    </v-card>
  </v-container>
</template>

<script>
import LectureManagementModal from "./TCourseModal.vue";
import { openModal } from "jenesius-vue-modal";
export default {
  components: {},
  props: {
    // courseNo: Number,
  },
  data() {
    return {
      titleText: "강의상세",
      action: "",
      courseNo: this.$route.params.course_no,
      course: "",
      detailList: [],
    };
  },

  mounted() {
    this.courseInfo();
  },
  methods: {
    courseInfo() {
      let params = new URLSearchParams();
      params.append("courseNo", this.courseNo);

      this.axios
        .post("/tCourse/detailCourse", params)
        .then((response) => {
          // console.log(JSON.stringify(response))
          this.course = response.data.course;
          this.detailList = response.data.detail;
        })
        .catch(function (error) {
          alert("에러! API 요청에 오류가 있습니다. " + error);
        });
    },

    getCurrentCourse() {
      const currentDate = new Date();
      const start = new Date(this.course.course_start_date);
      const end = new Date(this.course.course_end_date);
      const timeDiff = currentDate.getTime() - start.getTime();
      const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

      if (currentDate < start) {
        return 0;
      } else if (currentDate >= start && currentDate <= end) {
        return daysDiff;
      } else if (currentDate > end) {
        return this.course.duration;
      }
    },
    openPopup: async function () {
      const popUpVar = await openModal(LectureManagementModal, {
        courseNo: this.courseNo,
        action: this.action,
        retrunval: (value) => {
          this.opoupreturn = value;
          console.log("return val : " + value);
        },
      });

      popUpVar.onclose = () => {
        console.log("Close");
        //팝업창이 닫히면 다시 새로고침 (등록, 수정 한 데이터가 업로드 된다.)
        if (this.opoupreturn === "Y") {
          this.courseInfo();
        }
        // return false;
      };

      console.log(popUpVar);
    },
    updateLecture() {
      this.action = "U";
      this.openPopup();
    },
    deleteLecture() {
      if (confirm("삭제하시겠습니까?")) {
        this.action = "D";

        let params = new URLSearchParams();
        params.append("courseNo", this.courseNo);
        params.append("paction", this.action);

        this.axios
          .post("/tCourse/saveCourse", params)
          .then((response) => {
            // console.log(JSON.stringify(response))
            alert(response.data.resultMsg);
            if (response.data.result > 0) {
              history.back();
            }
          })
          .catch(function (error) {
            alert("에러! API 요청에 오류가 있습니다. " + error);
          });
      }
    },
    goBack() {
      history.back();
    },

    // getPersentCourse() {

    // },
  },
};
</script>

<style scoped>
.textarea {
  margin-top: 20px;
}

.titleHeader {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  justify-content: space-between;
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

.update-button,
.delete-button,
.insert-button {
  /* padding: 10px 16px; */
  width: 60px;
  height: 40px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}
.goBack-button {
  padding: 10px 16px;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.update-button {
  margin-right: 10px;
}

.update-button,
.insert-button,
.goBack-button {
  background-color: #407bff;
}

.update-button:hover,
.insert-button:hover,
.goBack-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.delete-button {
  background-color: #d32f2f;
  margin: 0;
}

.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
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
