<template>
  <!-- eslint-disable max-len  -->
  <section>
    <div v-if="loading" class='d-flex justify-content-center p-5'>
        <img src="../assets/Triangles-1s-200px.svg" alt="loading animation" class='mt-5'>
    </div>
    <form v-if="!loading" @submit.prevent="login" class='mt-3'>
      <h1>Login</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{errorMessage}}
      </div>
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input v-model="user.username"  type="text" required class="form-control" aria-describedby="usernameHelp" id="username" name="username" placeholder="Enter username">
        <small id="usernameHelp" class="form-text text-muted">
          Enter your username to login.
        </small>
    </div>
      <div class="row mb-3">
        <div class="col">
          <label for="password" class="form-label">Password</label>
          <input v-model="user.password" type="password" required class="form-control" aria-describedby="passwordHelp" id="password" name="password" placeholder="Password">
          <small id="passwordHelp" class="form-text text-muted">
            Enter your password to login.
          </small>
        </div>
      </div>
      <button type="submit" class="btn btn-primary mb-5">Login</button>
    </form>
  </section>
</template>

<script>
import Joi from 'joi';

const API_URL = 'http://localhost:5431/auth/login';

const schema = Joi.object({
  username: Joi
    .string()
    .alphanum()
    .min(3)
    .max(20)
    .required(),
  password: Joi
    .string()
    .pattern(new RegExp('^[a-zA-Z0-9_]{8,30}$'))
    .required(),
});

export default {
  data: () => ({
    loading: false,
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
      if (this.validUser()) {
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

        this.loading = true;
        fetch(API_URL, options)
          .then((response) => {
            if (response.ok) {
              return response.json();
            }
            return response.json().then(() => {
              throw new Error('Incorrect Username or Password');
            });
          })
          .then((result) => {
            localStorage.setItem('token', result.token);
            setTimeout(() => {
              this.loading = false;
              this.$router.push({ name: 'Dashboard' });
            }, 1000);
          })
          .catch((error) => {
            setTimeout(() => {
              this.loading = false;
            }, 1000);
            this.errorMessage = error.message;
          });
      }
      return null;
    },
    validUser() {
      const result = schema.validate(this.user);
      if (!result.error) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Invalid Username';
      } else {
        this.errorMessage = 'Invalid Password';
      }
      return false;
    },
  },
  name: 'Login',
};
</script>
