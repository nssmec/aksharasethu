import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { UserRole } from "@/generated/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateUserRole } from "@/actions/admin-users";
import Image from "next/image";

export default async function UsersPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const currentUser = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            role: true,
        },
    });

    if (currentUser?.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
        },
    });

    return (
        <div className="space-y-8">

            <div>
                <h1 className="text-3xl font-bold tracking-tight">
                    User Management
                </h1>

                <p className="mt-2 text-sm text-neutral-500">
                    Manage student, volunteer and administrator accounts.
                </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">

                <table className="w-full">

                    <thead className="border-b bg-neutral-50">

                        <tr className="text-left">

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                User
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Email
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Role
                            </th>

                            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Joined
                            </th>

                            <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y divide-neutral-100">

                        {users.map((user) => (
                            <tr key={user.id}>

                                <td className="px-6 py-5">

                                    <div className="flex items-center gap-3">

                                        <Image
                                            src={user.image ?? "/default-avatar.png"}
                                            alt={user.name}
                                            className="h-10 w-10 rounded-full border object-cover"
                                            width={40}
                                            height={40}
                                        />

                                        <div>

                                            <p className="font-medium">
                                                {user.name}
                                            </p>

                                            {user.id === session.user.id && (
                                                <p className="text-xs text-neutral-500">
                                                    You
                                                </p>
                                            )}

                                        </div>

                                    </div>

                                </td>

                                <td className="px-6 py-5 text-sm text-neutral-600">
                                    {user.email}
                                </td>

                                <td className="px-6 py-5">

                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium
                                        ${user.role === "ADMIN"
                                                ? "bg-red-100 text-red-700"
                                                : user.role === "VOLUNTEER"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-neutral-100 text-neutral-700"
                                            }`}
                                    >
                                        {user.role}
                                    </span>

                                </td>

                                <td className="px-6 py-5 text-sm text-neutral-500">
                                    {user.createdAt.toLocaleDateString()}
                                </td>

                                <td className="px-6 py-5">

                                    {user.id !== session.user.id && (
                                        <form
                                            action={async (formData) => {
                                                "use server";

                                                await updateUserRole(formData);
                                            }}
                                            className="flex justify-end"
                                        >
                                            <input
                                                type="hidden"
                                                name="userId"
                                                value={user.id}
                                            />

                                            <select
                                                name="role"
                                                defaultValue={user.role}
                                                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm"
                                            >
                                                {Object.values(UserRole).map((role) => (
                                                    <option
                                                        key={role}
                                                        value={role}
                                                    >
                                                        {role}
                                                    </option>
                                                ))}
                                            </select>

                                            <button
                                                type="submit"
                                                className="ml-3 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                                            >
                                                Save
                                            </button>

                                        </form>
                                    )}

                                </td>

                            </tr>
                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}