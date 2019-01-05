<template>
<div id='home'>
  <h1 class='logo'><img alt="チョイメモ" src='../assets/logo.png'></h1>
  <p class='description'>こんにちは！ちょっとしたメモを簡単にオンラインに保存できます。</p>
  <button @click='googleLogin'>Google アカウントでログイン</button>
</div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      msg: 'Welcome to MyMarkdown'
    }
  },
  methods: {
    googleLogin() {
      firebase
        .auth()
        .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
    }
  }
}
</script>
<style lang="scss" scoped>
#home {
  text-align: center
}
.logo {
  margin-top: 3rem
}
.description{
  margin: 10px;
}
</style>