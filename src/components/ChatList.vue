<template>
  <div class="chat-list">
    <div class="chat-item" v-for="chat in chats" :key="chat.chat_no" @click="selectChat(chat)">
      <div class="chat-item-info">
        <div class="chat-item-name">{{ chat.chat_name }}</div>
        <div class="chat-item-participants">{{ chat.count_people }}명 참여</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['chats'],
  methods: {
    selectChat(chat) {
      this.$emit('select-chat', chat);
    }
  }
};
</script>

<style scoped>

</style>
