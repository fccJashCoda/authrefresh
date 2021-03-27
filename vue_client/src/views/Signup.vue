<template>
  <!-- eslint-disable max-len  -->
  <section>
    <div v-if="loading" class='d-flex justify-content-center p-5'>
      <img src="../assets/Triangles-1s-200px.svg" alt="loading animation" class='mt-5'>
    </div>
    <form v-if="!loading" @submit.prevent="signup" class='mt-3'>
      <h1>Signup</h1>
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
          <div class="col">
            <label for="confirmPassword" class="form-label">Confirm Password</label>
            <input v-model="user.confirmPassword" type="password" required class="form-control" aria-describedby="confirmPasswordHelp" id="confirmPassword" name="confirmPassword" placeholder="Confirm Password">
            <small id="confirmPasswordHelp" class="form-text text-muted">
              Please confirm password
            </small>
          </div>
        </div>
        <button type="submit" class="btn btn-primary mb-5">Sign-up</button>
      </form>
  </section>
</template>

<script>
import Joi from 'joi';

// import Triangles from '../assets/Triangles-1s-200px.svg';

const API_URL = 'http://localhost:5431/auth/signup';

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
  confirmPassword: Joi
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
      confirmPassword: '',
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
    signup() {
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

            return response.json().then((error) => {
              throw new Error(error.message);
            });
          }).then((result) => {
            localStorage.setItem('token', result.token);
            setTimeout(() => {
              this.loading = false;
              this.$router.push({ name: 'Dashboard' });
            }, 1000);
          }).catch((error) => {
            setTimeout(() => {
              this.loading = false;
              this.errorMessage = error.message;
            }, 1000);
          });
      }
      return null;
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match.';
        return false;
      }

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
  name: 'Signup',
};
</script>
