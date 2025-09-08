import DialogDelete from "@/components/common/dialog-delete";
import { User } from "@/types/auth";
import { toast } from "sonner";
import { useState } from "react";
import { deleteUser } from "@/lib/api/user-api"; // pastikan kamu buat API ini
import { useAuthStore } from "@/store/auth-store";

export default function DialogDeleteUser({
  open,
  refetch,
  currentData,
  handleChangeAction,
}: {
  refetch: () => void;
  currentData?: User;
  open: boolean;
  handleChangeAction: (open: boolean) => void;
}) {
  const token = useAuthStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!currentData?.id) {
      toast.error("User ID is missing");
      return;
    }

    try {
      setIsLoading(true);

      await deleteUser(currentData.id, token); // panggil API delete

      toast.success("Delete User Success");

      handleChangeAction(false); // tutup dialog
      refetch(); // refetch data
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Delete User Failed";
      toast.error("Delete User Failed", { description: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogDelete
      open={open}
      onOpenChange={handleChangeAction}
      isLoading={isLoading}
      onSubmit={onSubmit}
      title="User"
    />
  );
}
