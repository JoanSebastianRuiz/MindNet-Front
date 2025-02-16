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

const isValidImageUrl = (url) => {
    return /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(url);
};

const isImageUrlAccessible = async (url) => {
    try {
        const response = await fetch(url, { method: "HEAD" });
        const contentType = response.headers.get("content-type");
        return contentType && contentType.startsWith("image/");
    } catch (error) {
        return false;
    }
};

export { hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar, hasNoSpaces, isValidImageUrl, isImageUrlAccessible };
