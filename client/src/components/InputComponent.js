function InputComponent(props) {
  return (
    <>
      <label htmlFor={props.name} className='form-label'>
        {props.title}
      </label>
      <input
        onChange={(e) => props.action(e)}
        type={props.type}
        // required
        className='form-control'
        aria-describedby='usernameHelp'
        id={props.name}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        required={props.ignore ? false : true}
      />
      <small id={`${props.name}Help`} className='form-text text-muted'>
        {props.message}
      </small>
    </>
  );
}

export default InputComponent;
