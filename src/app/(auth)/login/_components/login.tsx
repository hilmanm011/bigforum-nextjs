"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useAuthStore } from "@/store/auth-store";
import { loginApi } from "@/lib/api/auth-api";
import FormInput from "@/components/common/form-input";
import { Mail, Key, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LoginInput, loginSchema } from "@/validations/auth-schema";
import { INITIAL_LOGIN_FORM } from "@/constants/auth-constant";

export default function Login() {
  const setAuth = useAuthStore((state) => state.setAuth);

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: INITIAL_LOGIN_FORM,
  });

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (result) => {
      toast.success("Login success");

      setAuth({ user: result?.data?.user, token: result.data.token });
      window.location.href = "/home";
    },
    onError: (error) => {
      toast.error("Login failed", { description: error?.message });
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    loginMutation.mutate(data);
  });

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Left: Illustration */}
      <div className="hidden md:flex w-1/2 items-center justify-center">
        <Image
          src="/assets/login-illustration.png"
          alt="Login Illustration"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>

      {/* Right: Login Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-8">
        <div className="w-full max-w-xl flex flex-col bg-white rounded-xl shadow-md p-8 h-full">
          {/* Header */}
          <h1 className="text-lg text-black mb-6">
            Welcome to <br />
            <span className="text-primary uppercase text-2xl font-extrabold">
              BIGFORUM
            </span>
          </h1>

          <div className="my-auto">
            {/* Form */}
            <Form {...form}>
              <form onSubmit={onSubmit} className="space-y-6">
                {/* Email */}
                <FormInput
                  form={form}
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                  icon={<Mail className="w-5 h-5" />}
                />

                {/* Password */}
                <FormInput
                  form={form}
                  name="password"
                  placeholder="Enter your password"
                  type="password"
                  icon={<Key className="w-5 h-5" />}
                />

                {/* Remember Me + Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center space-x-2">
                    <Checkbox {...form.register("remember")} />
                    <span className="text-gray-600">Remember me</span>
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-primary hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Button */}
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  //   disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>
            </Form>

            {/* Extra Links */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don’t have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Register
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
