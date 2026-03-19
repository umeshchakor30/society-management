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

// Use throttle for infinite scrolling
export const throttle = (fn, delay) => {
  let lastCall = 0;
  return function () {
    const now = Date().getTime();
  };
};
