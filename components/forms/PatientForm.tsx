'use client'

import CustomFormField, { FormFieldTypes } from '@/components/CustomFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
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

export default function PatientForm() {
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true)
      console.log(values)
    } catch (e) {
      console.log(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Schedule your first appointment.</p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.Input}
          label="Full name"
          name="name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.Input}
          label="Email"
          name="email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldTypes.Phone}
          label="Phone"
          name="phone"
        />
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
