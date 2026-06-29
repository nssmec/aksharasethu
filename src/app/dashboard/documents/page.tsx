import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminSidebar from "@/components/admin/AdminSidebar";
import { approveDocument, rejectDocument } from "@/actions/admin-documents";

export default async function PendingDocumentsPage() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/login");
    }

    const admin = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            role: true,
        },
    });

    if (admin?.role !== "ADMIN") {
        redirect("/");
    }

    const documents = await prisma.document.findMany({
        where: {
            status: "PENDING",
        },
        include: {
            uploader: true,
            category: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div className="flex min-h-screen bg-neutral-50">
            <AdminSidebar />

            <main className="flex-1 p-10">

                <div className="mb-10">
                    <h1 className="text-4xl font-bold">
                        Pending Documents
                    </h1>

                    <p className="mt-2 text-neutral-500">
                        Review and approve submitted resources.
                    </p>
                </div>

                <div className="space-y-5">

                    {documents.length === 0 && (
                        <div className="rounded-2xl border bg-white p-10 text-center text-neutral-500">
                            No pending documents.
                        </div>
                    )}

                    {documents.map((document) => (
                        <div
                            key={document.id}
                            className="rounded-2xl border bg-white p-6 shadow-sm"
                        >

                            <div className="flex items-start justify-between">

                                <div className="space-y-2">

                                    <h2 className="text-xl font-semibold">
                                        {document.title}
                                    </h2>

                                    <p className="text-sm text-neutral-500">
                                        {document.author}
                                    </p>

                                    <p className="text-sm text-neutral-500">
                                        Category:
                                        <span className="font-medium ml-2">
                                            {document.category.name}
                                        </span>
                                    </p>

                                    {document.departments.length > 0 && (
                                        <div className="flex flex-wrap gap-2">

                                            {document.departments.map((dept) => (
                                                <span
                                                    key={dept}
                                                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs"
                                                >
                                                    {dept}
                                                </span>
                                            ))}

                                        </div>
                                    )}

                                    {(document.semester || document.subject) && (
                                        <div className="text-sm text-neutral-500">

                                            {document.semester}

                                            {document.semester &&
                                                document.subject &&
                                                " • "}

                                            {document.subject}

                                        </div>
                                    )}

                                    <div className="text-xs text-neutral-400">

                                        Uploaded by{" "}

                                        <span className="font-medium">
                                            {document.uploader.name}
                                        </span>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <a
                                        href={document.driveLink}
                                        target="_blank"
                                        className="rounded-lg border px-4 py-2 text-sm hover:bg-neutral-100"
                                    >
                                        Preview
                                    </a>

                                    <form
                                        action={async () => {
                                            "use server";
                                            await approveDocument(document.id);
                                        }}
                                    >
                                        <button
                                            className="rounded-lg bg-green-600 px-5 py-2 text-white hover:bg-green-700"
                                        >
                                            Approve
                                        </button>
                                    </form>

                                    <form
                                        action={async () => {
                                            "use server";
                                            await rejectDocument(document.id);
                                        }}
                                    >
                                        <button
                                            className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700"
                                        >
                                            Reject
                                        </button>
                                    </form>

                                </div>

                            </div>

                        </div>
                    ))}

                </div>

            </main>
        </div>
    );
}