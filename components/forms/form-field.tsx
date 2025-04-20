"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface FormFieldProps {
  name: string
  label: string
  placeholder?: string
  type?: string
  value: string
  onChange: (e: React.ChangeEvent<any>) => void
  onBlur?: (e: React.FocusEvent<any>) => void
  error?: string | false
  className?: string
  textarea?: boolean
  required?: boolean
  disabled?: boolean
}

export function FormField({
  name,
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  className,
  textarea = false,
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>

      {textarea ? (
        <Textarea
          id={name}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(error && "border-destructive")}
        />
      ) : (
        <Input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={cn(error && "border-destructive")}
        />
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
