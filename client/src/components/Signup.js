function Signup() {
  return (
    <section>
      {/* <div v-if='loading' className='d-flex justify-content-center p-5'>
        <img
          src='../assets/Triangles-1s-200px.svg'
          alt='loading animation'
          className='mt-5'
        />
      </div>
      <form v-if='!loading' className='mt-3'>
        <h1>Signup</h1>
        <div v-if='errorMessage' className='alert alert-danger' role='alert'>
          {{ errorMessage }}
        </div>
        <div className='mb-3'>
          <label for='username' className='form-label'>
            Username
          </label>
          <input
            v-model='user.username'
            type='text'
            required
            className='form-control'
            aria-describedby='usernameHelp'
            id='username'
            name='username'
            placeholder='Enter username'
          />
          <small id='usernameHelp' className='form-text text-muted'>
            Username must be longer than two characters and shorter than 30.
            Username must be alphanumeric, underscores are allowed.
          </small>
        </div>
        <div className='row mb-3'>
          <div className='col'>
            <label for='password' className='form-label'>
              Password
            </label>
            <input
              v-model='user.password'
              type='password'
              required
              className='form-control'
              aria-describedby='passwordHelp'
              id='password'
              name='password'
              placeholder='Password'
            />
            <small id='passwordHelp' className='form-text text-muted'>
              Password must be at least 10 characters
            </small>
          </div>
          <div className='col'>
            <label for='confirmPassword' className='form-label'>
              Confirm Password
            </label>
            <input
              v-model='user.confirmPassword'
              type='password'
              required
              className='form-control'
              aria-describedby='confirmPasswordHelp'
              id='confirmPassword'
              name='confirmPassword'
              placeholder='Confirm Password'
            />
            <small id='confirmPasswordHelp' className='form-text text-muted'>
              Please confirm password
            </small>
          </div>
        </div>
        <button type='submit' className='btn btn-primary mb-5'>
          Sign-up
        </button>
      </form> */}
      <p>Signup</p>
    </section>
  );
}

export default Signup;
