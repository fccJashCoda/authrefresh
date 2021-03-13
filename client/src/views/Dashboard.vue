<template>
  <section class='p-4'>
    <h1>Dashboard</h1>
    <h3 v-if="!user">Getting user information...</h3>
    <h3 v-if="user">Welcome, {{user.username}}!</h3>
    <button @click="logout" class='btn btn-warning mt-5'>Logout</button>
  </section>
</template>

<script>
const API_URL = 'http://localhost:5431/auth/';

export default {
  data: () => ({
    user: {},
  }),
  mounted() {
    fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((response) => response.json()).then((result) => {
      console.log(result);
      if (result.user) {
        this.user = result.user;
      } else {
        this.logout();
      }
    }).catch((err) => console.log(err));
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push({ name: 'Login' });
    },
  },
  name: 'Dashboard',
};
</script>
