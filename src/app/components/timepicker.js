import { Time } from '@internationalized/date';
import { DateInput, DateSegment, Label, TimeField } from 'react-aria-components';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function TimePickerComp({ value, onChange, className, ...props }) {
  return (
    <TimeField
      value={value}
      onChange={onChange}
      {...props}
    >
      <Label className="sr-only">{props["aria-label"]}</Label>
      <DateInput className={classNames(className, "flex px-3")}>
        {segment =>
          <DateSegment
            style={{ caretColor: "transparent"}}
            className={classNames(
              segment.isEditable && "hover:cursor-text rounded-sm px-1 focus:bg-sky-100",
              segment.isPlaceholder || segment.type == "literal" ? "text-gray-400" : "text-gray-900",
              "outline-none"
            )}
            segment={segment}
          />
        }
      </DateInput>
    </TimeField>
  )
}