function Login() {
  return (
    <section>
      <div class='d-flex justify-content-center p-5'>
        <img
          src='../assets/Triangles-1s-200px.svg'
          alt='loading animation'
          class='mt-5'
        />
      </div>
      <form class='mt-3'>
        <h1>Login</h1>
        {/* <div class="alert alert-danger" role="alert">
        {{errorMessage}}
      </div> */}
        <div class='mb-3'>
          <label for='username' class='form-label'>
            Username
          </label>
          <input
            type='text'
            required
            class='form-control'
            aria-describedby='usernameHelp'
            id='username'
            name='username'
            placeholder='Enter username'
          />
          <small id='usernameHelp' class='form-text text-muted'>
            Enter your username to login.
          </small>
        </div>
        <div class='row mb-3'>
          <div class='col'>
            <label for='password' class='form-label'>
              Password
            </label>
            <input
              type='password'
              required
              class='form-control'
              aria-describedby='passwordHelp'
              id='password'
              name='password'
              placeholder='Password'
            />
            <small id='passwordHelp' class='form-text text-muted'>
              Enter your password to login.
            </small>
          </div>
        </div>
        <button type='submit' class='btn btn-primary mb-5'>
          Login
        </button>
      </form>
    </section>
  );
}

export default Login;
