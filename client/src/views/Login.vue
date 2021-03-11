<template>
  <!-- eslint-disable max-len  -->
  <form @submit.prevent="login" class='mt-3'>
    <h1>Login</h1>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{errorMessage}}
    </div>
    <div class="mb-3">
      <label for="username" class="form-label">Username</label>
      <input v-model="user.username"  type="text" required class="form-control" aria-describedby="usernameHelp" id="username" name="username" placeholder="Enter username">
      <small id="usernameHelp" class="form-text text-muted">
        Username must be longer than two characters and shorter than 30. Username must be alphanumeric, underscores are allowed.
      </small>
  </div>
    <div class="row mb-3">
      <div class="col">
        <label for="password" class="form-label">Password</label>
        <input v-model="user.password" type="password" required class="form-control" aria-describedby="passwordHelp" id="password" name="password" placeholder="Password">
        <small id="passwordHelp" class="form-text text-muted">
          Password must be at least 10 characters
        </small>
      </div>
    </div>
    <button type="submit" class="btn btn-primary mb-5">Submit</button>
  </form>
</template>

<script>
const API_URL = 'http://localhost:5431/auth/login';

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    login() {
      const body = {
        username: this.user.username,
        password: this.user.password,
      };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      };

      fetch(API_URL, options).then((response) => console.log(response));
    },
  },
  name: 'Login',
};
</script>
