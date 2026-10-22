import { useEffect, useState, type CSSProperties } from 'react'
import { ChevronRight } from 'lucide-react'
import { nfts, type Nft } from '@/lib/nfts'

const filters = ['Todos os NFTs', 'Novos lançamentos', 'Em alta']
const PAGE_SIZE = 9

type NftMarketplaceGridProps = {
  selectedCollection: string | null
  selectedNetwork: string | null
  priceRange: [number, number]
  searchQuery: string
}

export function NftMarketplaceGrid({
  selectedCollection,
  selectedNetwork,
  priceRange,
  searchQuery,
}: NftMarketplaceGridProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('recent')

  const filteredNfts = nfts.filter((nft) => {
    const priceInCents = Number(nft.price) * 100
    return (
      (!selectedCollection || nft.collection === selectedCollection) &&
      (!selectedNetwork || nft.network === selectedNetwork) &&
      (!searchQuery.trim() ||
        `${nft.name} ${nft.number}`.toLowerCase().includes(searchQuery.trim().toLowerCase())) &&
      priceInCents >= priceRange[0] &&
      priceInCents <= priceRange[1]
    )
  })

  const sortedNfts = [...filteredNfts].sort((left, right) => {
    if (sortOrder === 'price-low') return Number(left.price) - Number(right.price)
    if (sortOrder === 'price-high') return Number(right.price) - Number(left.price)
    return 0
  })
  const pageCount = Math.max(1, Math.ceil(sortedNfts.length / PAGE_SIZE))
  const visibleNfts = sortedNfts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCollection, selectedNetwork, priceRange])

  function getNftHref(nft: Nft) {
    return `/nft/${nft.name.toLowerCase().replaceAll(' ', '-')}-${nft.number}`
  }

  return (
    <section
      aria-label="NFTs disponíveis"
      className="flex min-h-312.5 w-210.5 max-w-full flex-col gap-8 max-md:min-h-0 max-md:w-full max-md:gap-3"
      id="mercado"
    >
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-4 border-b border-border max-md:min-h-4 max-md:flex-nowrap max-md:gap-0 max-md:border-0">
      <div aria-label="Filtrar NFTs" className="flex min-w-0 flex-nowrap items-center gap-8 max-md:w-full max-md:justify-start max-md:gap-3 max-md:overflow-x-auto max-md:whitespace-nowrap max-[359px]:gap-2">
          {filters.map((filter) => (
            <button
              aria-pressed={activeFilter === filter}
              className={`relative h-12 whitespace-nowrap font-mono text-base font-bold transition-colors max-md:h-6 max-md:shrink-0 max-md:text-[14px] max-[359px]:text-xs ${
                activeFilter === filter
                  ? 'text-primary after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-primary max-md:font-bold'
                  : 'text-foreground hover:text-primary max-md:font-normal'
              }`}
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
            >
              {filter}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 whitespace-nowrap font-mono text-sm text-foreground max-md:hidden">
          <span>Ordenar por:</span>
          <select
            aria-label="Ordenar NFTs"
            className="h-10 rounded-md  border-0 bg-[#140D0A] px-3 font-mono text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onChange={(event) => setSortOrder(event.target.value)}
            value={sortOrder}
          >
            <option value="recent">Listados recentemente</option>
            <option value="price-low">Menor preço</option>
            <option value="price-high">Maior preço</option>
          </select>
        </label>
      </div>

      <ul className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-3 max-md:gap-y-4">
        {visibleNfts.map((nft) => (
          <li
            className={`min-w-0 max-md:[order:var(--mobile-order)]`}
            key={`${nft.name}-${nft.number}`}
            style={{
              '--mobile-order':
                nft.number === '042' ? 1
                  : nft.number === '009' ? 2
                    : nft.number === '008' ? 3
                      : nft.number === '207' ? 4
                        : 5,
            } as CSSProperties & { '--mobile-order': number }}
          >
            <article>
              <a
                aria-label={`Ver detalhes de ${nft.name} #${nft.number}`}
                className="relative block aspect-square w-full overflow-hidden bg-surface-card p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary max-md:rounded-xl max-md:p-[5px]"
                href={getNftHref(nft)}
              >
                <img
                  alt={`NFT ${nft.name} #${nft.number}`}
                  className="h-full w-full rounded-xl object-contain max-md:rounded-[10px] max-md:object-cover"
                  height={620}
                  loading="lazy"
                  src={nft.image}
                  width={620}
                />
                {nft.number === '008' && (
                  <span className="absolute left-3 top-3 hidden bg-primary px-2 py-1 font-mono text-[9px] font-bold leading-3 text-primary-foreground max-md:block">
                    RARO
                  </span>
                )}
              </a>
              <div className="mt-3 flex flex-col gap-1 font-mono max-md:mt-1 max-md:gap-0">
                <h2 className="truncate text-sm font-normal text-foreground max-md:text-xs max-[359px]:text-[10px]">
                  {nft.name} #{nft.number}
                </h2>
                <p className="text-sm font-bold text-primary max-md:text-xs max-[359px]:text-[10px]">{nft.price} ETH</p>
              </div>
            </article>
          </li>
        ))}
      </ul>

      {visibleNfts.length === 0 && (
        <p className="py-8 text-center font-mono text-sm text-text-secondary">
          Nenhum NFT encontrado com os filtros selecionados.
        </p>
      )}

      <nav aria-label="Paginação dos NFTs" className="mt-auto flex justify-end pt-8">
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
