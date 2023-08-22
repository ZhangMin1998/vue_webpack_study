<template>
  <h1 class="title"> hello app</h1>
  <ul>
    <li>
      <router-link to='/'>Home</router-link>
    </li>
    <li>
      <router-link to='/about'>About</router-link>
    </li>
  </ul>
  <router-view></router-view>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
.title{
  font-size: 36px;
  color: pink;
}
</style>
