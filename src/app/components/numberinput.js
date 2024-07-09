import React, { useState, useEffect } from 'react';
import { formatNumber } from '@/app/utils/utils'

// Comma counting for retaining caret position
const countCommas = (formattedNumber, caretPosition) => {
  const beforeCaret = formattedNumber.substring(0, caretPosition)
  return ((beforeCaret.match(/,/g) || []).length)
}

const validate = (input, minimum, maximum) => {
  // Block non-numeric characters except (.)
  input = input.replace(/[^0-9.]/g, '');

  // Replace additional (.)s
  input = input.replace(/(\..*)\./g, '$1');

  // Ceiling the value if maximum is defined
  if (maximum !== undefined) {
    if (input !== undefined) {
      input = Math.min(maximum, input)
    }
  }

  // Floor the value if minimum is defined
  // Remember that 0 is falsy
  if (minimum !== undefined) {
    if (input !== undefined) {
      input = Math.max(minimum, input)
    }
  }

  return input
}

export function NumberInput({ name, value, onChange, minimum, maximum, ...rest }) {
  const [formattedValue, setFormattedValue] = useState(formatNumber(value));

  // Format and update the state when value or maximum changes
  useEffect(() => {
    // Handle value change
    let formatted = ""
    let inputValue = null
    
    try {
      inputValue = value.toString();
      inputValue = validate(inputValue, minimum, maximum)

      formatted = formatNumber(inputValue);
    } catch (error) {}

    // Format number with comma separators
    setFormattedValue(formatted);

    if (onChange) {
      onChange({
        target: {
          name,
          value: parseFloat(inputValue),
        },
      });
    }

  }, [value, minimum, maximum]);

  const handleInputChange = (event) => {
    let caretPos = event.target.selectionStart;
    let inputValue = event.target.value;
    
    // For caret position
    let commasBefore = countCommas(inputValue)

    inputValue = validate(inputValue, minimum, maximum)

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
          value: parseFloat(inputValue),
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
