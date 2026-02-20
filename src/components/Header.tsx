import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getNotifications, getUnreadCount, markAsRead, markAllAsRead } from '../lib/notifications'
import { searchSite } from '../lib/search'

type NavLink = { type: 'link'; to: string; label: string }
type NavDropdown = {
  type: 'dropdown'
  id: string
  label: string
  items: { to: string; label: string }[]
}

const navStructure: (NavLink | NavDropdown)[] = [
  { type: 'link', to: '/', label: 'Ana Sayfa' },
  {
    type: 'dropdown',
    id: 'icerik',
    label: 'İçerik',
    items: [
      { to: '/icerik', label: 'Genel bakış' },
      { to: '/bilgi', label: 'Diyabet Bilgisi' },
      { to: '/makaleler', label: 'Makaleler' },
      { to: '/tarifler', label: 'Tarifler' },
      { to: '/hikayeler', label: 'Hikayeler' },
      { to: '/haberler-duyurular', label: 'Haberler ve Duyurular' },
    ],
  },
  {
    type: 'dropdown',
    id: 'araclar',
    label: 'Araçlar',
    items: [
      { to: '/araclar', label: 'Genel bakış' },
      { to: '/karbonhidrat-sayaci', label: 'KH Sayacı' },
      { to: '/hba1c-tahminleyici', label: 'HbA1c Tahmini' },
      { to: '/olcum-gunlugu', label: 'Ölçüm Günlüğü' },
      { to: '/ilac-hatirlatici', label: 'İlaç Hatırlatıcı' },
      { to: '/gunluk-gorevler', label: 'Günlük Görevler' },
      { to: '/meydan-okumalar', label: 'Meydan Okumalar' },
    ],
  },
  {
    type: 'dropdown',
    id: 'platform',
    label: 'Platform',
    items: [
      { to: '/platform', label: 'Genel bakış' },
      { to: '/doktorlar', label: 'Doktor Bul' },
      { to: '/forum', label: 'Forum' },
      { to: '/mesajlar', label: 'Mesajlar' },
      { to: '/favorilerim', label: 'Favorilerim' },
    ],
  },
  {
    type: 'dropdown',
    id: 'kurumsal',
    label: 'Kurumsal',
    items: [
      { to: '/kurumsal', label: 'Genel bakış' },
      { to: '/bilgi', label: 'Biz Kimiz?' },
      { to: '/sss', label: 'SSS' },
      { to: '/iletisim', label: 'Bize Ulaşın' },
      { to: '/geri-bildirim', label: 'Geri bildirim' },
      { to: '/gizlilik', label: 'Gizlilik' },
      { to: '/kullanim-sartlari', label: 'Kullanım Şartları' },
    ],
  },
]

function isPathInDropdown(path: string, items: { to: string }[]): boolean {
  return items.some((i) => i.to === path || (i.to !== '/' && path.startsWith(i.to + '/')))
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [notifOpen, setNotifOpen] = useState(false)
  const [, setNotifVersion] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const { user } = useAuth()

  const notifications = user ? getNotifications(user.id) : []
  const unreadCount = user ? getUnreadCount(user.id) : 0
  const searchResults = searchQuery.trim().length >= 2 ? searchSite(searchQuery) : []

  useEffect(() => {
    if (!menuOpen) setOpenDropdown(null)
  }, [menuOpen])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node
      if (dropdownRef.current && !dropdownRef.current.contains(target)) setOpenDropdown(null)
      if (notifRef.current && !notifRef.current.contains(target)) setNotifOpen(false)
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200/80 shadow-sm pt-[env(safe-area-inset-top)]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16 md:h-18">
          <Link to="/" className="flex items-center h-full min-h-[44px] min-w-[44px] shrink-0 py-0.5">
            <span className="h-full flex items-center max-w-[200px] sm:max-w-[260px] min-h-0">
              <img
                src="/logo.png"
                alt="Diapal"
                className="max-h-full max-w-full w-auto h-[3.25rem] sm:h-[3.75rem] md:h-[4rem] object-contain object-center"
              />
            </span>
          </Link>

          <nav ref={dropdownRef} className="hidden md:flex items-center gap-1">
            {navStructure.map((item) => {
              if (item.type === 'link') {
                const active = location.pathname === item.to
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-4 py-2 rounded-lg text-sm font-500 transition-colors ${
                      active ? 'bg-diapal-100 text-diapal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              }
              const isOpen = openDropdown === item.id
              const active = isPathInDropdown(location.pathname, item.items)
              return (
                <div key={item.id} className="relative">
                  <button
                    type="button"
                    onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-500 transition-colors ${
                      active ? 'bg-diapal-100 text-diapal-800' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div className="absolute top-full left-0 mt-1 py-1 w-48 rounded-xl border border-slate-200 bg-white shadow-lg z-50">
                      {item.items.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-2.5 text-sm font-500 rounded-lg mx-1 ${
                            location.pathname === sub.to
                              ? 'bg-diapal-100 text-diapal-800'
                              : 'text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Ara"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {user && (
              <div ref={notifRef} className="relative">
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                  aria-label="Bildirimler"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 h-4 min-w-[1rem] px-1 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-700 text-white">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-1 w-80 max-h-[70vh] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50 flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                      <span className="font-700 text-slate-900">Bildirimler</span>
                      {notifications.length > 0 && (
                        <button
                          type="button"
                          onClick={() => { markAllAsRead(user!.id); setNotifVersion((v) => v + 1); setNotifOpen(false) }}
                          className="text-xs font-500 text-diapal-600 hover:underline"
                        >
                          Tümünü okundu işaretle
                        </button>
                      )}
                    </div>
                    <div className="overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-slate-500">Bildirim yok.</p>
                      ) : (
                        notifications.map((n) => (
                          <Link
                            key={n.id}
                            to={n.link}
                            onClick={() => { markAsRead(user!.id, n.id); setNotifVersion((v) => v + 1); setNotifOpen(false) }}
                            className={`block px-4 py-3 hover:bg-slate-50 border-b border-slate-50 ${n.read ? 'opacity-75' : ''}`}
                          >
                            <p className="text-sm font-500 text-slate-900">{n.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</p>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-lg text-sm font-500 transition-colors ${
                      location.pathname === '/admin' ? 'bg-amber-100 text-amber-800' : 'text-amber-700 hover:bg-amber-50'
                    }`}
                  >
                    Yönetim
                  </Link>
                )}
                <Link
                  to="/mesajlar"
                  className="px-4 py-2 rounded-lg text-sm font-500 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  Mesajlar
                </Link>
                <Link
                  to="/profil"
                  className={`px-4 py-2 rounded-lg text-sm font-500 transition-colors ${
                    location.pathname === '/profil'
                      ? 'bg-diapal-100 text-diapal-800'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {user.name}
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/giris"
                  className="px-4 py-2 text-sm font-500 text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Giriş Yap
                </Link>
                <Link
                  to="/kayit"
                  className="px-4 py-2.5 rounded-xl bg-diapal-600 text-white text-sm font-600 hover:bg-diapal-700 transition-colors shadow-sm"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-3 -m-2 rounded-xl text-slate-600 hover:bg-slate-100 active:bg-slate-200 touch-manipulation"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'}
            aria-expanded={menuOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Arama modal */}
        {searchOpen && (
          <div className="fixed inset-0 z-[100] bg-black/40 flex items-start justify-center pt-[10vh] px-4" onClick={() => setSearchOpen(false)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[70vh] flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 p-3 border-b border-slate-200">
                <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="search"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Makale, forum, SSS ara..."
                  className="flex-1 py-2 text-sm outline-none"
                />
                <button type="button" onClick={() => setSearchOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">✕</button>
              </div>
              <div className="overflow-y-auto p-2">
                {searchQuery.trim().length < 2 ? (
                  <p className="p-4 text-sm text-slate-500">En az 2 karakter yazın.</p>
                ) : searchResults.length === 0 ? (
                  <p className="p-4 text-sm text-slate-500">Sonuç bulunamadı.</p>
                ) : (
                  searchResults.map((r) => (
                    <Link
                      key={`${r.type}-${r.id}`}
                      to={r.url}
                      onClick={() => setSearchOpen(false)}
                      className="block px-3 py-2.5 rounded-lg hover:bg-slate-50 text-left"
                    >
                      <span className={`text-[10px] font-600 uppercase ${r.type === 'makale' ? 'text-sky-600' : r.type === 'forum' ? 'text-diapal-600' : 'text-amber-600'}`}>
                        {r.type === 'makale' ? 'Makale' : r.type === 'forum' ? 'Forum' : 'SSS'}
                      </span>
                      <p className="text-sm font-500 text-slate-900 mt-0.5">{r.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{r.excerpt}</p>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {menuOpen && (
          <div className="md:hidden py-3 border-t border-slate-200 space-y-0.5 pb-4">
            <button
              type="button"
              onClick={() => { setSearchOpen(true); setMenuOpen(false) }}
              className="flex items-center gap-3 min-h-[48px] px-4 py-3 rounded-xl text-slate-600 w-full text-left"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Ara
            </button>
            {navStructure.map((item) => {
              if (item.type === 'link') {
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center min-h-[48px] px-4 py-3 rounded-xl text-base font-500 touch-manipulation ${
                      location.pathname === item.to ? 'bg-diapal-100 text-diapal-800' : 'text-slate-600 active:bg-slate-100'
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              }
              return (
                <MobileDropdown
                  key={item.id}
                  label={item.label}
                  items={item.items}
                  location={location}
                  onNavigate={() => setMenuOpen(false)}
                />
              )
            })}
            <div className="pt-3 mt-3 border-t border-slate-200 flex flex-wrap gap-3">
              {user ? (
                <>
                  <Link
                    to="/mesajlar"
                    className="flex-1 min-w-[120px] flex items-center justify-center min-h-[48px] rounded-xl border border-slate-200 text-base font-500 touch-manipulation active:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mesajlar
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="flex-1 min-w-[120px] flex items-center justify-center min-h-[48px] rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-base font-600 touch-manipulation"
                      onClick={() => setMenuOpen(false)}
                    >
                      Yönetim
                    </Link>
                  )}
                  <Link
                    to="/profil"
                    className="flex-1 min-w-[120px] flex items-center justify-center min-h-[48px] rounded-xl bg-diapal-100 text-diapal-800 text-base font-600 touch-manipulation"
                    onClick={() => setMenuOpen(false)}
                  >
                    {user.name}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/giris"
                    className="flex-1 flex items-center justify-center min-h-[48px] rounded-xl border border-slate-200 text-base font-500 touch-manipulation active:bg-slate-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    className="flex-1 flex items-center justify-center min-h-[48px] rounded-xl bg-diapal-600 text-white text-base font-600 touch-manipulation active:bg-diapal-700"
                    onClick={() => setMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

function MobileDropdown({
  label,
  items,
  location,
  onNavigate,
}: {
  label: string
  items: { to: string; label: string }[]
  location: { pathname: string }
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const active = items.some((i) => location.pathname === i.to || (i.to !== '/' && location.pathname.startsWith(i.to + '/')))

  return (
    <div className="rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`flex items-center justify-between w-full min-h-[48px] px-4 py-3 text-base font-500 touch-manipulation ${
          active ? 'bg-diapal-100 text-diapal-800' : 'text-slate-600 active:bg-slate-100'
        }`}
      >
        {label}
        <svg
          className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {expanded && (
        <div className="bg-slate-50/80 border-t border-slate-100">
          {items.map((sub) => (
            <Link
              key={sub.to}
              to={sub.to}
              onClick={onNavigate}
              className={`flex items-center min-h-[44px] pl-6 pr-4 py-2.5 text-sm font-500 ${
                location.pathname === sub.to ? 'text-diapal-700' : 'text-slate-600'
              } active:bg-slate-100`}
            >
              {sub.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
