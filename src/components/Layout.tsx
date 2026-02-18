import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import DiapalAsistan from './DiapalAsistan'
import GunlukGorevlerWidget from './GunlukGorevlerWidget'

export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      <main className="flex-1 pb-[env(safe-area-inset-bottom)]">
        <Outlet />
      </main>
      <Footer />
      <GunlukGorevlerWidget />
      <DiapalAsistan />
    </div>
  )
}
