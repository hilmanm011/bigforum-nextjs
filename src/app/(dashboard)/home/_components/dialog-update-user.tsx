import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import FormUser from "./form-user";
import { useEffect, useState } from "react";
import { updateUser } from "@/lib/api/user-api";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import { Dialog } from "@/components/ui/dialog";
import { UserInput, userSchema } from "@/validations/user-schema";
import { INITIAL_USER_FORM } from "@/constants/user-constant";

export default function DialogUpdateUser({
  refetch,
  currentData,
  open,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: User;
  open?: boolean;
  handleChangeAction?: (open: boolean) => void;
}) {
  const token = useAuthStore((state) => state.token);
  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: INITIAL_USER_FORM,
  });

  const [isLoading, setIsLoading] = useState(false);

  // Prefill form saat currentData berubah
  useEffect(() => {
    if (currentData) {
      form.setValue("firstName", currentData.firstName as string);
      form.setValue("lastName", currentData.lastName as string);
      form.setValue("email", currentData.email as string);
    }
  }, [currentData]);

  const onSubmit = form.handleSubmit(async (data) => {
    if (!currentData?.id) {
      toast.error("User ID is missing");
      return;
    }

    try {
      setIsLoading(true);

      await updateUser(currentData?.id ?? "", token, data);

      toast.success("Update User Success");

      // Tutup dialog
      handleChangeAction?.(false);

      // Refetch data
      refetch();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Update User Failed";
      toast.error("Update User Failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Dialog open={open} onOpenChange={handleChangeAction}>
      <FormUser
        form={form}
        onSubmit={onSubmit}
        isLoading={isLoading}
        type="Update"
      />
    </Dialog>
  );
}
