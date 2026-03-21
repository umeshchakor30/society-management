// For searching we are using the debounce function
export const debounce = (fn, delay) => {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// Validates common email formats (e.g., user@domain.com)
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validates Indian mobile numbers (10 digits starting with 6-9)
export const validatePhone = (phone) => {
  return /^[6-9]\d{9}$/.test(phone);
};

// Use throttle for infinite scrolling
export const throttle = (fn, delay) => {
  let lastCall = 0;

  return function (...args) {
    let now = new Date().getTime();

    if (now - lastCall >= delay) {
      fn(...args);
      lastCall = now;
    }
  };
};
