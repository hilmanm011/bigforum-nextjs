import FormInput from "@/components/common/form-input";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { FormEvent } from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export default function FormUser<T extends FieldValues>({
  form,
  onSubmit,
  isLoading,
  type,
}: {
  form: UseFormReturn<T>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  type: "Create" | "Update";
}) {
  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <DialogHeader>
          <DialogTitle>
            {type === "Create" ? "Create an account" : "Update account"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormInput
            form={form}
            type="text"
            name={"firstName" as Path<T>}
            label="First name"
            placeholder="Enter fisrt name here"
          />
          <FormInput
            form={form}
            type="text"
            name={"lastName" as Path<T>}
            label="Last name"
            placeholder="Enter last name here"
          />
          <FormInput
            form={form}
            type="email"
            name={"email" as Path<T>}
            label="Email"
            placeholder="Enter email here"
          />

          {type === "Create" && (
            <FormInput
              form={form}
              type="password"
              name={"password" as Path<T>}
              label="Password"
              placeholder="******"
            />
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">
              {isLoading ? (
                <Loader2 className="animate-spin" />
              ) : type === "Create" ? (
                "Save"
              ) : (
                "Edit"
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
