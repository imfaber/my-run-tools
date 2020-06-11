/**
 * Returns a function, that, as long as it continues to be invoked, will not
 * be triggered. The function will be called after it stops being called for
 * N milliseconds. If `immediate` is passed, trigger the function on the
 * leading edge, instead of the trailing.
 *
 * @param {Function} func The function to debounce.
 * @param {Number} wait The number of milliseconds to delay.
 * @param {Boolean} immediate Whether call the function on the leading edge
 * @returns {Function} Returns the new debounced function.
 */
export default function debounce(func, wait, immediate) {
    let timer = null;

    return function debouncedFunction(...args) {
        const callNow = immediate && !timer;
        clearTimeout(timer);
        timer = setTimeout(() => {
            timer = null;
            if (!immediate) func.apply(this, args);
        }, wait);
        if (callNow) func.apply(this, args);
    };
}
