<template>
<!-- color=success などを使うには v-app で囲う必要がある -->
<v-app class="editor">
  <v-container fluid class='header-container'>
    <v-layout row justify-space-between>
      <v-flex xs1>
        <h1 px-0><img alt='チョイメモ' src='../assets/logo.png' class='logo'></h1>
      </v-flex>
      <v-flex xs2>
        <v-chip>{{user.displayName}}</v-chip>
        <v-btn @click='logout'>ログアウト</v-btn>
      </v-flex>
    </v-layout>
    <v-layout class="editorWrapper">
      <v-flex class="memoListWrapper" xs2 px-1>
        <v-btn color='success' class='addMemoBtn' @click='addMemo'>メモの追加</v-btn>
        <v-btn color='error' class='deleteMemoBtn' @click='deleteMemo' v-if='memos.length > 1'>選択中のメモの削除</v-btn>
        <v-list two-line>
          <template v-for='(memo, index) in memos'>
            <v-list-tile class='memoList' @click='selectMemo(index)' :data-selected='index == selectedIndex'>
              <v-list-tile-content>
                <v-list-tile-title class="memoTitle">{{ displayTitle(memo.markdown) }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ formattedTime(memo.updatedAt) }}</v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-divider />
          </template>
        </v-list>
      </v-flex>
      <v-flex xs5 px-1>
        <textarea class="markdown" @keyup='onMemoUpdated' v-model="memos[selectedIndex].markdown"></textarea>
      </v-flex>
      <v-flex xs5 px-1>
        <div class="preview markdown-body" v-html="preview()"></div>
      </v-flex>
    </v-layout>
  </v-container>
</v-app>
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
      // オブジェクトはfirebaseに保存できないので、プリミティブな値を保存
      this.memos[this.selectedIndex].updatedAt = this.currentUnixTime()
      this.saveMemos()
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
.logo {
    width: 200px;
}
.header-container {
    height: 50px;
}
.editorWrapper{
    display: flex;
}
.markdown {
    height: 500px;
    width: 100%;
}
.memoListWrapper {
    border-top: 1px solid #000;
}
.memoList {
    *[data-selected="true"] {
        font-weigth: bold;
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
    text-align: left;
}
</style>
