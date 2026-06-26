import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import '@/app/globals.css'
import { cn } from '@/lib/utils'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
    title: 'Aksharasethu | Digital Library NSS MEC',
    description: 'The official digital archive and academic repository of NSS Model Engineering College.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className={cn("selection:bg-neutral-200/60 selection:text-neutral-900", "font-sans", geist.variable)}>
            <body className={`${geist.variable} font-sans antialiased bg-[#fafafa] text-neutral-900 min-h-screen flex flex-col`}>
                <Navbar />
                <div className="grow">
                    {children}
                </div>
                <Footer />
                <Toaster richColors position="top-right" />
            </body>
        </html>
    )
}