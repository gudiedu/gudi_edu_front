//import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from "vue-router";
//import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";

const routes = [
  /**/
  {
    path: "/",
    name: "home",
    component: Login,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    children: [
      {
        path: ":type/:menu",
        component: () => import("../views/Content.vue"),
      },
      {
        path: "/myPage",
        name: "mypage",
        component: () => import("../views/MyPage.vue"),
      },

      {
        path: "/tCourse/course/:course_no",
        name: "tCourseDetail",
        component: () => import("@/views/tCourse/TCourseDetail.vue"),
      },
      {
        path: "/classroom/course/:courseNo",
        name: "sCourseDetail",
        component: () => import("@/views/classroom/SCourseDetail.vue"),
      },
      {
        path: "/classroom/course/:courseNo",
        name: "sCourseSatisfaction",
        component: () => import("@/views/classroom/SCourseSatisfaction.vue"),
      },
      {
        path: "/information/student/:studentId",
        name: "aStudentAttendance",
        component: () => import("@/views/information/AStudentAttendance.vue"),
      },
      {
        path: "information/hrinfo", // / 주의
        name: "hrInfo",
        component: () => import("@/views/information/HrInfo.vue"),
      },
      {
        path: "/information/survey",
        name: "aSurveyManagement",
        component: () => import("@/views/information/ASurveyManagement.vue"),
      },
      {
        path: "/information/ASurveyQuestion/:survey_no/:survey_name",
        name: "aSurveyQuestion",
        component: () => import("@/views/information/ASurveyQuestion.vue"),
        props: true, // 이 부분이 파라미터를 컴포넌트의 props로 전달하도록 함
      },
    ],
    component: Dashboard,
  },

  {
    path: "/myChatRoomList",
    name: "myChatRoomList",
    component: () =>
      import(/* webpackChunkName: "about" */ "@/components/ChatApp.vue"),
  },
];

const router = createRouter({
  //history: createWebHistory("/"),
  history: createWebHashHistory(), //404에러 방지
  routes,
});

export default router;
