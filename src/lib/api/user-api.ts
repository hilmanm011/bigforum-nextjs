import { RegisterInput } from "@/validations/auth-schema";
import { UserInput } from "@/validations/user-schema";

export async function getUsers(
  token: string | null,
  currentPage: number,
  currentLimit: number,
  currentSearch: string
) {
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/users?page=${currentPage}&limit=${currentLimit}&search=${currentSearch}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch users");
  }

  return res.json();
  // akan mengembalikan: { data: User[], count: number, page: number, totalPages: number }
}

// Create New User Account
export async function createUser(token: string | null, data: RegisterInput) {
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to create an account");
  }

  return res.json();
}

// Update User Account
export async function updateUser(
  id: string,
  token: string | null,
  data: UserInput
) {
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to update account");
  }

  return res.json();
}

// Delete User Account
export async function deleteUser(id: string, token: string | null) {
  if (!token) {
    throw new Error("User not authenticated");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to delete account");
  }

  return res.json();
}
