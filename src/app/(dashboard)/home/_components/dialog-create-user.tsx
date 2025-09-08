import { INITIAL_REGISTER_FORM } from "@/constants/auth-constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormUser from "./form-user";
import { RegisterInput, registerSchema } from "@/validations/auth-schema";
import { useState } from "react";
import { createUser } from "@/lib/api/user-api";
import { useAuthStore } from "@/store/auth-store";

export default function DialogCreateUser({ refetch }: { refetch: () => void }) {
  const token = useAuthStore((state) => state.token);
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: INITIAL_REGISTER_FORM,
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      setIsLoading(true);

      await createUser(token, data);

      toast.success("Create Account Success");
      form.reset();
      document.querySelector<HTMLButtonElement>('[data-state="open"]')?.click();
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Create Account Failed";
      toast.error("Create User Failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <FormUser
      form={form}
      onSubmit={onSubmit}
      isLoading={isLoading}
      type="Create"
    />
  );
}
