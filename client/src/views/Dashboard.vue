<template>
  <!-- eslint-disable max-len -->
  <section class='p-4'>
    <h1>Dashboard</h1>
    <h3 v-if="!user">Getting user information...</h3>
    <h3 v-if="user">Welcome, {{user.username}}!</h3>
    <button @click="logout" class='btn btn-warning mt-5'>Logout</button>
    <button @click='showForm()' class="btn btn-info mt-5">Toggle Form</button>
    <form v-if='toggleForm' @submit.prevent="addNote()">
      <div class="mb-3">
        <label for="title" class="form-label">Title</label>
        <input v-model="note.title" required ype="text" class="form-control" id="title" aria-describedby="titleHelp" placeholder="Enter your title">
        <div id="titleHelp" class="form-text">Enter a title for your note</div>
      </div>
      <div class="mb-3">
        <label for="note" class="form-label">Note</label>
        <textarea v-model="note.text" required class="form-control" id="note" placeholder="Enter your note..."></textarea>
      </div>
      <button type="submit" class="btn btn-primary">Post note</button>
    </form>
    <section class='row mt-4'>
      <div v-for="note in notes" v-bind:key="note.createdAt" class="col-4">
        <div class="card text-white border-primary mb-3">
          <div class="card-header">{{note.createdAt}}</div>
          <div class="card-body">
            <h4 class="card-title">{{note.title}}</h4>
            <p class="card-text">{{note.text}}</p>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
const API_URL = 'http://localhost:5431/';

export default {
  data: () => ({
    toggleForm: true,
    user: {},
    notes: [],
    note: {
      title: '',
      text: '',
    },
  }),
  mounted() {
    fetch(`${API_URL}auth/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }).then((response) => response.json()).then((result) => {
      if (result.user) {
        this.user = result.user;
        this.getNotes();
      } else {
        this.logout();
      }
    })
      .catch((err) => console.log(err));
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.$router.push({ name: 'Login' });
    },
    addNote() {
      const options = {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(this.note),
      };
      fetch(`${API_URL}api/v1/notes`, options)
        .then((response) => response.json())
        .then((note) => {
          console.log(note);
          this.getNotes();
          this.note = {
            title: '',
            text: '',
          };
          this.showForm();
        });
    },
    getNotes() {
      fetch(`${API_URL}api/v1/notes`, {
        method: 'GET',
        headers: {
          'content-type': 'application/json',
          authorization: `bearer ${localStorage.getItem('token')}`,
        },
      })
        .then((response) => response.json())
        .then((posts) => {
          this.notes = posts;
          return null;
        })
        .catch(() => console.log("shit's on fire"));
    },
    showForm() {
      this.toggleForm = !this.toggleForm;
    },
  },
  name: 'Dashboard',
};
</script>
