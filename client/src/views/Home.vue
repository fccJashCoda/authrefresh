<template>
<!-- eslint-disable max-len  -->
  <div class="home">
    <div class="jumbotron text-center">
      <h1 class="display-3">Authentication for rusty people 🦀</h1>
      <p class="lead">Spaced repetition is kewl</p>
      <hr class="my-4">
      <p>Click here to register</p>
      <p class="lead">
        <router-link
          class="btn btn-primary btn-lg"
          :to="{name: 'Signup'}"
          role="button">
          Sign Up
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
  components: {
  },
};
</script>
