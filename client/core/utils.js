export const emailValidator = (email) => {
    const re = /\S+@\S+\.\S+/;
  
    if (!email || email.length <= 0) return 'Email cannot be empty.';
    if (!re.test(email)) return 'Ooops! We need a valid email address.';
  
    return '';
  };
  
  export const passwordValidator = (password) => {
    const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
    if (!password || password.length <= 0) return 'Password cannot be empty.';
    if(!re.test(password)) return 'Ooops! Invalid password.'
    return '';
  };
  
  export const nameValidator = (name) => {
    if (!name || name.length <= 0) return 'Name cannot be empty.';
  
    return '';
  };
  