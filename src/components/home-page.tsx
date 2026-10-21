import { useState } from 'react'
import { BlogCards } from '@/components/blog-cards'
import { FeaturedNftBanner } from '@/components/featured-nft-banner'
import { HomeFilters } from '@/components/home-filters'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { HomeHero } from '@/components/home-hero'
import { NftMarketplaceGrid } from '@/components/nft-marketplace-grid'
import { PromotionalBanners } from '@/components/promotional-banners'

export function HomePage() {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([2, 1230])

  return (
    <>
      <main id="inicio" className="min-h-screen">
        <HomeHeader />
        <HomeHero />
        <div className="mx-auto mt-24 w-full max-w-300 px-4 md:px-0">
          <div className="flex w-full flex-col gap-8 xl:flex-row">
            <div className="flex w-77.5 shrink-0 flex-col gap-5">
              <HomeFilters
                onCollectionChange={setSelectedCollection}
                onNetworkChange={setSelectedNetwork}
                onPriceRangeApply={setPriceRange}
                priceRange={priceRange}
                selectedCollection={selectedCollection}
                selectedNetwork={selectedNetwork}
              />
              <FeaturedNftBanner />
            </div>
            <NftMarketplaceGrid
              priceRange={priceRange}
              selectedCollection={selectedCollection}
              selectedNetwork={selectedNetwork}
            />
          </div>
        </div>
        <PromotionalBanners />
        <BlogCards />
      </main>
      <HomeFooter />
    </>
  )
}
