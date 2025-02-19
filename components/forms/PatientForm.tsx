'use client'

import CustomFormField, { FormFieldTypes } from '@/components/CustomFormField'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { createUser } from '@/lib/actions/patient.actions'
import { UserFormValidation } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function PatientForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    try {
      setLoading(true)
      const user = await createUser({ ...values })
      if (user) {
        router.push(`/patient/${user.$id}/register`)
      }
    } catch (error) {
      console.log(error)
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
          type={FormFieldTypes.Input}
          label="Full name"
          name="name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
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
