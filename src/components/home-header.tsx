import { useEffect, useRef, useState } from 'react'
import { AuthModal } from '@/components/auth-modal'
import { useSession } from '@/hooks/use-session'

const navigationItems = [
  { label: 'Início', href: '#inicio' },
  { label: 'Mercado', href: '#mercado' },
  { label: 'Criadores', href: '#criadores' },
  { label: 'Aprenda', href: '#aprenda' },
]

function getSelectedNavigationHref(activeHref: string) {
  if (window.location.hash) return window.location.hash
  if (window.location.pathname !== '/') return '#mercado'
  return activeHref.startsWith('#') ? activeHref : '#inicio'
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M14.5726 16.0029C10.5755 19.1865 4.988 18.3056 2.02842 14.6542C-0.828088 11.129 -0.64944 6.04347 2.44943 2.82482C5.65137 -0.500594 10.6854 -0.944524 14.3346 1.78337C15.642 2.76051 16.6183 4.00364 17.2542 5.50838C17.8938 7.02186 18.0881 8.59654 17.8663 10.2205C17.6452 11.837 17 13.2775 15.9499 14.6217C16.0349 14.6773 16.1255 14.7173 16.1904 14.7822C17.3448 15.9311 18.4947 17.0843 19.6491 18.2331C19.9227 18.5054 20.0589 18.8225 19.9776 19.2047C19.8165 19.9651 18.9107 20.2586 18.3298 19.7366C18.0575 19.4925 17.807 19.2234 17.5484 18.9649C16.6002 18.0177 15.6526 17.0699 14.7044 16.1227C14.665 16.0853 14.6238 16.0503 14.5726 16.0029ZM15.9605 8.98677C15.9705 5.12689 12.8529 2.00627 8.98261 2.00065C5.12292 1.99503 2.00781 5.09068 1.99094 8.94806C1.97408 12.8173 5.08544 15.9467 8.96762 15.9648C12.8117 15.9829 15.9505 12.8504 15.9605 8.98677Z" fill="#F5F1EB" />
    </svg>
  )
}

function CartIcon() {
  return (
    <svg aria-hidden="true" width="33" height="26" viewBox="0 0 33 26" fill="none">
      <path d="M17.1558 22.25H9.89066C6.78905 22.25 4.26569 19.7267 4.26569 16.6251V10.8595C4.26569 7.9762 2.82861 5.30739 0.421544 3.72031C-0.0107343 3.43531 -0.130077 2.85388 0.154921 2.4216C0.439919 1.98927 1.02131 1.86988 1.45368 2.15497C2.82776 3.06097 3.94254 4.2559 4.73969 5.63167C4.91195 5.82466 6.30104 7.29699 8.57821 7.29699H19.3738C22.3191 7.24191 24.6245 10.1977 23.8544 13.0406L22.6117 17.9939C21.9829 20.4998 19.7394 22.25 17.1558 22.25V22.25ZM5.90415 8.64234C6.06001 9.36238 6.14068 10.1048 6.14068 10.8595V16.6251C6.14068 18.6928 7.82292 20.375 9.89066 20.375H17.1558C18.8782 20.375 20.3739 19.2082 20.793 17.5376L22.0358 12.5844C22.4933 10.8951 21.1233 9.13931 19.3738 9.17198H8.57817C7.54828 9.17198 6.65185 8.94993 5.90415 8.64234V8.64234ZM9.42191 24.8281C9.42191 24.1809 8.89724 23.6563 8.25004 23.6563C6.69511 23.7182 6.69647 25.9387 8.25004 26C8.89724 26 9.42191 25.4753 9.42191 24.8281ZM18.75 24.8281C18.75 24.1809 18.2253 23.6563 17.5781 23.6563C16.0232 23.7182 16.0245 25.9387 17.5781 26C18.2253 26 18.75 25.4753 18.75 24.8281ZM20.3113 11.9845C20.3113 11.4667 19.8916 11.047 19.3738 11.047H8.95316C7.7093 11.0965 7.71023 12.8729 8.95316 12.922H19.3738C19.8916 12.922 20.3113 12.5022 20.3113 11.9845Z" fill="#F5F1EB" />
      <path d="M32 10C32 14.9706 27.9706 19 23 19C18.0294 19 14 14.9706 14 10C14 5.02944 18.0294 1 23 1C27.9706 1 32 5.02944 32 10Z" fill="#D28A4C" strokeWidth="2" stroke="#140D0A" />
      <path d="M24.2432 6.35645V7.34766H24.165C23.7777 7.34766 23.4408 7.40137 23.1543 7.50879C22.8711 7.61296 22.6318 7.75944 22.4365 7.94824C22.238 8.13704 22.0833 8.36328 21.9727 8.62695C21.8652 8.89062 21.7985 9.17383 21.7725 9.47656C21.8506 9.38867 21.9417 9.30404 22.0459 9.22266C22.1501 9.13802 22.2656 9.06315 22.3926 8.99805C22.513 8.9362 22.6465 8.88737 22.793 8.85156C22.9395 8.8125 23.0941 8.79297 23.2568 8.79297C23.6019 8.79297 23.9014 8.85807 24.1553 8.98828C24.4124 9.11849 24.624 9.29427 24.79 9.51562C24.9593 9.73698 25.083 9.99089 25.1611 10.2773C25.2425 10.5638 25.2832 10.8617 25.2832 11.1709C25.2832 11.5094 25.2311 11.8268 25.127 12.123C25.026 12.416 24.8779 12.6715 24.6826 12.8896C24.484 13.111 24.2415 13.2852 23.9551 13.4121C23.6719 13.5358 23.348 13.5977 22.9834 13.5977C22.609 13.5977 22.2754 13.526 21.9824 13.3828C21.6895 13.2396 21.4421 13.0459 21.2402 12.8018C21.0254 12.5479 20.8626 12.25 20.752 11.9082C20.6413 11.5632 20.5859 11.2002 20.5859 10.8193V10.3359C20.5859 9.76302 20.6592 9.21777 20.8057 8.7002C20.9554 8.17936 21.2028 7.73177 21.5479 7.35742C21.8408 7.03516 22.2021 6.78776 22.6318 6.61523C23.0615 6.44271 23.5531 6.35645 24.1064 6.35645H24.2432ZM22.9688 9.74023C22.8288 9.74023 22.6953 9.76139 22.5684 9.80371C22.4414 9.84603 22.3242 9.90462 22.2168 9.97949C22.1191 10.0544 22.0312 10.1406 21.9531 10.2383C21.875 10.3359 21.8099 10.445 21.7578 10.5654V10.9268C21.7578 11.21 21.7887 11.459 21.8506 11.6738C21.9157 11.8887 22.0036 12.0677 22.1143 12.2109C22.2249 12.3542 22.3535 12.4632 22.5 12.5381C22.6465 12.613 22.8027 12.6504 22.9688 12.6504C23.151 12.6504 23.3138 12.6146 23.457 12.543C23.6003 12.4681 23.7223 12.3672 23.8232 12.2402C23.9242 12.11 24.0007 11.957 24.0527 11.7812C24.1048 11.6022 24.1309 11.4085 24.1309 11.2002C24.1309 11.0016 24.1048 10.8145 24.0527 10.6387C24.0039 10.4596 23.9307 10.3034 23.833 10.1699C23.7354 10.0365 23.6133 9.93229 23.4668 9.85742C23.3236 9.7793 23.1576 9.74023 22.9688 9.74023Z" fill="#140D0A" />
    </svg>
  )
}

export function HomeHeader({
  activeHref = '#inicio',
  navigationPrefix = '',
  mobileHomeLayout = false,
  mobileBrand = true,
  mobileNavigation = true,
  searchQuery = '',
  onSearchChange,
  onMobileFiltersClick,
}: {
  activeHref?: string
  navigationPrefix?: string
  mobileHomeLayout?: boolean
  mobileBrand?: boolean
  mobileNavigation?: boolean
  searchQuery?: string
  onSearchChange?: (query: string) => void
  onMobileFiltersClick?: () => void
}) {
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const { session, logout, isLoggingOut } = useSession()
  const [selectedHref, setSelectedHref] = useState(() => getSelectedNavigationHref(activeHref))
  const authTriggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const syncSelectedNavigation = () => {
      setSelectedHref(getSelectedNavigationHref(activeHref))
    }

    window.addEventListener('hashchange', syncSelectedNavigation)
    return () => window.removeEventListener('hashchange', syncSelectedNavigation)
  }, [activeHref])

  function closeAuthModal() {
    setIsAuthOpen(false)
    requestAnimationFrame(() => authTriggerRef.current?.focus())
  }

  return (
    <>
    {mobileHomeLayout && (
      <header className="mx-auto mt-5 flex h-[45px] w-[calc(100%-48px)] max-w-[366px] items-center gap-2 md:hidden">
        <label className="flex h-full min-w-0 flex-1 items-center gap-2 rounded-lg bg-surface-card px-3">
          <span className="scale-75 text-text-secondary"><SearchIcon /></span>
          <input
            aria-label="Explorar coleções"
            className="min-w-0 flex-1 bg-transparent font-mono text-[10px] leading-4 text-foreground outline-none placeholder:text-text-secondary"
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder="Explorar coleções"
            value={searchQuery}
            type="search"
          />
        </label>
        <button
          aria-label="Filtros"
          className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground"
          onClick={onMobileFiltersClick}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
            <path d="M2 4h12M4 8h8m-6 4h4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            <circle cx="5" cy="4" r="1.25" fill="currentColor" />
            <circle cx="10" cy="8" r="1.25" fill="currentColor" />
            <circle cx="7" cy="12" r="1.25" fill="currentColor" />
          </svg>
        </button>
      </header>
    )}
    {!mobileHomeLayout && mobileBrand && (
      <header className="mx-auto flex h-14 w-full items-center px-4 md:hidden">
        <a
          aria-label="Kurio - início"
          className="font-mono text-sm font-bold tracking-[0.12em] text-foreground"
          href={`${navigationPrefix}#inicio`}
        >
          KURIO
        </a>
      </header>
    )}
    <header className="relative mx-auto hidden h-17.25 w-full max-w-300 items-center justify-between px-4 md:flex md:px-0">
      <div aria-hidden="true" className="absolute inset-x-0 bottom-1 h-0 border-t-[0.3px] border-border" />
      <a
        aria-label="Kurio - início"
        className="flex h-[34.3px] w-40 shrink-0 items-center pl-14 font-mono text-sm 
        font-bold tracking-[0.12em] text-foreground max-md:flex-1"
        href={`${navigationPrefix}#inicio`}
      >
        KURIO
      </a>

      <nav aria-label="Navegação principal" className="hidden h-11.25 w-100.25 
      shrink-0 items-center justify-between gap-10 lg:flex">
        {navigationItems.map(({ label, href }) => (
          <a
            aria-current={selectedHref === href ? 'page' : undefined}
            className={`relative flex h-full items-center border-b-4 border-transparent px-0.5 pt-0.5 font-mono text-base transition-colors ${
              selectedHref === href
                ? 'font-bold text-primary after:absolute after:-bottom-3 after:left-0 after:right-0 after:h-1 after:bg-primary'
                : 'font-normal text-foreground hover:text-primary'
            }`}
            href={href.startsWith('/') ? href : `${navigationPrefix}${href}`}
            key={label}
            onClick={() => setSelectedHref(href)}
          >
            {label}
          </a>
        ))}
      </nav>

      <div className="flex h-8.75 w-51.75 shrink-0 -translate-x-16 items-center justify-between max-md:gap-2 max-lg:w-auto max-lg:gap-4">
        <button
          aria-label="Buscar"
          className="flex size-5 shrink-0 items-center justify-center rounded-sm text-foreground transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="button"
        >
          <SearchIcon />
        </button>
        <a
          aria-label="Carrinho, 6 itens"
          href="/cart"
          className="flex h-6.5 w-8.25 shrink-0 items-center justify-center transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <CartIcon />
        </a>
        <button
          aria-label={session ? `Sair de ${session.user.displayName}` : 'Entrar'}
          className="h-8.75 w-25 shrink-0 rounded-md transition-opacity hover:opacity-90 max-lg:w-[76px]
          focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-ring focus-visible:ring-offset-2
            focus-visible:ring-offset-background"
          disabled={isLoggingOut}
          onClick={() => session ? logout() : setIsAuthOpen(true)}
          ref={authTriggerRef}
          type="button"
        >
          <svg aria-hidden="true" className="max-lg:w-[76px]" width="100" height="35" viewBox="0 0 100 35" fill="none">
            <rect width="100" height="35" rx="6" fill="#D28A4C" />
            <path d="M27.1592 17.1006H17.125" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#140D0A" />
            <path d="M24.7202 14.6706L27.1602 17.1006L24.7202 19.5306" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#140D0A" />
            <path d="M22.6332 13.3583C22.3582 10.3749 21.2415 9.29158 16.7998 9.29158C10.8823 9.29158 10.8823 11.2166 10.8823 16.9999C10.8823 22.7833 10.8823 24.7083 16.7998 24.7083C21.2415 24.7083 22.3582 23.6249 22.6332 20.6416" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" stroke="#140D0A" />
            <path d="M40.8516 18.8984H36.1484V22.4531H41.6406V24H34.2656V12.625H41.6016V14.1797H36.1484V17.3828H40.8516V18.8984ZM43.8203 24V15.5469H45.5078L45.625 16.75C45.7396 16.5885 45.8646 16.4401 46 16.3047C46.1406 16.1641 46.2891 16.0391 46.4453 15.9297C46.6953 15.7578 46.9688 15.625 47.2656 15.5312C47.5625 15.4375 47.875 15.3906 48.2031 15.3906C48.6354 15.3906 49.0312 15.4531 49.3906 15.5781C49.75 15.7031 50.0573 15.901 50.3125 16.1719C50.5677 16.4427 50.7656 16.7891 50.9062 17.2109C51.0469 17.6276 51.1172 18.1328 51.1172 18.7266V24H49.25V18.7578C49.25 18.4089 49.2109 18.1172 49.1328 17.8828C49.0547 17.6484 48.9401 17.4609 48.7891 17.3203C48.638 17.1797 48.4557 17.0807 48.2422 17.0234C48.0286 16.9609 47.7839 16.9297 47.5078 16.9297C47.2786 16.9297 47.0651 16.9609 46.8672 17.0234C46.6693 17.0807 46.4896 17.1641 46.3281 17.2734C46.2031 17.3568 46.0859 17.4583 45.9766 17.5781C45.8672 17.6979 45.7708 17.8281 45.6875 17.9688V24H43.8203ZM57.1797 13.4844V15.5469H60.3594V16.9453H57.1797V20.9844C57.1797 21.2969 57.2161 21.5599 57.2891 21.7734C57.3672 21.9818 57.474 22.1458 57.6094 22.2656C57.7448 22.3906 57.9062 22.4792 58.0938 22.5312C58.2812 22.5833 58.487 22.6094 58.7109 22.6094C58.8724 22.6094 59.0391 22.6016 59.2109 22.5859C59.3828 22.5703 59.5495 22.5495 59.7109 22.5234C59.8672 22.5026 60.013 22.4792 60.1484 22.4531C60.2891 22.4219 60.4062 22.3958 60.5 22.375L60.7031 23.6641C60.5677 23.7474 60.4036 23.8203 60.2109 23.8828C60.0234 23.9401 59.8203 23.9896 59.6016 24.0312C59.3828 24.0729 59.1536 24.1042 58.9141 24.125C58.6797 24.151 58.4453 24.1641 58.2109 24.1641C57.7839 24.1641 57.3906 24.1068 57.0312 23.9922C56.6771 23.8724 56.3724 23.6875 56.1172 23.4375C55.862 23.1927 55.6615 22.8776 55.5156 22.4922C55.375 22.1068 55.3047 21.6432 55.3047 21.1016V16.9453H53.2578V15.5469H55.3047V13.4844H57.1797ZM68.8828 15.3906C69.1849 15.3906 69.4766 15.4115 69.7578 15.4531C70.0443 15.4948 70.2682 15.5443 70.4297 15.6016L70.1641 17.4453C69.8776 17.3828 69.5938 17.3359 69.3125 17.3047C69.0365 17.2734 68.7604 17.2578 68.4844 17.2578C68.1719 17.2578 67.8906 17.2891 67.6406 17.3516C67.3906 17.4141 67.1693 17.5104 66.9766 17.6406C66.7682 17.7656 66.5911 17.9245 66.4453 18.1172C66.2995 18.3099 66.1771 18.5312 66.0781 18.7812V24H64.2109V15.5469H65.9609L66.0391 16.7188L66.0469 16.9141C66.3906 16.4401 66.8021 16.0677 67.2812 15.7969C67.7656 15.526 68.2995 15.3906 68.8828 15.3906ZM78.0469 24C77.9896 23.8958 77.9427 23.7708 77.9062 23.625C77.875 23.474 77.8464 23.3177 77.8203 23.1562C77.6901 23.2917 77.5417 23.4219 77.375 23.5469C77.2135 23.6667 77.0312 23.7708 76.8281 23.8594C76.625 23.9531 76.4062 24.026 76.1719 24.0781C75.9375 24.1302 75.6849 24.1562 75.4141 24.1562C74.9766 24.1562 74.5755 24.0938 74.2109 23.9688C73.8516 23.8385 73.5443 23.6615 73.2891 23.4375C73.0286 23.2188 72.8255 22.9557 72.6797 22.6484C72.5391 22.3359 72.4688 22 72.4688 21.6406C72.4688 21.1771 72.5599 20.7682 72.7422 20.4141C72.9297 20.0547 73.2005 19.7578 73.5547 19.5234C73.8828 19.3047 74.2865 19.138 74.7656 19.0234C75.25 18.9089 75.7969 18.8516 76.4062 18.8516H77.7656V18.2812C77.7656 18.0625 77.7266 17.8646 77.6484 17.6875C77.5755 17.5104 77.4688 17.3568 77.3281 17.2266C77.1771 17.0964 76.9922 16.9974 76.7734 16.9297C76.5599 16.8568 76.3125 16.8203 76.0312 16.8203C75.776 16.8203 75.5521 16.8516 75.3594 16.9141C75.1719 16.9766 75.0156 17.0625 74.8906 17.1719C74.7656 17.2708 74.6719 17.3932 74.6094 17.5391C74.5521 17.6797 74.5234 17.8307 74.5234 17.9922H72.6484C72.6536 17.6536 72.7344 17.3281 72.8906 17.0156C73.0469 16.7031 73.276 16.4271 73.5781 16.1875C73.8698 15.9427 74.2292 15.75 74.6562 15.6094C75.0885 15.4635 75.5801 15.3906 76.1328 15.3906C76.6276 15.3906 77.0885 15.4531 77.5156 15.5781C77.9479 15.6979 78.3203 15.8776 78.6328 16.1172C78.9453 16.3568 79.1901 16.6615 79.3672 17.0312C79.5443 17.3958 79.6328 17.8177 79.6328 18.2969V22.0547C79.6328 22.4349 79.6589 22.7786 79.7109 23.0859C79.7682 23.388 79.849 23.6484 79.9531 23.8672V24H78.0469ZM75.7734 22.6562C76.0182 22.6562 76.2448 22.625 76.4531 22.5625C76.6667 22.5 76.8594 22.4193 77.0312 22.3203C77.2031 22.2214 77.3516 22.1094 77.4766 21.9844C77.6016 21.8594 77.6979 21.7292 77.7656 21.5938V20.0312H76.5625C76.1562 20.0312 75.8047 20.0703 75.5078 20.1484C75.2109 20.2214 74.974 20.3281 74.7969 20.4688C74.6406 20.5885 74.5234 20.7318 74.4453 20.8984C74.3724 21.0651 74.3359 21.2526 74.3359 21.4609C74.3359 21.6328 74.3672 21.7943 74.4297 21.9453C74.4922 22.0911 74.5833 22.2161 74.7031 22.3203C74.8229 22.4245 74.9714 22.5076 75.1484 22.5703C75.3255 22.6276 75.5339 22.6562 75.7734 22.6562ZM88.1016 15.3906C88.4036 15.3906 88.6953 15.4115 88.9766 15.4531C89.263 15.4948 89.487 15.5443 89.6484 15.6016L89.3828 17.4453C89.0964 17.3828 88.8125 17.3359 88.5312 17.3047C88.2552 17.2734 87.9792 17.2578 87.7031 17.2578C87.3906 17.2578 87.1094 17.2891 86.8594 17.3516C86.6094 17.4141 86.388 17.5104 86.1953 17.6406C85.987 17.7656 85.8099 17.9245 85.6641 18.1172C85.5182 18.3099 85.3958 18.5312 85.2969 18.7812V24H83.4297V15.5469H85.1797L85.2578 16.7188L85.2656 16.9141C85.6094 16.4401 86.0208 16.0677 86.5 15.7969C86.9844 15.526 87.5182 15.3906 88.1016 15.3906Z" fill="#140D0A" />
          </svg>
        </button>
      </div>
    </header>
    {mobileNavigation && <nav
      aria-label="Menu mobile"
      className="fixed inset-x-0 bottom-0 z-40 flex h-[64px] items-center justify-around rounded-t-2xl border-t border-border bg-surface-card px-5 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <a aria-label="Início" className="flex size-10 items-center justify-center" href={`${navigationPrefix}#inicio`}>
        <img alt="" className="size-4" height="16" src="/images/home.png" width="16" />
      </a>
      <a aria-label="Favoritos" className="flex size-10 items-center justify-center" href={`${navigationPrefix}#mercado`}>
        <img alt="" className="size-4" height="16" src="/images/favorite-heart.png" width="16" />
      </a>
      <a
        aria-label="Explorar mercado"
        className="relative -mt-7 flex size-12 items-center justify-center rounded-full border border-primary bg-primary text-primary-foreground shadow-lg"
        href={`${navigationPrefix}#mercado`}
      >
        <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 20 20" width="20">
          <path d="M10 3v14M3 10h14" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      </a>
      <a aria-label="Carrinho" className="flex size-10 items-center justify-center" href="/cart">
        <img alt="" className="size-4" height="16" src="/images/carrinho.png" width="16" />
      </a>
      <button
        aria-label={session ? `Sair de ${session.user.displayName}` : 'Entrar'}
        className="flex size-10 items-center justify-center"
        disabled={isLoggingOut}
        onClick={() => session ? logout() : setIsAuthOpen(true)}
        ref={authTriggerRef}
        type="button"
      >
        <img alt="" className="size-4" height="16" src="/images/user.png" width="16" />
      </button>
    </nav>}
    {isAuthOpen && <AuthModal onClose={closeAuthModal} />}
    </>
  )
}
