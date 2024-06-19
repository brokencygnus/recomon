import React, { useState } from 'react';

const formatNumber = (numberString) => {
  const parts = numberString.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  return parts.join('.');
};

export function NumberInput({ value, onChange, maximum, ...rest }) {
  const [formattedValue, setFormattedValue] = useState(formatNumber(value));

  const handleInputChange = (event) => {
    let caretPos = event.target.selectionStart;
    let inputValue = event.target.value;
    
    // For caret position
    let commasBefore = countCommas(inputValue)

    // Block non-numeric characters except (.)
    inputValue = inputValue.replace(/[^0-9.]/g, '');

    // Replace additional (.)s
    inputValue = inputValue.replace(/(\..*)\./g, '$1');

    // Ceiling the value if maximum is defined
    if (maximum) {
      if (inputValue) {
        inputValue = Math.min(maximum, inputValue)
      }
    }

    // Format number with comma separators
    const formatted = formatNumber(inputValue);

    // For caret position
    let commasAfter = countCommas(formatted)

    setFormattedValue(formatted);

    let newCaretPos = caretPos - commasBefore + commasAfter
    // Handle backspaces because for some reason the caret positioning prevents it
    if (formatted.substring(newCaretPos-1, newCaretPos) == ",") {
      newCaretPos -= 1
    }
    
    // Retain caret position
    // I spent way too much time on this
    window.requestAnimationFrame(() => {
      event.target.selectionStart = newCaretPos
      event.target.selectionEnd = newCaretPos
    })

    if (onChange) {
      onChange({
        target: {
          name: event.target.name,
          value: inputValue,
        },
      });
    }
  };

  // Comma counting for retaining caret position
  const countCommas = (formattedNumber, caretPosition) => {
    const beforeCaret = formattedNumber.substring(0, caretPosition)
    return ((beforeCaret.match(/,/g) || []).length)
  }

  return (
    <input
      {...rest}
      onChange={handleInputChange}
      value={formattedValue}
    />
  );
}
