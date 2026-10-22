import { useState, type CSSProperties } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Nft } from '@/lib/nfts'

const filters = ['Todos os NFTs', 'Novos lançamentos', 'Em alta']
type NftMarketplaceGridProps = {
  items: Nft[]
  isLoading: boolean
  error: Error | null
  onRetry: () => void
  page: number
  onPageChange: (page: number) => void
  sortOrder: string
  onSortChange: (sortOrder: string) => void
  total: number
}

export function NftMarketplaceGrid({
  items,
  isLoading,
  error,
  onRetry,
  page,
  onPageChange,
  sortOrder,
  onSortChange,
  total,
}: NftMarketplaceGridProps) {
  const [activeFilter, setActiveFilter] = useState(filters[0])
  const pageCount = Math.max(1, Math.ceil(total / 9))

  function getNftHref(nft: Nft) {
    return `/nft/${nft.name.toLowerCase().replaceAll(' ', '-')}-${nft.number}`
  }

  return (
    <section
      aria-label="NFTs disponíveis"
      className="flex min-h-312.5 w-210.5 max-w-full min-w-0 flex-col gap-8 max-md:min-h-0 max-md:w-full max-md:gap-3"
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
            onChange={(event) => onSortChange(event.target.value)}
            value={sortOrder}
          >
            <option value="recent">Listados recentemente</option>
            <option value="price-low">Menor preço</option>
            <option value="price-high">Maior preço</option>
          </select>
        </label>
      </div>

      {error && (
        <div className="rounded-lg border border-border p-6 text-center font-mono text-sm text-text-secondary" role="alert">
          <p>{error.message || 'Não foi possível carregar os NFTs.'}</p>
          <button className="mt-3 rounded-md bg-primary px-4 py-2 font-bold text-primary-foreground" onClick={onRetry} type="button">Tentar novamente</button>
        </div>
      )}
      <ul aria-busy={isLoading} className="grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 max-md:grid-cols-2 max-md:gap-x-3 max-md:gap-y-4">
        {isLoading ? Array.from({ length: 6 }, (_, index) => (
          <li aria-label="Carregando NFT" className="animate-pulse" key={`skeleton-${index}`}>
            <div className="aspect-square w-full rounded-xl bg-surface-card" />
            <div className="mt-3 h-4 w-3/4 rounded bg-surface-card" />
            <div className="mt-2 h-4 w-1/3 rounded bg-surface-card" />
          </li>
        )) : items.map((nft) => (
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

      {!isLoading && !error && items.length === 0 && (
        <p className="py-8 text-center font-mono text-sm text-text-secondary">
          Nenhum NFT encontrado com os filtros selecionados.
        </p>
      )}

      <nav aria-label="Paginação dos NFTs" className="mt-auto flex justify-end pt-8">
        <div className="flex gap-2.5">
          {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
            <button
              aria-current={page === pageNumber ? 'page' : undefined}
              aria-label={`Página ${pageNumber}`}
              className={`size-8.75 rounded-sm border border-border font-mono text-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                page === pageNumber
                  ? 'border-primary bg-primary font-bold text-primary-foreground'
                  : 'text-foreground hover:border-primary hover:text-primary'
              }`}
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              type="button"
            >
              {pageNumber}
            </button>
          ))}
          <button
            aria-label="Próxima página"
            className="flex size-8.75 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            disabled={page === pageCount}
            onClick={() => onPageChange(Math.min(page + 1, pageCount))}
            type="button"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </nav>
    </section>
  )
}
