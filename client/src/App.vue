<template>
  <!-- eslint-disable max-len  -->
  <div id="app">
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <a v-on:click="goHome" class="navbar-brand" href="#">Auth Refresher</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link
              :to="{name: 'Login'}"
            >
            <a class="nav-link active" aria-current="page" href="#">Login</a>
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view class='container'/>
  </div>
</template>

<script>
export default {
  methods: {
    goHome() {
      this.$router.push({ name: 'Home' });
    },
  },
};
</script>
