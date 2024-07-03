import { Time } from '@internationalized/date';
import { DateInput, DateSegment, Label, TimeField } from 'react-aria-components';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function TimePickerComp({ value, onChange, className, ...props }) {
  return (
    <TimeField
      value={new Time(...value.split(":").map(val => parseInt(val)))}
      onChange={onChange}
      {...props}
    >
      <Label className="sr-only">{props["aria-label"]}</Label>
      <DateInput className={classNames(className, "flex px-3")}>
        {segment =>
          <DateSegment
            style={{ caretColor: "transparent"}}
            className={classNames(
              segment.isEditable && "hover:cursor-text rounded-sm px-1 focus:bg-indigo-100",
              "text-gray-900 outline-none"
            )}
            segment={segment}
          />
        }
      </DateInput>
    </TimeField>
  )
}