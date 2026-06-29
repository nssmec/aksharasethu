import type { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export default async function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    if (session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-neutral-50">
            {children}
        </div>
    );
}