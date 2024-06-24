<template>
  <div class="lecture-detail">
    <!-- 학습자료 등록 모달 -->
    <div v-if="action === 'C'">
      <h2 class="title">학습자료 등록</h2>
      <form id="file-form" enctype="multipart/form-data" @submit.prevent="insertNotice">
        <table class="info-table">
          <tr>
            <td class="label">강의명</td>
            <td class="content">
              <select v-model="courseNo" class="form-input course-select-input">
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
              <input type="text" name="resource_title" v-model="resourceTitle" class="form-input title-input" />
            </td>
          </tr>
          <tr>
            <td class="label">내용</td>
            <td class="content content-input">
              <textarea name="resource_content" v-model="resourceContent" class="form-textarea"
                @input="checkContentLength"></textarea>
            </td>
          </tr>
          <!-- 등록 모달창의 파일 부분 -->
          <tr>
            <td class="label">파일</td>
            <td class="content">
              <input type="file" id="file-insert-register" name="file-insert" @change="handleFileChangeRegister"
                multiple />
              <!-- 새로 업로드된 파일 정보 표시 -->
              <div v-if="filePreviewsRegister.length">
                <div v-for="(preview, index) in filePreviewsRegister" :key="index" class="file-preview">
                  <img v-if="isImage(preview.name)" :src="preview.url" class="file-thumbnail" />
                  <div v-else class="file-name">{{ preview.name }}</div>
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
      <h2 class="title">학습자료 수정</h2>
      <form id="file-form" enctype="multipart/form-data" @submit.prevent="updateNotice">
        <table class="info-table">
          <tr>
            <td class="label">강의명</td>
            <td class="content">
              <div class="readonly-input">{{ materials.course_name }}</div>
            </td>
          </tr>
          <tr>
            <td class="label">제목</td>
            <td class="content">
              <input type="text" name="resource_title" v-model="resourceTitle" class="input-title" />
            </td>
          </tr>
          <tr>
            <td class="label">내용</td>
            <td class="content content-input">
              <textarea name="resource_content" v-model="resourceContent" class="form-textarea"
                @input="checkContentLength"></textarea>
            </td>
          </tr>
          <!-- 수정 모달창의 파일 부분 -->
          <tr>
            <td class="label">파일</td>
            <td class="content">
              <div class="file-container">
                <div v-if="existingFile">
                  <span class="file-name">{{ truncateFileName(existingFileName) }}</span>
                  <!-- 수정된 부분: 파일 선택 버튼을 노란색으로 변경하고 파일을 교체할 수 있도록 수정 -->
                  <v-btn class="select-file-button" @click="triggerFileInput">파일선택</v-btn>
                  <input type="file" id="file-insert-modify" ref="fileInput" @change="handleFileChangeModify"
                    style="display:none;" />
                </div>
              </div>
              <!-- 새로 업로드된 파일 정보 표시 -->
              <div v-if="filePreviewsModify.length">
                <div v-for="(preview, index) in filePreviewsModify" :key="index" class="file-preview">
                  <img v-if="isImage(preview.name)" :src="preview.url" class="file-thumbnail" />
                  <div v-else class="file-name">{{ preview.name }}</div>
                </div>
              </div>
            </td>
          </tr>
        </table>
        <div class="button-group">
          <v-btn class="update-button" type="submit">수정</v-btn>
          <v-btn class="delete-button" @click="confirmDelete">삭제</v-btn>
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
      selectedFilesRegister: [], // 등록 모달창에서 선택된 파일들
      selectedFilesModify: [],   // 수정 모달창에서 선택된 파일들
      filePreviewsRegister: [],  // 등록 모달창에서 파일 미리보기
      filePreviewsModify: [],    // 수정 모달창에서 파일 미리보기
      existingFile: null,
      existingFileName: '',
      existingFileUrl: '',
      noticeEditing: false,
    };
  },
  created() {
    if (this.action === 'C') {
      this.fetchCourseList();
    } else if (this.action === 'U') {
      this.fetchCourseList();
      this.fetchResource();
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
    handleFileChangeRegister(event) { // 등록 모달창 파일 변경 처리
      this.selectedFilesRegister = Array.from(event.target.files);
      this.filePreviewsRegister = this.selectedFilesRegister.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
    },
    handleFileChangeModify(event) { // 수정 모달창 파일 변경 처리
      this.selectedFilesModify = Array.from(event.target.files);
      this.filePreviewsModify = this.selectedFilesModify.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file)
      }));
    },
    triggerFileInput() {
      // 파일 선택 input 트리거
      this.$refs.fileInput.click();
    },
    checkContentLength() {
      const maxLength = /[가-힣]/.test(this.resourceContent) ? 1500 : 2000;
      if (this.resourceContent.length > maxLength) {
        alert(`내용은 ${maxLength}자 이하로 작성해 주세요.`);
        this.resourceContent = this.resourceContent.substring(0, maxLength);
      }
    },
    insertNotice() { // 학습자료 등록
      if (!this.courseNo) {
        alert('강의를 선택해 주세요.');
        return;
      }

      const formData = new FormData();
      formData.append('course_no', this.courseNo);
      formData.append('resource_title', this.resourceTitle);
      formData.append('resource_content', this.resourceContent);

      if (this.selectedFilesRegister.length > 0) {
        this.selectedFilesRegister.forEach(file => {
          formData.append('files', file);
        });
      } else {
        formData.append('files', new Blob([])); // 빈 파일 리스트 추가
      }
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
    updateNotice() { // 학습자료 수정
      const formData = new FormData();
      formData.append('resource_no', this.materials.resource_no);
      formData.append('resource_title', this.resourceTitle);
      formData.append('resource_content', this.resourceContent);

      if (this.selectedFilesModify.length > 0) {
        this.selectedFilesModify.forEach(file => {
          formData.append('files', file);
        });
      }

      // fileExits 값을 추가
      formData.append('fileExits', this.selectedFilesModify.length > 0 ? 'Y' : 'N');

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
    confirmDelete() {
      if (confirm('정말로 삭제하시겠습니까?')) {
        this.deleteNotice();
      }
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
    },
    truncateFileName(fileName) {
      const maxLength = 4;
      const fileParts = fileName.split('.');
      const name = fileParts.slice(0, -1).join('.');
      const extension = fileParts.slice(-1)[0];
      if (name.length > maxLength) {
        return name.substring(0, maxLength) + '...' + '.' + extension;
      }
      return fileName;
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
  max-width: 1000px;
  /* 모달 창의 최대 너비를 늘림 */
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
  border: 1px solid #ddd;
  width: 15%;
  padding: 8px;
}

.info-table .content {
  background-color: #ffffff;
  width: 85%;
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
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
}

.form-input:focus,
.form-textarea:focus {
  border-color: #407bff;
  box-shadow: 0 0 4px rgba(64, 123, 255, 0.2);
  outline: none;
}

/* 읽기 전용 스타일 */
.readonly-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
  background-color: #f0f0f0;
}

/* 제목 입력 스타일 */
.input-title {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
}

/* 스타일 클래스 분리 */
.course-select-input {
  width: 100%;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 18px;
  color: #34495e;
  height: 60px;
}

.title-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 4px;
  font-size: 14px;
  color: #34495e;
}

.form-textarea {
  height: 400px;
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
  overflow-y: scroll;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.update-button,
.save-button,
.delete-button,
.cancel-button {
  width: 55px;
  height: 35px;
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

.save-button {
  background-color: #4caf50;
}

.save-button:hover {
  background-color: #66bb6a;
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.delete-button {
  background-color: #d32f2f;
  margin: 0;
}

.delete-button:hover {
  background-color: #e57373;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

.cancel-button {
  background-color: #686767;
  margin: 0;
}

.cancel-button:hover {
  background-color: #c2c2c2;
  box-shadow: 0 4px 8px rgba(211, 47, 47, 0.2);
}

.remove-file-button {
  background-color: #ffffff;
  color: rgb(0, 0, 0);
  border-radius: 4px;
  padding: 8px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.remove-file-button:hover {
  background-color: #ece2e4;
  box-shadow: 0 4px 8px rgba(253, 192, 204, 0.2);
}

#preview {
  cursor: pointer;
  color: #407bff;
  text-decoration: underline;
  display: inline-block;
  margin-top: 10px;
}

.file-preview {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.file-thumbnail {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  margin-right: 50px;
}

.file-name {
  max-width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: inline-block;
  margin-right: 8px;
}

.file-download-container {
  display: flex;
  align-items: center;
  margin-top: 10px;
}

.file-download-container span {
  margin-right: 10px;
}

.download-file-button {
  background: #a2eafc;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.download-file-button:hover {
  background: #7fd7fa;
}

.select-file-button {
  background-color: #172a54;
  border: none;
  cursor: pointer;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 8px;
  transition: background-color 0.3s;
}

.select-file-button:hover {
  background-color: #254385;
}

.file-container {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
