import { useState, useRef } from 'react';
import { useCalendar, useRangeCalendar, useCalendarGrid, useCalendarCell, useLocale } from 'react-aria';
import { useCalendarState, useRangeCalendarState } from 'react-stately';
import { createCalendar } from '@internationalized/date';
import { DateInput, DatePicker, DateRangePicker, DateSegment, Dialog, Group, Heading, Label, Popover } from 'react-aria-components';
import { isSameDay, parseDate, Time, getWeeksInMonth } from '@internationalized/date';
import { ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon, } from '@heroicons/react/20/solid'
import { Transition } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function DatePickerComp({ value, onChange, className, ...props }) {
  let [isOpen, setOpen] = useState(false)

  return (
    <DatePicker
      value={value}
      onChange={onChange}
      {...props}
    >
      <Label className="sr-only">{props["aria-label"]}</Label>
      <Group 
        className={classNames(className,
          "group flex px-3"
        )}
      >
        <Button onPress=
          {() => setOpen(true)}
          className="flex grow justify-between outline-none"
        >
          <DateInput className="flex">
            {(segment) => 
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
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Button>
      </Group>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        {/* Whose good idea is it to make the popover z-index 10000 by default and unable to be overridden by tailwind? */}
        <Popover style={{zIndex: 40}} isOpen={isOpen} onOpenChange={setOpen} className=" mt-2 py-1 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <Dialog className="outline-none">
            <Calendar
              value={value}
              onChange={onChange}
            />
          </Dialog>
        </Popover>
      </Transition>
    </DatePicker>
  );
}

export function DateRangePickerComp({ value, onChange, className, ...props }) {
  let [isOpen, setOpen] = useState(false)

  return (
    <DateRangePicker
      value={value}
      onChange={onChange}
      {...props}
    >
      <Label className="sr-only">{props["aria-label"]}</Label>
      <Group 
        className={classNames(className,
          "group flex px-3"
        )}
      >
        <Button onPress=
          {() => setOpen(true)}
          className="flex grow justify-between outline-none"
        >
          <div className="flex">
            <DateInput slot="start" className="flex">
              {(segment) => 
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
            <span className="text-gray-400" aria-hidden="true">–</span>
            <DateInput slot="end" className="flex">
              {(segment) => 
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
          </div>
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Button>
      </Group>
      <Transition
        show={isOpen}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Popover style={{zIndex: 40}} isOpen={isOpen} onOpenChange={setOpen} className=" mt-2 py-1 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <Dialog className="outline-none">
            <RangeCalendar
              value={value}
              onChange={onChange}
            />
          </Dialog>
        </Popover>
      </Transition>
    </DateRangePicker>
  );
}

import {Button} from 'react-aria-components';

function Calendar(props) {
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    createCalendar
  });

  let { calendarProps, prevButtonProps, nextButtonProps, title } = useCalendar(
    props,
    state
  );

  return (
    <div {...calendarProps} className="text-center px-4 py-3">
      <div className="flex items-center text-gray-900">
        <Button {...prevButtonProps} slot="previous" className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Heading className="flex-auto text-sm font-semibold">{title}</Heading>
        <Button {...nextButtonProps} slot="next" className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}

function RangeCalendar(props) {
  let { locale } = useLocale();
  let state = useRangeCalendarState({
    ...props,
    locale,
    createCalendar
  });

  let ref = useRef(null);
  let { calendarProps, prevButtonProps, nextButtonProps, title } =
    useRangeCalendar(props, state, ref);

  return (
    <div {...calendarProps} className="text-center px-4 py-3">
      <div className="flex items-center text-gray-900">
        <Button {...prevButtonProps} slot="previous" className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
          <span className="sr-only">Previous month</span>
          <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
        <Heading className="flex-auto text-sm font-semibold">{title}</Heading>
        <Button {...nextButtonProps} slot="next" className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500">
          <span className="sr-only">Next month</span>
          <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
      <CalendarGrid state={state} />
    </div>
  );
}


function CalendarGrid({ state, ...props }) {
  let { locale } = useLocale();
  let { gridProps, headerProps, weekDays } = useCalendarGrid(props, state);

  // Get the number of weeks in the month so we can render the proper number of rows.
  let weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);
  let weeksArray = [...new Array(weeksInMonth).keys()]

  return (
    <table {...gridProps} className="mt-3">
      <thead {...headerProps}>
        <tr className="text-xs leading-6 font-normal text-gray-500">
          {weekDays.map((day, index) => <th key={index}>{day}</th>)}
        </tr>
      </thead>
      <tbody className="mt-2 bg-gray-200 text-sm shadow ring-1 ring-gray-200 rounded-lg divide-y divide-gray-200">
        {weeksArray.map((weekIndex) => (
          <tr key={weekIndex} className="divide-x divide-gray-200">
            {state.getDatesInWeek(weekIndex).map((date, i) => (
              date
                ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    x={i}
                    y={weekIndex}
                    weekLength={weeksArray.length}
                  />
                )
                : <td key={i} />
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CalendarCell({ state, date, x, y, weekLength }) {
  let ref = useRef(null);
  let {
    cellProps,
    buttonProps,
    isSelected,
    isOutsideVisibleRange,
    formattedDate
  } = useCalendarCell({ date }, state, ref);

  let isSelectionStart = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.start)
    : isSelected;
  let isSelectionEnd = state.highlightedRange
    ? isSameDay(date, state.highlightedRange.end)
    : isSelected;

  const isToday = (date) => {
    const now = new Date()
    return date.year == now.getFullYear() && date.month == now.getMonth() + 1 && date.day == now.getDate()
  }

  return (
    <td {...cellProps} className={classNames(
        'h-10 w-10 outline-none p-0',
        !isSelected && "hover:bg-gray-100",
        isOutsideVisibleRange ? 'bg-gray-50' : 'bg-white',
        x == 0 && y == 0 && "rounded-tl-lg",
        x == 6 && y == 0 && "rounded-tr-lg",
        x == 0 && y == weekLength - 1 && "rounded-bl-lg",
        x == 6 && y == weekLength - 1 && "rounded-br-lg",
      )}
    >
      <div
        {...buttonProps}
        ref={ref}
        className={classNames(
          "relative outline-none size-full py-1.5",
          // (isSelected || isToday(date)) && 'font-semibold',
          !isSelected && !isOutsideVisibleRange && !isToday(date) && 'text-gray-900',
          !isSelected && isOutsideVisibleRange && !isToday(date) && 'text-gray-400',
          isToday(date) && 'text-sky-600 font-semibold',

          isSelectionStart && !isSelectionEnd && 'pl-1.5',
          isSelectionEnd && !isSelectionStart && 'pr-1.5',
          isSelectionStart && isSelectionEnd && 'px-1.5',
        )}
      >
        <div className={classNames(
            'flex outline-none size-full',
            isSelected && 'bg-sky-100',

            isSelectionStart && !isSelectionEnd && 'rounded-l-full pr-1.5',
            isSelectionEnd && !isSelectionStart && 'rounded-r-full pl-1.5',
            isSelectionStart && isSelectionEnd && 'rounded-full',
            // isSelected && !isSelectionStart && !isSelectionEnd && 'h-6 w-10',
            // isSelected && 'bg-sky-300',
            // !isSelected && !isToday(date) && 'mx-2 h-6 w-6',
            // !isSelected && isToday(date) && 'rounded-lg mx-2 h-6 w-6 ring-1 ring-inset ring-sky-500'
          )}
        >
        </div>
        <div className="absolute top-0 left-0 size-full pointer-events-none p-1">
          <div className={classNames(
              'flex items-center justify-center size-full rounded-full',
              (isSelectionStart || isSelectionEnd) && 'bg-sky-600 text-white',
            )}
          >
            {formattedDate}
          </div>
        </div>
      </div>
    </td>
  );
}