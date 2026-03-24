import Sidebar from './Sidebar'

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-8 min-h-screen">
                <div className="max-w-4xl mx-auto page-enter">
                    {children}
                </div>
            </main>
        </div>
    )
}

export default Layout
