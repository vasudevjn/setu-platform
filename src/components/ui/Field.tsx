import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'
import { AlertCircle } from 'lucide-react'
import { cn } from '../../lib/cn'

interface FieldShellProps {
  label: string
  /** Keep the label for screen readers but do not show it. */
  hideLabel?: boolean
  hint?: string
  error?: string
  id: string
  children: ReactNode
}

function FieldShell({ label, hideLabel, hint, error, id, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={cn('text-button font-semibold text-ink', hideLabel && 'sr-only')}>
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-err`} role="alert" className="flex items-start gap-1.5 text-detail text-error">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-detail text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

const inputBase =
  'w-full rounded-button border bg-white px-4 text-body text-ink placeholder:text-muted/80 transition-colors focus:border-teal focus:outline-none focus-visible:ring-3 focus-visible:ring-teal/25'

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  hint?: string
  error?: string
}

export function TextField({ label, hint, error, className, ...rest }: TextFieldProps) {
  const id = useId()
  return (
    <FieldShell label={label} hint={hint} error={error} id={id}>
      <input
        id={id}
        aria-invalid={!!error || undefined}
        aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
        className={cn(inputBase, 'min-h-13', error ? 'border-error' : 'border-line', className)}
        {...rest}
      />
    </FieldShell>
  )
}

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  hideLabel?: boolean
  hint?: string
  error?: string
  /** A control (like the mic) placed in the corner of the box */
  corner?: ReactNode
}

export function TextArea({ label, hideLabel, hint, error, corner, className, ...rest }: TextAreaProps) {
  const id = useId()
  return (
    <FieldShell label={label} hideLabel={hideLabel} hint={hint} error={error} id={id}>
      <div className="relative">
        <textarea
          id={id}
          aria-invalid={!!error || undefined}
          aria-describedby={error ? `${id}-err` : hint ? `${id}-hint` : undefined}
          className={cn(inputBase, 'min-h-32 py-3 pr-16 resize-none', error ? 'border-error' : 'border-teal/60', className)}
          {...rest}
        />
        {corner && <div className="absolute bottom-3 right-3">{corner}</div>}
      </div>
    </FieldShell>
  )
}

export function SelectField({
  label,
  hint,
  children,
  className,
  ...rest
}: { label: string; hint?: string } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  const id = useId()
  return (
    <FieldShell label={label} hint={hint} id={id}>
      <select id={id} className={cn(inputBase, 'min-h-13 border-line', className)} {...rest}>
        {children}
      </select>
    </FieldShell>
  )
}

export function CheckField({ label, checked, onChange, error }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="flex min-h-12 cursor-pointer items-start gap-3 rounded-button border border-line bg-white p-3.5">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 size-5 shrink-0 accent-teal" />
        <span className="text-body text-ink">{label}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1.5 flex items-start gap-1.5 text-detail text-error">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}
