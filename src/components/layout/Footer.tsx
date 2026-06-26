export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-neutral-100 py-8 px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400 font-sans">
            <div>
                <p>© {new Date().getFullYear()} Aksharasethu. Developed for NSS Model Engineering College.</p>
            </div>
            <div className="flex items-center gap-6">
                <span className="hover:text-neutral-600 cursor-pointer transition-colors">Platform Terms</span>
                <span className="hover:text-neutral-600 cursor-pointer transition-colors">Open Source Policy</span>
            </div>
        </footer>
    )
}