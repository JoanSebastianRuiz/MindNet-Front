const hasUpperCase = (password) => {
  return /[A-Z]/.test(password);
};

const hasLowerCase = (password) => {
  return /[a-z]/.test(password);
};

const hasNumber = (password) => {
  return /\d/.test(password);
};

const hasSpecialChar = (password) => {
  return /[!@#$%^&*(),.?":{}|<>]/.test(password);
};

const hasNoSpaces = (password) => {
  return !/\s/.test(password);
};


export { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasNoSpaces };
