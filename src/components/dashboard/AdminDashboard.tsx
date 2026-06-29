import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
    BookOpen,
    Clock3,
    Users,
    UserCheck,
    ArrowRight,
} from "lucide-react";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminDashboard() {
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
        select: {
            role: true,
        },
    });

    if (user?.role !== "ADMIN") {
        redirect("/");
    }

    const [
        totalUsers,
        volunteers,
        pendingDocuments,
        approvedDocuments,
        recentDocuments,
    ] = await Promise.all([
        prisma.user.count(),

        prisma.user.count({
            where: {
                role: "VOLUNTEER",
            },
        }),

        prisma.document.count({
            where: {
                status: "PENDING",
            },
        }),

        prisma.document.count({
            where: {
                status: "APPROVED",
            },
        }),

        prisma.document.findMany({
            where: {
                status: "PENDING",
            },
            take: 5,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                uploader: true,
                category: true,
            },
        }),
    ]);

    return (
        <div className="flex">
            <AdminSidebar />

            <main className="flex-1 p-10 bg-neutral-50 min-h-screen">

                <div className="mb-10">
                    <h1 className="text-4xl font-bold tracking-tight">
                        Dashboard
                    </h1>

                    <p className="text-neutral-500 mt-2">
                        Manage uploads, users and the digital library.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mb-10">

                    <StatCard
                        title="Pending Documents"
                        value={pendingDocuments}
                        icon={<Clock3 className="w-6 h-6" />}
                    />

                    <StatCard
                        title="Approved Documents"
                        value={approvedDocuments}
                        icon={<BookOpen className="w-6 h-6" />}
                    />

                    <StatCard
                        title="Users"
                        value={totalUsers}
                        icon={<Users className="w-6 h-6" />}
                    />

                    <StatCard
                        title="Volunteers"
                        value={volunteers}
                        icon={<UserCheck className="w-6 h-6" />}
                    />

                </div>

                <section className="rounded-2xl border bg-white shadow-sm">

                    <div className="flex items-center justify-between p-6 border-b">

                        <div>
                            <h2 className="text-lg font-semibold">
                                Pending Uploads
                            </h2>

                            <p className="text-sm text-neutral-500">
                                Awaiting review
                            </p>
                        </div>

                        <Link
                            href="/dashboard/documents"
                            className="flex items-center gap-2 text-sm font-medium hover:text-black"
                        >
                            View All

                            <ArrowRight className="w-4 h-4" />
                        </Link>

                    </div>

                    <div className="divide-y">

                        {recentDocuments.length === 0 && (
                            <div className="p-8 text-center text-neutral-500">
                                No pending uploads.
                            </div>
                        )}

                        {recentDocuments.map((document) => (
                            <div
                                key={document.id}
                                className="flex items-center justify-between p-6"
                            >
                                <div>

                                    <h3 className="font-medium">
                                        {document.title}
                                    </h3>

                                    <p className="text-sm text-neutral-500 mt-1">
                                        {document.category.name}
                                    </p>

                                    <p className="text-xs text-neutral-400 mt-1">
                                        Uploaded by {document.uploader.name}
                                    </p>

                                </div>

                                <Link
                                    href="/dashboard/documents"
                                    className="rounded-lg bg-neutral-900 px-4 py-2 text-white text-sm hover:bg-neutral-800"
                                >
                                    Review
                                </Link>

                            </div>
                        ))}

                    </div>

                </section>

            </main>
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: React.ReactNode;
}) {
    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm text-neutral-500">
                        {title}
                    </p>

                    <h3 className="mt-3 text-3xl font-bold">
                        {value}
                    </h3>

                </div>

                <div className="rounded-xl bg-neutral-100 p-3">
                    {icon}
                </div>

            </div>

        </div>
    );
}