import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/sonner'
import '@/app/globals.css'
import { cn } from '@/lib/utils'

const geist = Geist({
    subsets: ['latin'],
    variable: '--font-sans',
})

export const metadata: Metadata = {
    metadataBase: new URL('https://aksharasethu.vercel.app'),

    title: {
        default: 'Aksharasethu | Digital Library NSS MEC',
        template: '%s | Aksharasethu',
    },

    description:
        'The official digital archive and academic repository of NSS Model Engineering College.',

    applicationName: 'Aksharasethu',

    keywords: [
        'Aksharasethu',
        'NSS MEC',
        'Model Engineering College',
        'Digital Library',
        'Academic Repository',
        'Books',
        'Notes',
        'KTU',
    ],

    authors: [
        {
            name: 'NSS Model Engineering College',
        },
    ],

    creator: 'NSS Model Engineering College',

    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/logo.png', type: 'image/png' },
        ],
        shortcut: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },

    openGraph: {
        title: 'Aksharasethu | Digital Library NSS MEC',
        description:
            'The official digital archive and academic repository of NSS Model Engineering College.',
        url: 'https://aksharasethu.vercel.app',
        siteName: 'Aksharasethu',
        locale: 'en_IN',
        type: 'website',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Aksharasethu Digital Library',
            },
        ],
    },

    twitter: {
        card: 'summary_large_image',
        title: 'Aksharasethu | Digital Library NSS MEC',
        description:
            'The official digital archive and academic repository of NSS Model Engineering College.',
        images: ['/og-image.png'],
    },
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html
            lang="en"
            className={cn(
                'selection:bg-neutral-200/60 selection:text-neutral-900',
                'font-sans',
                geist.variable
            )}
        >
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