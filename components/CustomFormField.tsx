/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Control } from 'react-hook-form'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

export enum FormFieldTypes {
  Input = 'input',
  Textarea = 'textarea',
  Phone = 'phone',
  Checkbox = 'checkbox',
  DatePicker = 'datePicker',
  Select = 'select',
  Skeleton = 'skeleton',
}

interface Props {
  control: Control<any>
  name: string
  fieldType: FormFieldTypes
  label?: string
  placeholder?: string
  iconSrc?: string
  iconAlt?: string
  disabled?: boolean
  dateFormat?: string
  showTimeSelect?: boolean
  children?: React.ReactNode
  renderSkeleton?: (field: any) => React.ReactNode
}

const RenderInput = ({ field, props }: { field: any; props: Props }) => {
  const { fieldType, iconSrc, iconAlt, placeholder } = props
  switch (fieldType) {
    case FormFieldTypes.Input:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              width={24}
              height={24}
              alt={iconAlt || 'icon'}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      )
    case FormFieldTypes.Phone:
      return (
        <FormControl>
          <PhoneInput
            defaultCountry="US"
            international
            value={field.value}
            onChange={field.onChange}
            className="input-phone"
          />
        </FormControl>
      )
  }
}

export default function CustomFormField(props: Props) {
  const { control, name, label, fieldType } = props

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FormFieldTypes.Checkbox && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderInput field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  )
}
