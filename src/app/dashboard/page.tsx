import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user) {
        redirect("/login");
    }

    switch (user.role) {
        case "ADMIN":
            return <AdminDashboard />;

        default:
            redirect("/");
    }
}