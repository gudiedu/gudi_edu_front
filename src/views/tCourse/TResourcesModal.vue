<template>
  <div class="lecture-detail">
    <!-- 학습자료 등록 모달 -->
    <div v-if="action === 'C'">
      <h2 class="title">학습자료 등록창</h2>
      <form id="file-form" enctype="multipart/form-data" @submit.prevent="insertNotice">
        <table class="info-table">
          <tr>
            <td class="label">강의명</td>
            <td class="content">
              <select v-model="courseNo" class="form-input select-input">
                <option value="" disabled>강의를 선택해 주세요</option>
                <option v-for="course in courseList" :key="course.course_no" :value="course.course_no">
                  {{ course.course_name }}
                </option>
              </select>
            </td>
          </tr>
          <tr>
            <td class="label">제목</td>
            <td class="content">
              <input type="text" name="resource_title" v-model="resourceTitle" class="form-input" />
            </td>
          </tr>
          <tr>
            <td class="label">내용</td>
            <td class="content content-input">
              <textarea name="resource_content" v-model="resourceContent" class="form-textarea"
                @input="checkContentLength"></textarea>
            </td>
          </tr>
          <tr>
            <td class="label">파일</td>
            <td class="content">
              <input type="file" id="file-insert" name="file-insert" @change="handleFileChange" multiple />
              <div v-if="filePreviews.length">
                <div v-for="(preview, index) in filePreviews" :key="index" class="file-preview">
                  <img v-if="isImage(preview.name)" :src="preview.url" class="file-thumbnail" />
                  <input v-else type="text" v-model="preview.name" class="file-name-input" />
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div class="button-group">
          <v-btn class="insert-button" type="submit">등록</v-btn>
          <v-btn class="cancel-button" @click="$emit('close')">닫기</v-btn>
        </div>
      </form>
    </div>

    <!-- 학습자료 수정 모달 -->
    <div v-if="action === 'U'">
      <h2 class="title">학습자료 수정창</h2>
      <form id="file-form" enctype="multipart/form-data" @submit.prevent="updateNotice">
        <table class="info-table">
          <tr>
            <td class="label">강의명</td>
            <!-- 수정: 강의명을 텍스트로 표시 -->
            <td class="content">
              <div class="form-input readonly-input">{{ materials.course_name }}</div>
            </td>
          </tr>
          <tr>
            <td class="label">제목</td>
            <td class="content">
              <input type="text" name="resource_title" v-model="resourceTitle" class="form-input" />
            </td>
          </tr>
          <tr>
            <td class="label">내용</td>
            <td class="content content-input">
              <textarea name="resource_content" v-model="resourceContent" class="form-textarea"
                @input="checkContentLength"></textarea>
            </td>
          </tr>
          <tr>
            <td class="label">파일</td>
            <td class="content">
              <input type="file" id="file-insert" name="file-insert" @change="handleFileChange" multiple />
              <div v-if="existingFile">
                <!-- 기존 파일 정보를 표시 -->
                <div class="file-preview">
                  <img v-if="isImage(existingFile)" :src="existingFileUrl" class="file-thumbnail" />
                  <div v-else class="file-name">{{ existingFileName }}</div>
                </div>
              </div>
              <div v-if="filePreviews.length">
                <!-- 새로 업로드된 파일 정보를 표시 -->
                <div v-for="(preview, index) in filePreviews" :key="index" class="file-preview">
                  <img v-if="isImage(preview.name)" :src="preview.url" class="file-thumbnail" />
                  <div v-else class="file-name">{{ preview.name }}</div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div class="button-group">
          <v-btn class="update-button" type="submit">수정</v-btn>
          <v-btn class="delete-button" @click="deleteNotice">삭제</v-btn>
          <v-btn class="cancel-button" @click="$emit('close')">닫기</v-btn>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    action: {
      type: String,
      required: true,
    },
    materials: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      courseList: [],
      courseNo: '',
      resourceTitle: '',
      resourceContent: '',
      selectedFiles: [],
      filePreviews: [],
      existingFile: null,
      existingFileName: '',
      existingFileUrl: '',
    };
  },
  created() {
    if (this.action === 'C') {
      this.fetchCourseList();
    } else if (this.action === 'U') {
      this.fetchCourseList(); // 강의명 목록을 가져오기 위해 필요
      this.fetchResource(); // 선택한 학습자료의 데이터를 가져오기 위해 필요
    }
  },
  watch: {
    materials: {
      handler(newVal) {
        if (this.action === 'U') {
          this.courseNo = newVal.course_no || '';
          this.courseName = newVal.course_name || '';
          this.resourceTitle = newVal.resource_title || '';
          this.resourceContent = newVal.resource_content || '';
          this.existingFile = newVal.file_origin || null;
          this.existingFileName = newVal.file_origin || '';
          this.existingFileUrl = newVal.file_server_path || '';
        }
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    fetchCourseList() {
      axios.get('/tCourse/reCourseList')
        .then(response => {
          this.courseList = response.data.courseList;
        })
        .catch(error => {
          console.error("There was an error fetching the course list!", error);
        });
    },
    fetchResource() {
      axios.get('/tCourse/getResource', {
        params: { resourceNo: this.materials.resource_no }
      })
        .then(response => {
          const resource = response.data.resource;
          this.courseNo = resource.course_no;
          this.courseName = resource.course_name;
          this.resourceTitle = resource.resource_title;
          this.resourceContent = resource.resource_content;
          if (resource.file_origin) {
            this.existingFile = resource.file_origin;
            this.existingFileName = resource.file_origin;
            this.existingFileUrl = resource.file_server_path; // 이 경로가 이미지 URL
          }
        })
        .catch(error => {
          console.error("There was an error fetching the resource!", error);
        });
    },
    handleFileChange(event) {
      this.selectedFiles = Array.from(event.target.files);
      this.filePreviews = this.selectedFiles.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
    },
    checkContentLength() {
      const maxLength = /[가-힣]/.test(this.resourceContent) ? 1500 : 2000;
      if (this.resourceContent.length > maxLength) {
        alert(`내용은 ${maxLength}자 이하로 작성해 주세요.`);
        this.resourceContent = this.resourceContent.substring(0, maxLength);
      }
    },
    insertNotice() {
      const formData = new FormData();
      formData.append('course_no', this.courseNo);
      formData.append('resource_title', this.resourceTitle);
      formData.append('resource_content', this.resourceContent);
      this.selectedFiles.forEach(file => {
        formData.append('files', file);
      });

      axios.post('/tCourse/addResource', formData)
        .then(response => {
          if (response.data.result === 'success') {
            alert('학습자료가 등록되었습니다.');
            this.$emit('close');
          } else {
            alert('학습자료 등록에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error("There was an error registering the resource!", error);
          alert('학습자료 등록에 실패했습니다.');
        });
    },
    updateNotice() {
      const formData = new FormData();
      formData.append('resource_no', this.materials.resource_no);
      formData.append('resource_title', this.resourceTitle);
      formData.append('resource_content', this.resourceContent);
      if (this.selectedFiles.length) {
        this.selectedFiles.forEach(file => {
          formData.append('files', file); // files가 서버에서 받을 파일 필드명과 일치해야 함
        });
      }

      axios.post('/tCourse/updateResource', formData)
        .then(response => {
          if (response.data.result === 'success') {
            alert('학습자료가 수정되었습니다.');
            this.$emit('close');
          } else {
            alert('학습자료 수정에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error("There was an error updating the resource!", error);
          alert('학습자료 수정에 실패했습니다.');
        });
    },
    deleteNotice() {
      axios.post('/tCourse/deleteResource', {
        resourceNo: this.materials.resource_no
      })
        .then(response => {
          if (response.data.result === 'success') {
            alert('학습자료가 삭제되었습니다.');
            this.$emit('close');
          } else {
            alert('학습자료 삭제에 실패했습니다.');
          }
        })
        .catch(error => {
          console.error("There was an error deleting the resource!", error);
          alert('학습자료 삭제에 실패했습니다.');
        });
    },
    isImage(filename) {
      const extension = filename.split('.').pop().toLowerCase();
      return ['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(extension);
    }
  },
};
</script>

<style scoped>
.lecture-detail {
  padding: 16px;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  margin-top: 16px;
  max-width: 800px;
  margin: auto;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

.info-table .label {
  background-color: #f0f0f0;
  font-weight: bold;
  text-align: center;
  border: 1px solid #dddddd;
  width: 15%;
  /* 레이블 셀의 너비를 15%로 설정 */
  padding: 8px;
  /* 추가: 패딩 설정 */
}

.info-table .content {
  background-color: #ffffff;
  width: 85%;
  /* 내용 셀의 너비를 85%로 설정 */
  text-align: left;
  border: 1px solid #ddd;
  padding: 8px;
}

.info-table .full .content {
  width: 100%;
  text-align: left;
}

.info-table tr.full .content {
  text-align: left;
}

.form-input {
  width: 100%;
  /* 입력 필드의 너비를 100%로 설정 */
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
  box-sizing: border-box;
  /* 박스 크기 설정 */
}

.form-input:focus,
.form-textarea:focus {
  border-color: #407bff;
  box-shadow: 0 0 4px rgba(64, 123, 255, 0.2);
  outline: none;
}

.form-textarea {
  height: 400px;
  /* 높이를 400px로 조정 */
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
  resize: none;
}

.content-input {
  height: 400px;
  /* 높이를 400px로 설정 */
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.update-button,
.delete-button,
.cancel-button,
.insert-button {
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.update-button {
  background-color: #407bff;
}

.update-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.insert-button {
  background-color: #407bff;
}

.insert-button:hover {
  background-color: #5a9bff;
  box-shadow: 0 4px 8px rgba(64, 123, 255, 0.2);
}

.delete-button {
  background-color: #d9534f;
}

.delete-button:hover {
  background-color: #c9302c;
  box-shadow: 0 4px 8px rgba(217, 83, 79, 0.2);
}

.cancel-button {
  background-color: #686767;
  margin: 0;
}

.cancel-button:hover {
  background-color: #c2c2c2;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

/* 여기서 select 요소의 크기를 조정할 수 있습니다. */
select.form-input {
  width: 100%;
  /* 너비를 100%로 설정 */
  height: 60px;
  /* 높이를 조정 */
  padding: 10px;
  /* 패딩을 조정 */
  font-size: 16px;
  /* 폰트 크기를 조정 */
}

.file-preview {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.file-thumbnail {
  width: 50px;
  height: 50px;
  object-fit: cover;
  margin-right: 8px;
}

.file-name-input {
  flex: 1;
  padding: 4px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
}
</style>
