import * as Headless from '@headlessui/react'
import clsx from 'clsx'

const sizes = {
  xs: 'sm:max-w-xs',
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '2xl': 'sm:max-w-2xl',
  '3xl': 'sm:max-w-3xl',
  '4xl': 'sm:max-w-4xl',
  '5xl': 'sm:max-w-5xl',
}

export function Dialog({ open, onClose, size = 'lg', className, children, ...props }) {
  return (
    <Headless.Transition appear show={open} {...props}>
      <Headless.Dialog className="z-10" onClose={onClose}>
        <Headless.TransitionChild
          enter="ease-out duration-100"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="z-[19] fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Headless.TransitionChild>

        <div className="z-20 fixed inset-0 w-screen overflow-y-auto pt-6 sm:pt-0">
          <div className="grid min-h-full grid-rows-[1fr_auto] justify-items-center sm:grid-rows-[1fr_auto_3fr] sm:p-4">
            <Headless.TransitionChild
              enter="ease-out duration-100"
              enterFrom="opacity-0 translate-y-12 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-12 sm:translate-y-0"
            >
              <Headless.DialogPanel
                className={clsx(
                  className,
                  sizes[size],
                  'row-start-2 w-full min-w-0 rounded-t-3xl bg-white p-[--gutter] shadow-lg ring-1 ring-zinc-950/10 [--gutter:theme(spacing.8)] sm:mb-auto sm:rounded-2xl forced-colors:outline'
                )}
              >
                {children}
              </Headless.DialogPanel>
            </Headless.TransitionChild>
          </div>
        </div>
      </Headless.Dialog>
    </Headless.Transition>
  )
}

export function DialogTitle({ className, ...props }) {
  return (
    <Headless.DialogTitle
      {...props}
      className={clsx(className, 'text-base font-semibold leading-6 text-gray-900')}
    />
  )
}

export function DialogDescription({ className, ...props }) {
  return <Headless.Description {...props} className={clsx(className, 'mt-2 text-pretty')} />
}

export function DialogBody({ className, ...props }) {
  return <div {...props} className={clsx(className, 'mt-6')} />
}

export function DialogActions({ className, ...props }) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'mt-6 flex flex-col-reverse items-center justify-end gap-3 *:w-full sm:flex-row sm:*:w-auto'
      )}
    />
  )
}
