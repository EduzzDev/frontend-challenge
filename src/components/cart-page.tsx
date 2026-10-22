import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { getCartItems, saveCartItems, type CartItem } from '@/lib/cart'
import { nfts } from '@/lib/nfts'

const NETWORK_FEE = 0.016
const recommendationIds = [
  ['Cosmic Bloom', '118'],
  ['Violet Nomad', '314'],
  ['Ivory Baron', '008'],
  ['Golden Beat', '207'],
  ['Golden Signal', '160'],
] as const

const recommendations = recommendationIds.map(([name, number]) => {
  const nft = nfts.find((item) => item.name === name && item.number === number)
  if (!nft) throw new Error(`NFT recomendado não encontrado: ${name} #${number}`)
  return nft
})

function getSubtotal(items: CartItem[]) {
  return items.reduce((total, item) => total + Number(item.nft.price) * item.quantity, 0)
}

export function CartPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(getCartItems)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const subtotal = getSubtotal(items)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal - discount + (items.length > 0 ? NETWORK_FEE : 0)

  function updateItems(nextItems: CartItem[]) {
    setItems(nextItems)
    saveCartItems(nextItems)
  }

  function changeQuantity(index: number, difference: number) {
    updateItems(items.map((item, itemIndex) =>
      itemIndex === index ? { ...item, quantity: Math.max(1, item.quantity + difference) } : item,
    ))
  }

  function removeItem(index: number) {
    updateItems(items.filter((_, itemIndex) => itemIndex !== index))
  }

  function applyPromoCode() {
    setPromoApplied(promoCode.trim().length > 0)
  }

  return (
    <>
      <HomeHeader activeHref="#mercado" navigationPrefix="/" />
      <main className="mx-auto min-h-[calc(100vh-69px)] w-full max-w-300 px-4 pb-16 max-md:px-2 md:px-6 xl:px-0">
        <nav aria-label="Navegação estrutural" className="py-4 font-mono text-sm font-bold text-foreground">
          <a className="hover:text-primary" href="/#inicio">Início</a>
          <span aria-hidden="true" className="px-2">/</span>
          <a className="hover:text-primary" href="/#mercado">Mercado</a>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page">Carrinho</span>
        </nav>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,2.1fr)_minmax(300px,0.9fr)]">
          <section aria-label="Itens do carrinho" className="min-w-0">
            <div className="grid grid-cols-[minmax(154px,1fr)_77px_112px_109px_24px] gap-6 border-b border-border pb-2 font-mono text-base font-medium leading-4 text-foreground md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.35fr)_minmax(0,0.4fr)_minmax(0,0.35fr)_32px] md:gap-4 max-md:grid-cols-[minmax(0,1fr)_32px]">
              <h1 className="leading-4">NFTs</h1>
              <span className="w-[49px] max-md:hidden">Preço</span>
              <span className="max-md:hidden">Edições</span>
              <span className="w-[49px] max-md:hidden">Total</span>
              <span aria-hidden="true" />
            </div>
            {items.length === 0 ? (
              <p className="py-10 font-mono text-sm text-text-secondary">
                Seu carrinho está vazio. <a className="text-primary hover:underline" href="/#mercado">Continue explorando</a>
              </p>
            ) : (
              <ul className="flex flex-col gap-3 pt-3 max-md:gap-4 max-md:pl-0 max-md:pr-3">
                {items.map(({ nft, quantity }, index) => {
                  const itemTotal = Number(nft.price) * quantity
                  return (
                    <li
                      className="relative grid grid-cols-[minmax(154px,1fr)_77px_112px_109px_24px] items-center gap-6 bg-card p-2 md:grid-cols-[minmax(0,1.3fr)_minmax(0,0.35fr)_minmax(0,0.4fr)_minmax(0,0.35fr)_32px] md:gap-4 max-md:min-h-[96px] max-md:grid-cols-[clamp(64px,24vw,96px)_minmax(0,1fr)_68px] max-md:gap-x-2 max-md:gap-y-0 max-md:rounded-2xl max-md:p-2"
                      key={`${nft.name}-${nft.number}`}
                    >
                      <div className="flex min-w-0 items-center gap-4 max-md:col-span-2 max-md:gap-2">
                        <img
                          alt={`NFT ${nft.name} #${nft.number}`}
                          className="size-[70px] shrink-0 rounded-md object-cover max-md:size-[clamp(64px,24vw,96px)] max-md:rounded-2xl"
                          height="70"
                          src={nft.image}
                          width="70"
                        />
                        <div className="w-[154px] min-w-0 font-mono max-md:w-auto max-md:flex-1">
                          <h2 className="w-full truncate text-base font-bold leading-4 text-foreground max-md:text-sm max-md:leading-5">{nft.name} #{nft.number}</h2>
                          <p className="w-full truncate text-sm font-normal leading-4 text-secondary max-md:text-xs max-md:leading-4">
                            ID do token: #{nft.number.padStart(4, '0')}
                          </p>
                          <div className="mt-1 flex items-center gap-3 md:hidden">
                            <p className="min-w-0 truncate text-xs text-text-secondary max-md:text-lg max-md:font-bold max-md:leading-6 max-md:text-primary">{nft.price} ETH</p>
                            <button
                              aria-label={`Remover ${nft.name} #${nft.number}`}
                              className="flex size-6 shrink-0 items-center justify-center text-secondary hover:text-primary"
                              onClick={() => removeItem(index)}
                              type="button"
                            >
                              <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
                                <path d="M18.8894 9.55409C18.8894 17.5731 20.0437 21.1979 12.2799 21.1979C4.51515 21.1979 5.69324 17.5731 5.69324 9.55409M20.3653 6.47981H4.21484M15.7148 6.47981C15.7148 6.47981 16.2434 2.7141 12.2891 2.7141C8.33578 2.7141 8.86435 6.47981 8.86435 6.47981" stroke="#B39463" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      <span className="w-[77px] whitespace-nowrap font-mono text-base font-medium leading-4 text-text-secondary max-md:hidden">
                        {nft.price} ETH
                      </span>
                      <div aria-label={`Edições de ${nft.name} #${nft.number}`} className="flex items-center gap-[11px] max-md:hidden" role="group">
                        <button
                          aria-label={`Diminuir ${nft.name} #${nft.number}`}
                          className="flex h-[30px] w-[20px] items-center justify-center rounded-full border border-[#140D0A] bg-primary font-mono font-bold leading-4 text-primary-foreground disabled:opacity-50"
                          disabled={quantity <= 1}
                          onClick={() => changeQuantity(index, -1)}
                          type="button"
                        >
                          −
                        </button>
                        <span className="min-w-[11px] text-center font-mono text-[17px] font-normal leading-6 text-foreground">{quantity}</span>
                        <button
                          aria-label={`Aumentar ${nft.name} #${nft.number}`}
                          className="flex h-[30px] w-[20px] items-center justify-center rounded-full border border-[#140D0A] bg-primary font-mono font-bold leading-4 text-primary-foreground"
                          onClick={() => changeQuantity(index, 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      <span className="whitespace-nowrap font-mono text-base font-bold leading-4 text-primary max-md:hidden">
                        {itemTotal.toFixed(2)} ETH
                      </span>
                      <button
                        aria-label={`Remover ${nft.name} #${nft.number}`}
                        className="hidden size-6 -translate-x-6 items-center justify-self-center text-secondary hover:text-primary md:flex lg:-translate-x-10"
                        onClick={() => removeItem(index)}
                        type="button"
                      >
                        <svg aria-hidden="true" fill="none" height="24" viewBox="0 0 24 24" width="24">
                          <path d="M18.8894 9.55409C18.8894 17.5731 20.0437 21.1979 12.2799 21.1979C4.51515 21.1979 5.69324 17.5731 5.69324 9.55409M20.3653 6.47981H4.21484M15.7148 6.47981C15.7148 6.47981 16.2434 2.7141 12.2891 2.7141C8.33578 2.7141 8.86435 6.47981 8.86435 6.47981" stroke="#B39463" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                        </svg>
                      </button>
                      <div className="col-span-2 hidden items-center justify-between border-t border-border pt-2 max-md:col-span-1 max-md:col-start-3 max-md:row-start-1 max-md:flex max-md:h-full max-md:justify-center max-md:border-0 max-md:pt-0">
                        <div aria-label={`Edições de ${nft.name} #${nft.number}`} className="flex items-center gap-[11px] max-md:gap-1" role="group">
                          <button
                            aria-label={`Diminuir ${nft.name} #${nft.number}`}
                            className="flex h-[30px] w-[20px] items-center justify-center rounded-full border border-[#140D0A] bg-primary font-mono font-bold leading-4 text-primary-foreground disabled:opacity-50 max-md:size-6"
                            disabled={quantity <= 1}
                            onClick={() => changeQuantity(index, -1)}
                            type="button"
                          >
                            −
                          </button>
                          <span className="min-w-[11px] text-center font-mono text-[17px] font-normal leading-6 text-foreground max-md:text-sm max-md:leading-5">{quantity}</span>
                          <button
                            aria-label={`Aumentar ${nft.name} #${nft.number}`}
                            className="flex h-[30px] w-[20px] items-center justify-center rounded-full border border-[#140D0A] bg-primary font-mono font-bold leading-4 text-primary-foreground max-md:size-6"
                            onClick={() => changeQuantity(index, 1)}
                            type="button"
                          >
                            +
                          </button>
                        </div>
                        <span className="font-mono text-base font-bold leading-4 text-primary max-md:hidden">{itemTotal.toFixed(2)} ETH</span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </section>

          <aside aria-labelledby="cart-summary-title" className="font-mono md:max-xl:mx-auto md:max-xl:w-full md:max-xl:max-w-[580px] max-md:rounded-[32px] max-md:bg-card max-md:px-6 max-md:py-6">
            <h2 className="border-b border-border pb-2 text-lg font-bold text-foreground max-md:hidden" id="cart-summary-title">
              Resumo da carteira
            </h2>
            <label className="mt-5 block text-sm font-bold text-foreground max-md:sr-only" htmlFor="promo-code">
              Código promocional
            </label>
            <div className="mt-2 flex max-md:mt-0 max-md:h-[50px] max-md:overflow-hidden max-md:rounded-full max-md:border max-md:border-border max-md:bg-[#1C100C]">
              <input
                className="min-w-0 flex-1 rounded-l-sm border border-primary bg-background px-2 py-2 text-xs text-foreground placeholder:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary max-md:rounded-l-full max-md:border-0 max-md:bg-transparent max-md:px-4 max-md:text-[13px]"
                id="promo-code"
                onChange={(event) => setPromoCode(event.target.value)}
                placeholder="Digite o código promocional..."
                value={promoCode}
              />
              <button
                className="rounded-r-sm bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-primary-dark max-md:h-full max-md:rounded-full max-md:px-5"
                onClick={applyPromoCode}
                type="button"
              >
                Aplicar
              </button>
            </div>
            {promoApplied && <p className="mt-2 text-xs text-primary">Desconto de 10% aplicado.</p>}
            <dl className="mt-6 space-y-3 max-md:mt-3">
              <div className="flex h-5 items-center justify-between gap-3">
                <dt className="text-[15px] font-normal leading-[15px]">Subtotal</dt>
                <dd className="w-[98px] text-right text-lg font-normal leading-4 max-md:text-base max-md:leading-5">{subtotal.toFixed(2)} ETH</dd>
              </div>
              <div className="flex h-5 items-center justify-between gap-3">
                <dt className="text-[15px] font-normal leading-[15px]">Desconto do lançamento</dt>
                <dd className="w-[98px] whitespace-nowrap text-right text-lg font-normal leading-4 max-md:text-base max-md:leading-5">
                  (−) {discount.toFixed(2)}
                </dd>
              </div>
              <div className="flex h-5 items-center justify-between gap-3">
                <dt className="text-[15px] font-normal leading-[15px]">Taxa de rede</dt>
                <dd className="w-[98px] text-right text-lg font-normal leading-4 max-md:text-base max-md:leading-5">
                  {items.length ? NETWORK_FEE.toFixed(3) : '0.000'} ETH
                </dd>
              </div>
              <div className="flex justify-end max-md:-mt-2">
                <p className="w-[98px] text-right text-xs leading-4 text-primary">Taxa estimada</p>
              </div>
              <div className="flex items-center justify-between gap-3 pt-3">
                <dt className="text-[15px] font-bold leading-4">Total</dt>
                <dd className="w-[109px] text-right text-lg font-bold leading-4 text-primary max-md:text-lg max-md:leading-5">{total.toFixed(3)} ETH</dd>
              </div>
            </dl>
            <button
              className="mt-5 w-full rounded-sm bg-primary px-4 py-3 text-[15px] font-bold leading-4 text-[#140D0A] hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 max-md:h-[60px] max-md:rounded-full max-md:text-base"
              disabled={items.length === 0}
              onClick={() => void navigate({ to: '/checkout' })}
              type="button"
            >
              Conectar e finalizar
            </button>
            <a className="mt-4 block text-center text-[15px] font-normal leading-[15px] text-[#E89B55] hover:underline max-md:hidden" href="/#mercado">
              Continuar explorando
            </a>
          </aside>
        </div>

        <section aria-labelledby="cart-recommendations-title" className="mt-20 px-3">
          <h2
            className="border-b border-border pb-2 font-mono text-[17px] font-bold leading-4 text-primary"
            id="cart-recommendations-title"
          >
            Colecionadores também viram
          </h2>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-6 py-7 sm:grid-cols-3 lg:grid-cols-5">
            {recommendations.map((nft) => (
              <li className="min-w-0" key={`${nft.name}-${nft.number}`}>
                <a
                  aria-label={`Ver detalhes de ${nft.name} #${nft.number}`}
                  className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`/nft/${nft.name.toLowerCase().replaceAll(' ', '-')}-${nft.number}`}
                >
                  <div className="aspect-square overflow-hidden bg-card p-3">
                    <img
                      alt={`NFT ${nft.name} #${nft.number}`}
                      className="h-full w-full rounded-lg object-cover transition-transform group-hover:scale-[1.03]"
                      height="400"
                      loading="lazy"
                      src={nft.image}
                      width="400"
                    />
                  </div>
                  <h3 className="mt-2 truncate font-mono text-[15px] font-normal leading-5 text-foreground">
                    {nft.name} #{nft.number}
                  </h3>
                  <p className="font-mono text-base font-bold leading-4 text-[#E89B55]">{nft.price} ETH</p>
                </a>
              </li>
            ))}
          </ul>
          <div aria-label="Página 2 de 3" className="flex justify-center gap-2 pt-3">
            <span aria-hidden="true" className="size-2 rounded-full border border-primary" />
            <span aria-current="true" aria-label="Página atual" className="size-2 rounded-full bg-primary" />
            <span aria-hidden="true" className="size-2 rounded-full border border-primary" />
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  )
}
