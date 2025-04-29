import { User, FormResponse } from "@/types/form";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

if (!BASE_URL) {
  console.error("Error: NEXT_PUBLIC_API_BASE_URL is not defined!");
}

export const createUser = async (
  userData: User
): Promise<{ success: boolean; message?: string }> => {
  if (!BASE_URL) return { success: false, message: "API URL not configured" };
  try {
    const response = await fetch(`${BASE_URL}/create-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || `HTTP error! status: ${response.status}`,
      };
    }

    return {
      success: true,
      message: data?.message || "User created successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Create user failed:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};

export const getForm = async (rollNumber: string): Promise<FormResponse> => {
  if (!BASE_URL) throw new Error("API URL not configured");
  try {
    const response = await fetch(
      `${BASE_URL}/get-form?rollNumber=${encodeURIComponent(rollNumber)}`,
      {
        method: "GET",
        headers: {},
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData?.message || `HTTP error! status: ${response.status}`
      );
    }

    const data: FormResponse = await response.json();
    return data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Get form failed:", error);
    throw new Error(error.message || "Failed to fetch form structure");
  }
};
