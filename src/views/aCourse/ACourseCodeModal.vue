<template>
  <div class="lecture-detail">
    <h2 class="title">강의코드관리</h2>

    <div class="form-group">
      <div class="form-label">강의코드</div>
      <!-- detail_code를 props로부터 직접 사용 -->
      <input type="text" :value="detail_code" class="form-input" readonly  />
    </div>
    <div class="form-group">
      <div class="form-label">강의명</div>
      <input type="text" v-model="localDetailName" class="form-input" />
    </div>

    <div class="button-group">
      <template v-if="paction === 'U'">
        <v-btn class="update-button" @click="updateNotice">수정</v-btn>
        <v-btn class="delete-button" @click="deleteNotice">삭제</v-btn>
      </template>
      <template v-else>
        <v-btn class="insert-button" @click="insertNotice">등록</v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    action: String,
    // detail_code를 props로 전달 받음
    detail_code: String,
    detail_name: String, // detail_name을 props로 추가
  },
  data() {
    return {
      paction: this.action,
      localDetailName: this.detail_name || '', // 수정할 데이터는 localDetailName으로 정의
    };
  },
  methods: {
    updateNotice() {
      if (this.localDetailName.trim() === "") {
        alert("강의명을 입력해주세요.");
        return;
      }
      const params = new URLSearchParams()
      params.append('detail_code', this.detail_code);
      params.append('detail_name', this.localDetailName);
    
      axios.post('/api/acourse/codeUpdate.do', params)
        .then(response => {
          console.log("updatNotice:", response)
          alert(this.localDetailName + " 강의코드가 수정되었습니다.");
          this.$emit('close');
        })
        .catch(error => {
          alert(this.localDetailName + " 강의코드가 수정되었습니다.");
          // console.error('Error updating course:', error);
          // alert('Error updating course');
          this.$emit('close');
        })
      },
     
     
    //   axios.post('/acourse/codeUpdate.do', {
    //       detail_code: this.detail_code,
    //       detail_name: this.localDetailName
    //     })
    //     .then(response => {
    //       console.log("updatNotice:", response)
    //       alert(this.localDetailName + " 강의코드가 수정되었습니다.");
    //       this.$emit('close');
    //     })
    //     .catch(error => {
    //       console.error('Error updating course:', error);
    //       alert('Error updating course');
    //     });
    // },
    
   
    deleteNotice() {
      if (confirm(this.localDetailName + " 강의코드를 정말로 삭제하시겠습니까?")) {
        axios.delete('/acourse/codeDelete.do', {
          params: {
            detail_code: this.detail_code
          }
        })
        .then(response => {
          console.log("deleteNotice:", response)
          alert(this.localDetailName + " 강의코드가 삭제되었습니다.");
          this.$emit('close'); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
        })
        .catch(error => {
          console.error('Error deleting course:', error);
          alert('Error deleting course');
        });
      }
    },
    insertNotice() {
      if (this.localDetailName.trim() === '') {
        alert('강의명을 입력해주세요.');
        return;
      }

      axios.post('/acourse/aCourseInsert.do', {
        detail_code: this.detail_code, // 강의 코드 포함
        detail_name: this.localDetailName
      })
      .then(response => {
        alert(this.localDetailName + " 강의코드가 등록되었습니다.");
        this.$emit('close'); // 부모 컴포넌트에서 모달을 닫도록 이벤트 발생
      })
      .catch(error => {
        console.error('Error adding course:', error);
        alert('Error adding course');
      });
    },
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

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
}

.form-label {
  font-size: 14px;
  color: #2c3e50;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  padding: 10px;
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

.form-textarea {
  height: 200px;
  resize: vertical;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.update-button,
.delete-button,
.insert-button {
  /* padding: 10px 16px; */
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.update-button,
.insert-button {
  background-color: #407bff;
}

.update-button:hover,
.insert-button:hover {
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
</style>
