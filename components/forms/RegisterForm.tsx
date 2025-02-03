'use client'

import CustomFormField, { FormFieldTypes } from '@/components/CustomFormField'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SelectItem } from '@/components/ui/select'
import { Doctors } from '@/constants'
import { createUser } from '@/lib/actions/patient.actions'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters.')
    .max(50, 'Name must be at most 50 characters.'),
  email: z.string().email('Invalid email address.'),
  phone: z
    .string()
    .refine(
      (value) => /^\+?[1-9]\d{1,14}$/.test(value),
      'Invalid phone number.',
    ),
})

export default function RegisterForm({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  console.log({ user })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const user = await createUser({ ...values })
      if (user) {
        router.push(`/patient/${user.$id}/register`)
      }
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Personal Information</h2>
        </section>
        <CustomFormField
          control={form.control}
          type={FormFieldTypes.Input}
          label="Full name"
          name="name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Input}
            label="Email"
            name="email"
            placeholder="johndoe@gmail.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Phone}
            label="Phone"
            name="phone"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.DatePicker}
            label="Date of Birth"
            name="birthDate"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Skeleton}
            label="Gender"
            name="gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onChange={field.onChange}
                  defaultValue={field.value}
                >
                  {['Male', 'Female', 'Other'].map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem
                        value={option}
                        id={option}
                        title={option}
                      />
                      <Label htmlFor={option}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Input}
            label="Address"
            name="address"
            placeholder="14th Street, New York"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Input}
            label="Occupation"
            name="occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Input}
            label="Emergency Contact Name"
            name="emergencyContactName"
            placeholder="Guardian's name"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Phone}
            label="Emergency Contact Number"
            name="emergencyContactNumber"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Medical Information</h2>
        </section>

        <CustomFormField
          control={form.control}
          type={FormFieldTypes.Select}
          label="Primary Physician"
          name="primaryPhysician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor) => (
            <SelectItem key={doctor.name} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt={doctor.name}
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <Button
          type="submit"
          disabled={loading}
          className="shad-primary-btn w-full"
        >
          {loading ? (
            <div className="flex items-center gap-4">
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="animate-spin"
              />
              Loading...
            </div>
          ) : (
            'Get started'
          )}
        </Button>
      </form>
    </Form>
  )
}
