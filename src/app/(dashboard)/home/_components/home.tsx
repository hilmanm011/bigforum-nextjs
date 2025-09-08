"use client";

import DataTable from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { HEADER_TABLE_USER } from "@/constants/user-constant";
import useDataTable from "@/hooks/use-datatable";
import { useQuery } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { getUsers } from "@/lib/api/user-api";
import { useAuthStore } from "@/store/auth-store";
import { User } from "@/types/auth";
import DialogCreateUser from "./dialog-create-user";
import DialogUpdateUser from "./dialog-update-user";
import DialogDeleteUser from "./dialog-delete-user";

export default function Home() {
  const initAuthFromStorage = useAuthStore(
    (state) => state.initAuthFromStorage
  );
  const token = useAuthStore((state) => state.token);

  const {
    currentPage,
    currentLimit,
    currentSearch,
    handleChangePage,
    handleChangeLimit,
    handleChangeSearch,
  } = useDataTable();

  // Query users
  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", token, currentPage, currentLimit, currentSearch],
    queryFn: async () => {
      if (!token) {
        toast.error("User not authenticated");
        return { data: [], count: 0 };
      }

      try {
        const res = await getUsers(
          token,
          currentPage,
          currentLimit,
          currentSearch
        );

        return res;
      } catch (error) {
        let errorMessage = "Failed to fetch users";

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        toast.error("Failed to fetch users", { description: errorMessage });
        return { data: [], count: 0 };
      }
    },
  });

  const [selectedAction, setSelectedAction] = useState<{
    data: User;
    type: "update" | "delete";
  } | null>(null);

  const handleChangeAction = (open: boolean) => {
    if (!open) setSelectedAction(null);
  };

  // Mapping data ke table
  const filteredData = useMemo(() => {
    return (users?.data || []).map((user: User, index: number) => {
      return [
        currentLimit * (currentPage - 1) + index + 1,
        `${user.firstName} ${user.lastName}`,
        user.email,
        // Action buttons
        <div className="flex gap-2" key={index}>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedAction({ data: user, type: "update" })}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => setSelectedAction({ data: user, type: "delete" })}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>,
      ];
    });
  }, [users, currentPage, currentLimit]);

  const totalPages = useMemo(() => {
    return users && users.count !== null
      ? Math.ceil(users.count / currentLimit)
      : 0;
  }, [users, currentLimit]);

  useEffect(() => {
    initAuthFromStorage();
  }, []);

  return (
    <div className="w-full">
      {/* Header + Search + Create */}
      <div className="flex flex-col lg:flex-row mb-4 gap-2 justify-between w-full">
        <h1 className="text-2xl font-bold">User List</h1>
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            onChange={(e) => handleChangeSearch(e.target.value)}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary text-white">Add User</Button>
            </DialogTrigger>
            <DialogCreateUser refetch={refetch} />
          </Dialog>
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        header={HEADER_TABLE_USER}
        isLoading={isLoading}
        data={filteredData}
        totalPages={totalPages}
        currentPage={currentPage}
        currentLimit={currentLimit}
        onChangePage={handleChangePage}
        onChangeLimit={handleChangeLimit}
      />

      {/* Dialog untuk Update / Delete */}
      <DialogUpdateUser
        open={selectedAction?.type === "update"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
      <DialogDeleteUser
        open={selectedAction?.type === "delete"}
        refetch={refetch}
        currentData={selectedAction?.data}
        handleChangeAction={handleChangeAction}
      />
    </div>
  );
}
