import React, { useState, useEffect } from 'react';
import { formatNumber } from '@/app/utils/utils'

// Comma counting for retaining caret position
const countCommas = (formattedNumber, caretPosition) => {
  const beforeCaret = formattedNumber.substring(0, caretPosition)
  return ((beforeCaret.match(/,/g) || []).length)
}

const validate = (input, maximum) => {
  // Block non-numeric characters except (.)
  input = input.replace(/[^0-9.]/g, '');

  // Replace additional (.)s
  input = input.replace(/(\..*)\./g, '$1');

  // Ceiling the value if maximum is defined
  if (maximum !== undefined) {
    if (input) {
      input = Math.min(maximum, input)
    }
  }

  return input
}

export function NumberInput({ name, value, onChange, maximum, ...rest }) {
  const [formattedValue, setFormattedValue] = useState(formatNumber(value));

  // Format and update the state when value or maximum changes
  useEffect(() => {
    // Handle value change
    let formatted = ""

    let inputValue = "0"
    
    try {
      inputValue = value.toString();
  
      inputValue = validate(inputValue, maximum)

      formatted = formatNumber(inputValue);
    } catch (error) {
      formatted = ""
    }

    // Format number with comma separators

    setFormattedValue(formatted);

    if (onChange) {
      onChange({
        target: {
          name,
          value: inputValue,
        },
      });
    }

  }, [value, maximum]);

  const handleInputChange = (event) => {
    let caretPos = event.target.selectionStart;
    let inputValue = event.target.value;
    
    // For caret position
    let commasBefore = countCommas(inputValue)

    inputValue = validate(inputValue, maximum)

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
          name,
          value: inputValue,
        },
      });
    }
  };

  return (
    <input
      {...rest}
      name={name}
      onChange={handleInputChange}
      value={formattedValue}
    />
  );
}
