'use client'

import CustomFormField, { FormFieldTypes } from '@/components/CustomFormField'
import FileUploader from '@/components/FileUploader'
import { Button } from '@/components/ui/button'
import { Form, FormControl } from '@/components/ui/form'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SelectItem } from '@/components/ui/select'
import {
  Doctors,
  IdentificationTypes,
  PatientFormDefaultValues,
} from '@/constants'
import { registerPatient } from '@/lib/actions/patient.actions'
import { PatientFormValidation } from '@/lib/validations'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function RegisterForm({ user }: { user: User }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: '',
      email: '',
      phone: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof PatientFormValidation>) => {
    try {
      setLoading(true)
      const formData = new FormData()
      const file = values.identificationDocument?.[0]

      if (file) {
        const blobFile = new Blob([file], { type: file.type })
        formData.append('blobFile', blobFile)
        formData.append('fileName', file.name)
      }

      try {
        const patientData = {
          ...values,
          userId: user.$id,
          birthDat: new Date(values.birthDate),
          identificationDocument: formData,
        }

        const patient = await registerPatient(patientData)
        if (patient) router.push(`/patient/${user.$id}/new-appointment`)
      } catch (error) {
        console.log(error)
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
            <SelectItem
              key={doctor.name}
              value={doctor.name}
              className="cursor-pointer hover:bg-gray-700"
            >
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
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Input}
            label="Insurance Provider"
            name="insuranceProvider"
            placeholder="BlueCross BlueShield"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Input}
            label="Insurance Policy Number"
            name="insurancePolicyNumber"
            placeholder="ABC123456789"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Textarea}
            label="Allergies (if any)"
            name="allergies"
            placeholder="Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Textarea}
            label="Current Medications (if any)"
            name="currentMedications"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Textarea}
            label="Family Medical History"
            name="familyMedicalHistory"
            placeholder="Mother is healthy"
          />
          <CustomFormField
            control={form.control}
            type={FormFieldTypes.Textarea}
            label="Past Medical History"
            name="pastMedicalHistory"
            placeholder="Appendectomy, Tonsillectomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Identification and Verification</h2>
        </section>

        <CustomFormField
          control={form.control}
          type={FormFieldTypes.Select}
          label="Identification type"
          name="identificationType"
          placeholder="Select an identification type"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem
              key={type}
              value={type}
              className="cursor-pointer hover:bg-gray-700"
            >
              {type}
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          type={FormFieldTypes.Input}
          label="Identification number"
          name="identificationNumber"
          placeholder="123456789"
        />
        <CustomFormField
          control={form.control}
          type={FormFieldTypes.Skeleton}
          label="Scanned copy of identification document"
          name="identificationDocument"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1"></div>
          <h2 className="sub-header">Consent and Privacy</h2>
        </section>
        <CustomFormField
          type={FormFieldTypes.Checkbox}
          control={form.control}
          name="treatmentConsent"
          label="I consent to treatment"
        />
        <CustomFormField
          type={FormFieldTypes.Checkbox}
          control={form.control}
          name="disclosureConsent"
          label="I consent to disclosure of information"
        />
        <CustomFormField
          type={FormFieldTypes.Checkbox}
          control={form.control}
          name="privacyConsent"
          label="I acknowledge the privacy policy"
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
