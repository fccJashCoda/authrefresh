<template>
  <!-- eslint-disable max-len  -->
  <form @submit.prevent="signup" class='mt-3'>
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
    <button type="submit" class="btn btn-primary">Submit</button>
  </form>
</template>

<script>

export default {
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
  }),
  methods: {
    signup() {
      if (this.validUser()) {
        // send data to server...
      }
      return null;
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match.';
        return false;
      }
      // if (this.user.usrname.length < 3 || this.user.username.length > 30) {
      //   return false;
      // }
      return true;
    },
    clearFields() {
      this.user.username = '';
      this.user.password = '';
      this.user.confirmPassword = '';
    },
  },
  name: 'Signup',
};
</script>
