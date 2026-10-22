import { useState } from 'react'

const collections = [
  { label: 'Arte digital', count: 33 },
  { label: 'Fotografia', count: 12 },
  { label: 'Música', count: 65 },
  { label: 'Arte 3D', count: 39 },
  { label: 'Colecionáveis', count: 23 },
  { label: 'Generativa', count: 17 },
  { label: 'Jogos', count: 19 },
  { label: 'Assinaturas', count: 13 },
  { label: 'Utilidade', count: 18 },
]

const networks = [
  { label: 'Ethereum', count: 119 },
  { label: 'Polygon', count: 78 },
  { label: 'Solana', count: 86 },
]

const MIN_PRICE = 2
const MAX_PRICE = 1230

type HomeFiltersProps = {
  selectedCollection: string | null
  onCollectionChange: (collection: string | null) => void
  selectedNetwork: string | null
  onNetworkChange: (network: string | null) => void
  priceRange: [number, number]
  onPriceRangeApply: (range: [number, number]) => void
  className?: string
}

export function HomeFilters({
  selectedCollection,
  onCollectionChange,
  selectedNetwork,
  onNetworkChange,
  priceRange,
  onPriceRangeApply,
  className = '',
}: HomeFiltersProps) {
  const [minPrice, setMinPrice] = useState(priceRange[0])
  const [maxPrice, setMaxPrice] = useState(priceRange[1])

  const applyPriceRange = () => {
    onPriceRangeApply([minPrice, maxPrice])
  }

  const formatPrice = (value: number) =>
    (value / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return (
    <aside aria-label="Filtros do mercado" className={`flex w-77.5 flex-col gap-3 bg-surface-card p-5  rounded-2xl ${className}`}>
      <section aria-labelledby="collection-filter-title" className="h-97 sm:w-67.5">
        <h2
          className="h-5.5 font-mono text-lg font-bold leading-5.5 text-foreground"
          id="collection-filter-title"
        >
          Coleções
        </h2>
        <ul className="mt-1.5 ml-1 w-56 sm:w-61.5">
          {collections.map(({ label, count }) => (
            <li className="h-10 w-full" key={label}>
              <button
                aria-pressed={selectedCollection === label}
                className={`flex h-10 w-full items-center justify-between px-2 font-mono text-[15px] font-normal leading-10 transition-colors ${
                  selectedCollection === label ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
                onClick={() => onCollectionChange(selectedCollection === label ? null : label)}
                type="button"
              >
                <span>{label}</span>
                <span>({count})</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="price-filter-title" className="relative -left-1.25 h-40 w-67.5 pt-5">
        <div className="flex h-5 w-64.5 items-center gap-2.5">
          <h2
            className="h-4 w-38 font-mono text-lg font-bold leading-4 text-foreground"
            id="price-filter-title"
          >
            Faixa de preço
          </h2>
        </div>

        <div className="ml-3 w-55.5 sm:w-64.5">
          <div className="relative mt-1.5 h-3.75 w-full" aria-label="Faixa de preço em ETH">
            <div aria-hidden="true" className="absolute inset-x-0 top-1.5 h-1 rounded-full bg-primary" />
            <input
              aria-label="Preço mínimo"
              className="price-range-input"
              max={maxPrice - 1}
              min={MIN_PRICE}
              onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice - 1))}
              type="range"
              value={minPrice}
            />
            <input
              aria-label="Preço máximo"
              className="price-range-input"
              max={MAX_PRICE}
              min={minPrice + 1}
              onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice + 1))}
              type="range"
              value={maxPrice}
            />
          </div>

          <p className="mt-5.5 h-5 whitespace-nowrap font-mono text-[15px] font-normal leading-5 text-foreground">
            Preço: {formatPrice(minPrice)} - {formatPrice(maxPrice)} ETH
          </p>

          <button
            aria-label={`Aplicar faixa de preço de ${formatPrice(minPrice)} a ${formatPrice(maxPrice)} ETH`}
            className="mt-2 flex h-9 w-23 items-center justify-center rounded-md bg-primary p-2 font-mono text-base font-bold leading-5 text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
            onClick={applyPriceRange}
            type="button"
          >
            <span className="flex h-5 w-17 items-center justify-center">Aplicar</span>
          </button>
        </div>
      </section>

      <section aria-labelledby="network-filter-title" className="w-67.5">
        <h2
          className="h-5.5 font-mono text-lg font-bold leading-5.5 text-foreground"
          id="network-filter-title"
        >
          Rede
        </h2>
        <ul className="mt-1.5 ml-1 w-61.5">
          {networks.map(({ label, count }) => (
            <li className="h-10 w-full" key={label}>
              <button
                aria-pressed={selectedNetwork === label}
                className={`flex h-10 w-full items-center justify-between px-2 font-mono text-[15px] font-normal leading-10 transition-colors ${
                  selectedNetwork === label ? 'text-primary' : 'text-secondary hover:text-primary'
                }`}
                onClick={() => onNetworkChange(selectedNetwork === label ? null : label)}
                type="button"
              >
                <span>{label}</span>
                <span>({count})</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
