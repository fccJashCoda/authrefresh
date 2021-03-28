function Dashboard() {
  return (
    <section class='p-4'>
      <h1>Dashboard</h1>
      <h3>Getting user information...</h3>
      {/* <h3 v-if="user">Welcome, {{user.username}}!</h3> */}
      <button class='btn btn-warning mt-5'>Logout</button>
      <button class='btn btn-info mt-5'>Toggle Form</button>
      <form>
        <div class='mb-3'>
          <label for='title' class='form-label'>
            Title
          </label>
          <input
            required
            ype='text'
            class='form-control'
            id='title'
            aria-describedby='titleHelp'
            placeholder='Enter your title'
          />
          <div id='titleHelp' class='form-text'>
            Enter a title for your note
          </div>
        </div>
        <div class='mb-3'>
          <label for='note' class='form-label'>
            Note
          </label>
          <textarea
            required
            class='form-control'
            id='note'
            placeholder='Enter your note...'
          ></textarea>
        </div>
        <button type='submit' class='btn btn-primary'>
          Post note
        </button>
      </form>
      <section class='row mt-4'>
        <div class='col-6'>
          <div class='card text-white border-primary mb-3'>
            {/* <div class="card-header d-flex d-flex justify-content-between align-items-center"><span>{{note.createdAt}}</span><span class="btn btn-info">🧨</span></div> */}
            <div class='card-body'>
              {/* <h4 class="card-title">{{note.title}}</h4> */}
              <p class='card-text' v-html='renderMarkdown(note.text)'></p>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}

export default Dashboard;
