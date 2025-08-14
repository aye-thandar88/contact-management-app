import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DatePicker from "react-datepicker";
import Select from "react-select";
import "react-datepicker/dist/react-datepicker.css";
import type { Contact } from "../types/contact";
import Button from "./Button";
import { getTodayDate } from "../utils/formatDate";
import { roles } from "../constants/roles";
import { InputField } from "./InputField";

const schema = z.object({
  firstName: z.string().min(1, "First Name is required."),
  lastName: z.string().min(1, "Last Name is required."),
  email: z.string().email().min(1, "Email is required."),
  role: z.string().min(1, "Role is required."),
  gender: z.string().min(1),
  isActive: z.boolean(),
  newsletter: z.boolean(),
  birthDate: z.string().min(1, "Birth date is required."),
});

type FormSchema = z.infer<typeof schema>;

const initialValue = {
  firstName: "",
  lastName: "",
  email: "",
  role: "",
  gender: "Other",
  isActive: false,
  newsletter: false,
  birthDate: getTodayDate(),
};

export default function ContactFormModal({
  open,
  onClose,
  initial,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  initial?: Contact;
  onSubmit: (data: FormSchema) => void;
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: initialValue,
  });

  useEffect(() => {
    if (initial) reset({ ...initial, birthDate: initial.birthDate });
    else reset(initialValue);
  }, [open, initial, reset]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 max-w-2xl">
        <h3 className="text-xl mb-4">{initial ? "Edit" : "Create"} Contact</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="First Name"
              requiredStar
              {...register("firstName")}
              error={errors.firstName}
            />
            <InputField
              label="Last Name"
              requiredStar
              {...register("lastName")}
              error={errors.lastName}
            />
          </div>

          <InputField
            label="Email"
            requiredStar
            {...register("email")}
            error={errors.email}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block mb-1">
                Role <span className="required-star">*</span>
              </label>
              <Controller
                control={control}
                name="role"
                render={({ field }) => {
                  return (
                    <Select
                      {...register("role")}
                      value={
                        roles.find((opt) => opt.value === field.value) || null
                      }
                      options={roles}
                      onChange={(val) => {
                        field.onChange((val as any).value);
                      }}
                      className="w-full"
                    />
                  );
                }}
              />
              {errors.role && (
                <p className="text-red-600 text-sm">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block mb-1">Gender</label>
              <div className="flex flex-wrap gap-3">
                {["Male", "Female", "Other"].map((g) => (
                  <label key={g} className="flex items-center gap-1">
                    <input {...register("gender")} type="radio" value={g} />
                    {g}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 grid-cols-2 gap-6">
            <div className="w-full">
              <label className="block mb-1">
                Birth Date <span className="required-star">*</span>
              </label>
              <Controller
                control={control}
                name="birthDate"
                render={({ field }) => (
                  <DatePicker
                    selected={field.value ? new Date(field.value) : null}
                    onChange={(d) =>
                      field.onChange(d ? d.toISOString().slice(0, 10) : "")
                    }
                    className="border p-2 rounded-md w-full focus:border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                )}
              />
              {errors.birthDate && (
                <p className="text-red-600 text-sm">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <label className="flex items-center gap-2">Active</label>
              <input type="checkbox" {...register("isActive")} />

              <label className="flex items-center gap-2">Newsletter</label>
              <input type="checkbox" {...register("newsletter")} />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Save
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
