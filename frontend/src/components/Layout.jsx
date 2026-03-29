import { useState } from 'react'
import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen flex bg-transparent">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="flex-1 min-h-screen lg:ml-64">
                <header className="sticky top-0 z-30 flex items-center justify-between border-b border-gray-800 bg-gray-950/90 px-4 py-3 backdrop-blur lg:hidden">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700 bg-gray-900 text-gray-200"
                        aria-label="Open navigation"
                    >
                        ☰
                    </button>
                    <p className="text-base font-semibold text-white">PayU</p>
                    <div className="h-10 w-10" />
                </header>

                <div className="px-4 py-5 sm:px-6 sm:py-6 lg:p-8">
                    <div className="mx-auto w-full max-w-5xl page-enter">
                    {children}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Layout
