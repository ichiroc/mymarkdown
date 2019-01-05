<template>
  <div class="editor">
    <h1>エディター画面</h1>
    <span>{{user.displayName}}</span>
    <button @click='logout'>ログアウト</button>
    <div class="editorWrapper">
    <div class="memoListWrapper">
      <button class="addMemoBtn" @click="addMemo">メモの追加</button>
      <button class='deleteMemoBtn' @click='deleteMemo' v-if='memos.length > 1'>選択中のメモの削除</button>
      <button class='saveMemmoBtn' @click='saveMemos'>メモの保存</button>
      <div class='memoList' v-for='(memo, index) in memos' @click='selectMemo(index)' :data-selected='index == selectedIndex'>
        <p class="memoTitle">{{ displayTitle(memo.markdown) }}</p>
        <span>{{ formattedTime(memo.updatedAt) }}</span>
      </div>
    </div>
      <textarea class="markdown" @keyup='onMemoUpdated' v-model="memos[selectedIndex].markdown"></textarea>
      <div class="preview markdown-body" v-html="preview()"></div>
    </div>
  </div>
</template>

<script>
import marked from 'marked';
import moment from 'moment';

export default {
  name: 'editor',
  props: ['user'],
  data() {
    return {
      memos: [
        {
          markdown: '',
          createdAt: '',
          updatedAt: null
        }
      ],
      selectedIndex: 0
    };
  },
  created: function() {
    firebase.database()
      .ref(`memos/${this.user.uid}`)
      .once('value')
      .then(result => {
        if(result.val()) {
          this.memos = result.val()
        }
      })
  },
  mounted: function() {
    document.onkeydown = e => {
      if(e.key == 's' && (e.metaKey || e.ctrlKey)) {
        this.saveMemos()
        return false
      }
    }
  },
  beforeDestroy: function() {
    document.onkeydown = null
  },
  methods: {
    formattedTime: function(time) {
      return moment(time).format('YYYY/MM/DD HH:mm')
    },
    currentUnixTime: function() {
      return moment().valueOf()
    },
    currentMemo: function() {
      return this.memos[this.selectedIndex]
    },
    onMemoUpdated: function(){
      // new Date
      this.memos[this.selectedIndex].updatedAt = this.currentUnixTime()
      this.saveMmoes()
    },
    logout: function(){
      firebase.auth().signOut()
    },
    addMemo: function(){
      this.memos = [{ markdown: '無題のメモ', createdAt: this.currentUnixTime() }, ...this.memos]
      this.selectedIndex = 0;
      this.onMemoUpdated()
    },
    selectMemo: function(index){
      this.selectedIndex = index;
      return marked(this.memos[this.selectedIndex].markdown);
    },
    deleteMemo: function() {
      this.memos.splice(this.selectedIndex, 1)
      if(this.selectedIndex > 0) {
        this.selectedIndex--
      }
    },
    saveMemos: function() {
      console.log('save!')
      console.log(this.memos)
      firebase.database()
        .ref(`memos/${this.user.uid}`)
        .set(this.memos);
    },
    preview: function() {
      return marked(this.memos[this.selectedIndex].markdown)
    },
    displayTitle: function(text) {
      return text.split(/\n/)[0]
    }
  }
}
</script>

<style lang="scss" scoped>
.editorWrapper{
  display: flex;
}
.markdown {
  width: 40%;
  height: 500px;
}
.memoListWrapper {
  width: 20%;
  border-top: 1px solid #000;
}
.memoList{
    padding: 10px;
    box-sizing: border-box;
    text-align: left;
    border-bottom: 1px solid #000;
    &:nth-child(even) {
      background-color: #ccc;
    }
    &[data-selected="true"] {
      background-color: #ccf;
    }
}
.addMemoBtn {
    margin-top: 20px;
}
.deleteMemoBtn {
  margin: 10px;
}
.memoTitle {
  height: 1.5em;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
}
.preview {
  width: 40%;
  text-align: left;
}
</style>
