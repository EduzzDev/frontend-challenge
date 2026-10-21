import { useState } from 'react'
import { ChevronRight } from 'lucide-react'

const filters = ['Todos os NFTs', 'Novos lançamentos', 'Em alta']
const pageCount = 4

const nfts = [
  { name: 'Emerald Ape', number: '042', price: '1.19', image: '/images/hero-ape.png' },
  { name: 'Sage Nomad', number: '009', price: '1.69', image: '/images/chill-chimp.png' },
  { name: 'Neon Vessel', number: '552', price: '1.99', image: '/images/dapper-kong.png' },
  { name: 'Cosmic Bloom', number: '118', price: '1.29', image: '/images/chill-chimp.png' },
  { name: 'Violet Nomad', number: '314', price: '1.39', image: '/images/chill-chimp.png' },
  { name: 'Ivory Baron', number: '008', price: '1.79', image: '/images/dapper-kong.png' },
  { name: 'Golden Beat', number: '207', price: '0.99', image: '/images/DJ-golden-chimp.png' },
  { name: 'Golden Signal', number: '160', price: '0.39', image: '/images/DJ-golden-chimp.png' },
  { name: 'Golden Signal', number: '168', price: '0.39', image: '/images/DJ-golden-chimp.png' },
]

export function NftMarketplaceGrid() {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [currentPage, setCurrentPage] = useState(1)

  return (
    <section
      aria-label="NFTs disponíveis"
      className="flex min-h-312.5 w-210.5 max-w-full flex-col gap-8"
      id="mercado"
    >
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-4 border-b border-border">
        <div aria-label="Filtrar NFTs" className="flex flex-wrap items-center gap-8">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={`relative h-12 whitespace-nowrap font-mono text-base font-bold transition-colors ${
                activeFilter === filter
                  ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary'
                  : 'text-foreground hover:text-primary'
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 whitespace-nowrap font-mono text-sm text-foreground">
          <span>Ordenar por:</span>
          <select
            aria-label="Ordenar NFTs"
            className="h-10 rounded-md  border-0 bg-[#140D0A] px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            defaultValue="recent"
          >
            <option value="recent">Listados recentemente</option>
            <option value="price-low">Menor preço</option>
            <option value="price-high">Maior preço</option>
          </select>
        </label>
      </div>

      <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {nfts.map((nft) => (
          <li className="min-w-0" key={`${nft.name}-${nft.number}`}>
            <article>
              <div className="h-75 w-full bg-surface-card p-3">
                <img
                  alt={`NFT ${nft.name} #${nft.number}`}
                  className="h-full w-full rounded-xl object-cover"
                  height={620}
                  loading="lazy"
                  src={nft.image}
                  width={620}
                />
              </div>
              <div className="mt-3 flex flex-col gap-1 font-mono">
                <h2 className="truncate text-sm font-normal text-foreground">
                  {nft.name} #{nft.number}
                </h2>
                <p className="text-sm font-bold text-primary">{nft.price} ETH</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      <nav aria-label="Paginação dos NFTs" className="mt-14 flex justify-end">
        <div className="flex gap-2.5">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) => (
            <button
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Página ${page}`}
              className={`size-8.75 rounded-sm border border-border font-mono text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                currentPage === page
                  ? 'border-primary bg-primary font-bold text-primary-foreground'
                  : 'text-foreground hover:border-primary hover:text-primary'
              }`}
              key={page}
              onClick={() => setCurrentPage(page)}
              type="button"
            >
              {page}
            </button>
          ))}
          <button
            aria-label="Próxima página"
            className="flex size-8.75 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={currentPage === pageCount}
            onClick={() => setCurrentPage((page) => Math.min(page + 1, pageCount))}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </nav>
    </section>
  )
}
