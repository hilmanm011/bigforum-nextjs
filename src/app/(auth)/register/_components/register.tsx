"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { registerApi } from "@/lib/api/auth-api";
import { registerSchema, RegisterInput } from "@/validations/auth-schema";
import FormInput from "@/components/common/form-input";
import { INITIAL_REGISTER_FORM } from "@/constants/auth-constant";
import { Form } from "@/components/ui/form";
import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function Register() {
  const [isAgree, setIsAgree] = useState(false);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: INITIAL_REGISTER_FORM,
  });

  const registerMutation = useMutation({
    mutationFn: registerApi,
    onSuccess: () => {
      toast.success("Register success");
      window.location.href = "/login";
    },
    onError: (error) => {
      toast.error("Register failed", { description: error?.message });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Left Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <Image
          src="/assets/register-illustration.png"
          alt="Register Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      {/* Register Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-xl flex flex-col bg-white rounded-xl shadow-md p-8 h-full">
          <h1 className="text-lg text-black mb-6 font-semibold">
            Create an account
          </h1>

          <Form {...form}>
            <form onSubmit={onSubmit} className="space-y-5">
              {/* Firstname */}
              <FormInput
                form={form}
                name="firstName"
                label="First Name"
                placeholder="Enter your first name"
              />

              {/* Lastname */}
              <FormInput
                form={form}
                name="lastName"
                label="Last Name"
                placeholder="Enter your last name"
              />

              {/* Email */}
              <FormInput
                form={form}
                name="email"
                label="Email"
                placeholder="Enter your email"
                type="email"
              />

              {/* Password */}
              <FormInput
                form={form}
                name="password"
                label="Password"
                placeholder="Enter your password"
                type="password"
              ></FormInput>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={isAgree}
                  onCheckedChange={(checked) => setIsAgree(!!checked)}
                />
                <Label
                  htmlFor="terms"
                  className="text-xs text-gray-600 flex items-start"
                >
                  By creating an account, I agree to our{" "}
                  <a href="#" className="text-gray-800 hover:underline">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-gray-800 hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                disabled={!isAgree}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>

          {/* Extra Links */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
