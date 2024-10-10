// Define initial state
const initialState = {
    currentValue: "0",
    operator: null,
    previousValue: null,
  };
  
  // Handle numbers
  const handleNumber = (value, state) => {
    if (state.currentValue === "0") {
      return { currentValue: `${value}` };
    }
    return { currentValue: `${state.currentValue}${value}` };
  };
  
  // Handle equal sign (=)
  const handleEqual = (state) => {
    const { currentValue, previousValue, operator } = state;
    const current = parseFloat(currentValue);
    const previous = parseFloat(previousValue);
    const resetState = { operator: null, previousValue: null };
  
    if (operator === "/") {
      return { currentValue: previous / current, ...resetState };
    }
    if (operator === "*") {
      return { currentValue: previous * current, ...resetState };
    }
    if (operator === "+") {
      return { currentValue: previous + current, ...resetState };
    }
    if (operator === "-") {
      return { currentValue: previous - current, ...resetState };
    }
  
    return state;
  };
  
  // Core calculator function
  const calculator = (type, value, state) => {
    switch (type) {
      case "number":
        return handleNumber(value, state);
      case "operator":
        return {
          operator: value,
          previousValue: state.currentValue,
          currentValue: "0",
        };
      case "equal":
        return handleEqual(state);
      case "clear":
        return initialState;
      case "posneg":
        return {
          currentValue: `${parseFloat(state.currentValue) * -1}`,
        };
      case "percentage":
        return {
          currentValue: `${parseFloat(state.currentValue) * 0.01}`,
        };
      default:
        return state;
    }
  };
  
  // Export the calculator function and initialState
  module.exports = { calculator, initialState };
  