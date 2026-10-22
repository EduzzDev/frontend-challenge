import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { getNfts } from '@/api/nfts'
import { BlogCards } from '@/components/blog-cards'
import { FeaturedNftBanner } from '@/components/featured-nft-banner'
import { HomeFilters } from '@/components/home-filters'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { HomeHero } from '@/components/home-hero'
import { NftMarketplaceGrid } from '@/components/nft-marketplace-grid'
import { PromotionalBanners } from '@/components/promotional-banners'

export function HomePage() {
  const search = useSearch({ from: '/' })
  const navigate = useNavigate({ from: '/' })
  const [searchQuery, setSearchQuery] = useState(search.search ?? '')
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const selectedCollection = search.collection ?? null
  const selectedNetwork = search.network ?? null
  const priceRange: [number, number] = [Number(search.minPrice ?? '0.02') * 100, Number(search.maxPrice ?? '12.30') * 100]
  const catalogParams = {
    search: search.search,
    collection: search.collection,
    network: search.network,
    minPrice: search.minPrice,
    maxPrice: search.maxPrice,
    sort: search.sort,
    page: search.page,
  }
  const catalog = useQuery({
    queryKey: ['nfts', catalogParams],
    queryFn: ({ signal }) => getNfts(catalogParams, signal),
  })

  useEffect(() => setSearchQuery(search.search ?? ''), [search.search])
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (searchQuery !== (search.search ?? '')) {
        void navigate({ search: (previous) => ({ ...previous, search: searchQuery || undefined, page: 1 }), replace: true })
      }
    }, 250)
    return () => window.clearTimeout(timer)
  }, [navigate, search.search, searchQuery])

  function updateCatalogSearch(values: Partial<typeof catalogParams>) {
    void navigate({ search: (previous) => ({ ...previous, ...values }) })
  }

  function applyPriceRange(range: [number, number]) {
    updateCatalogSearch({ minPrice: (range[0] / 100).toFixed(2), maxPrice: (range[1] / 100).toFixed(2), page: 1 })
  }

  return (
    <>
      <main id="inicio" className="min-h-screen pb-24 md:pb-0">
        <HomeHeader
          mobileHomeLayout
          onMobileFiltersClick={() => setIsMobileFiltersOpen((isOpen) => !isOpen)}
          onSearchChange={setSearchQuery}
          searchQuery={searchQuery}
        />
        <HomeHero />
        <div className="mx-auto mt-4 w-full max-w-300 px-6 md:mt-24 md:px-0">
          <div className="flex w-full flex-col gap-0 md:flex-row md:items-start md:gap-8">
            <div className="flex w-77.5 shrink-0 flex-col gap-5 max-md:hidden">
              <HomeFilters
                onCollectionChange={(collection) => updateCatalogSearch({ collection: collection ?? undefined, page: 1 })}
                onNetworkChange={(network) => updateCatalogSearch({ network: network ?? undefined, page: 1 })}
                onPriceRangeApply={applyPriceRange}
                priceRange={priceRange}
                selectedCollection={selectedCollection}
                selectedNetwork={selectedNetwork}
              />
              <FeaturedNftBanner />
            </div>
            <NftMarketplaceGrid
              items={catalog.data?.items ?? []}
              isLoading={catalog.isPending}
              error={catalog.error}
              onRetry={() => void catalog.refetch()}
              page={search.page}
              onPageChange={(page) => updateCatalogSearch({ page })}
              sortOrder={search.sort ?? 'recent'}
              onSortChange={(sort) => updateCatalogSearch({ sort, page: 1 })}
              total={catalog.data?.total ?? 0}
            />
          </div>
        </div>
        <PromotionalBanners />
        <BlogCards />
        {isMobileFiltersOpen && (
          <div
            className="fixed inset-0 z-50 overflow-y-auto bg-black/70 px-4 pb-8 pt-16 md:hidden"
            onClick={() => setIsMobileFiltersOpen(false)}
          >
            <div
              aria-label="Filtros do mercado"
              aria-modal="true"
              className="relative mx-auto min-w-50 max-w-91.5 rounded-xl bg-background p-3"
              onClick={(event) => event.stopPropagation()}
              role="dialog"
            >
              <button
                aria-label="Fechar filtros"
                className="absolute right-6 top-4 md:right-3 md:top-2 z-10 text-primary"
                onClick={() => setIsMobileFiltersOpen(false)}
                type="button"
              >
                ×
              </button>
              <HomeFilters
                className="max-md:w-full max-md:px-3 max-md:pt-8"
                onCollectionChange={(collection) => updateCatalogSearch({ collection: collection ?? undefined, page: 1 })}
                onNetworkChange={(network) => updateCatalogSearch({ network: network ?? undefined, page: 1 })}
                onPriceRangeApply={applyPriceRange}
                priceRange={priceRange}
                selectedCollection={selectedCollection}
                selectedNetwork={selectedNetwork}
              />
            </div>
          </div>
        )}
      </main>
      <HomeFooter />
    </>
  )
}
