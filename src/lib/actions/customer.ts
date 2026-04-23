"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
}) {
  const session = await getServerSession();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const updatedCustomer = await prisma.customer.update({
      where: { supabaseUid: userId },
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        phone: formData.phone,
      },
    });

    revalidatePath("/account/profile");
    return { success: true, customer: updatedCustomer };
  } catch (error: any) {
    console.error("Profile update error:", error);
    if (error.code === "P2002") {
      return { success: false, error: "Username already taken." };
    }
    return { success: false, error: "Failed to update profile." };
  }
}
