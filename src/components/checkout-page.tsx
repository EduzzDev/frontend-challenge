import { useState, type FormEvent, type ReactNode } from 'react'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { getCartItems } from '@/lib/cart'

const NETWORK_FEE = 0.016
const inputClassName =
  'h-10 w-full rounded-[3px] border border-border bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary'
const labelClassName = 'mb-1 block font-mono text-[15px] font-normal leading-[15px] text-foreground'

function CheckoutField({
  children,
  label,
  required = false,
}: {
  children: ReactNode
  label: string
  required?: boolean
}) {
  return (
    <label className="block min-w-0">
      <span className={labelClassName}>
        {label}{required && <span className="text-primary"> *</span>}
      </span>
      {children}
    </label>
  )
}

export function CheckoutPage() {
  const items = getCartItems()
  const [wallet, setWallet] = useState('coinbase')
  const [useSecondaryWallet, setUseSecondaryWallet] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [confirmationMessage, setConfirmationMessage] = useState('')
  const subtotal = items.reduce((total, item) => total + Number(item.nft.price) * item.quantity, 0)
  const discount = promoApplied ? subtotal * 0.1 : 0
  const fee = items.length > 0 ? NETWORK_FEE : 0
  const total = subtotal - discount + fee

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setConfirmationMessage(`Dados validados. Conecte sua ${wallet} para confirmar a compra.`)
  }

  return (
    <>
      <HomeHeader activeHref="#mercado" navigationPrefix="/" />
      <main className="mx-auto w-full max-w-300 px-4 pb-16 md:px-0">
        <nav aria-label="Navegação estrutural" className="py-4 font-mono text-sm font-bold text-foreground">
          <a className="hover:text-primary" href="/#inicio">Início</a>
          <span aria-hidden="true" className="px-2">/</span>
          <a className="hover:text-primary" href="/#mercado">Mercado</a>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page">Pagamento</span>
        </nav>

        {items.length === 0 ? (
          <section className="py-12 font-mono">
            <h1 className="text-lg font-bold text-foreground">Seu carrinho está vazio</h1>
            <a className="mt-3 inline-block text-[15px] text-primary hover:underline" href="/#mercado">
              Voltar ao mercado
            </a>
          </section>
        ) : (
          <form className="grid items-start gap-8 font-mono lg:grid-cols-[minmax(0,1.9fr)_minmax(340px,1fr)]" onSubmit={handleSubmit}>
            <section aria-labelledby="collector-profile-title">
              <h1 className="mb-3 text-[17px] font-bold leading-5 text-foreground" id="collector-profile-title">
                Perfil do colecionador
              </h1>
              <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
                <CheckoutField label="Nome de exibição" required>
                  <input autoComplete="name" className={inputClassName} required />
                </CheckoutField>
                <CheckoutField label="Nome de usuário" required>
                  <input autoComplete="username" className={inputClassName} required />
                </CheckoutField>
                <CheckoutField label="Rede" required>
                  <select className={`${inputClassName} text-secondary`} defaultValue="" required>
                    <option disabled value="">Selecione uma rede</option>
                    <option>Ethereum</option>
                    <option>Polygon</option>
                    <option>Solana</option>
                  </select>
                </CheckoutField>
                <CheckoutField label="Nome do perfil" required>
                  <input className={inputClassName} required />
                </CheckoutField>
                <CheckoutField label="Endereço da carteira" required>
                  <input autoComplete="off" className={inputClassName} placeholder="Endereço 0x da carteira" required />
                </CheckoutField>
                <CheckoutField label="ENS ou carteira secundária (opcional)">
                  <input autoComplete="off" className={inputClassName} placeholder="ENS ou carteira secundária (opcional)" />
                </CheckoutField>
                <CheckoutField label="Tipo de carteira" required>
                  <select className={`${inputClassName} text-secondary`} defaultValue="" required>
                    <option disabled value="">Selecione uma carteira</option>
                    <option>Carteira própria</option>
                    <option>Carteira de hardware</option>
                    <option>Carteira de exchange</option>
                  </select>
                </CheckoutField>
                <CheckoutField label="Código de indicação" required>
                  <input className={inputClassName} required />
                </CheckoutField>
                <CheckoutField label="E-mail" required>
                  <input autoComplete="email" className={inputClassName} required type="email" />
                </CheckoutField>
                <CheckoutField label="Nome ENS" required>
                  <div className="w-20">
                    <select aria-label="Nome ENS" className={`${inputClassName} px-2 text-secondary`} defaultValue=".eth" required>
                      <option>.eth</option>
                    </select>
                  </div>
                </CheckoutField>
              </div>

              <label className="mt-5 inline-flex cursor-pointer items-center gap-2 font-mono text-[15px] leading-5 text-foreground">
                <input
                  checked={useSecondaryWallet}
                  className="size-4 accent-primary"
                  onChange={(event) => setUseSecondaryWallet(event.target.checked)}
                  type="checkbox"
                />
                Usar outra carteira?
              </label>
              {useSecondaryWallet && (
                <div className="mt-3 max-w-[350px]">
                  <CheckoutField label="Endereço da outra carteira" required>
                    <input autoComplete="off" className={inputClassName} placeholder="Endereço 0x da carteira" required />
                  </CheckoutField>
                </div>
              )}

              <label className="mt-5 block max-w-[350px] font-mono text-[15px] leading-5 text-foreground" htmlFor="collector-note">
                Observação do colecionador (opcional)
                <textarea
                  className="mt-1 min-h-[152px] w-full resize-y rounded-[3px] border border-border bg-transparent p-3 font-mono text-sm leading-5 text-foreground outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
                  id="collector-note"
                />
              </label>
            </section>

            <aside aria-labelledby="checkout-items-title">
              <h2 className="mb-2 text-[17px] font-bold leading-5 text-foreground" id="checkout-items-title">
                Seus NFTs
              </h2>
              <div className="flex items-center justify-between border-b border-border pb-2 font-mono text-base font-medium leading-4 text-foreground">
                <span>NFTs</span>
                <span>Subtotal</span>
              </div>
              <ul aria-label="NFTs para pagamento" className="mt-3 flex flex-col gap-3">
                {items.map(({ nft, quantity }) => (
                  <li className="flex min-w-0 items-center gap-2 bg-card p-2" key={`${nft.name}-${nft.number}`}>
                    <img
                      alt={`NFT ${nft.name} #${nft.number}`}
                      className="size-[70px] shrink-0 rounded-md object-cover"
                      height="70"
                      src={nft.image}
                      width="70"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-base font-bold leading-4 text-foreground">{nft.name} #{nft.number}</h3>
                      <p className="truncate text-sm font-normal leading-4 text-secondary">ID do token: #{nft.number.padStart(4, '0')}</p>
                    </div>
                    <span className="shrink-0 text-[17px] font-normal leading-6 text-secondary">(x {quantity})</span>
                    <span className="shrink-0 text-base font-bold leading-4 text-primary">
                      {(Number(nft.price) * quantity).toFixed(2)} ETH
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-3 text-right">
                <button
                  className="font-mono text-sm leading-5 text-foreground hover:text-primary"
                  onClick={() => setShowPromoInput((current) => !current)}
                  type="button"
                >
                  Tem um código promocional? Aplique aqui
                </button>
                {showPromoInput && (
                  <div className="mt-2 flex">
                    <input
                      aria-label="Código promocional"
                      className={`${inputClassName} min-w-0 rounded-r-none`}
                      onChange={(event) => setPromoCode(event.target.value)}
                      value={promoCode}
                    />
                    <button
                      className="shrink-0 rounded-r-sm bg-primary px-3 font-mono text-sm font-bold text-primary-foreground"
                      onClick={() => setPromoApplied(promoCode.trim().length > 0)}
                      type="button"
                    >
                      Aplicar
                    </button>
                  </div>
                )}
                {promoApplied && <p className="mt-1 text-xs text-primary">Desconto de 10% aplicado.</p>}
              </div>

              <dl className="mt-3 space-y-2 font-mono">
                <div className="flex h-6 items-center justify-between text-[15px] leading-5">
                  <dt>Subtotal</dt><dd className="text-lg leading-5">{subtotal.toFixed(2)} ETH</dd>
                </div>
                <div className="flex h-6 items-center justify-between text-[15px] leading-5">
                  <dt>Desconto do lançamento</dt><dd className="text-lg leading-5">(−) {discount.toFixed(2)}</dd>
                </div>
                <div className="flex h-6 items-center justify-between text-[15px] leading-5">
                  <dt>Taxa de rede</dt><dd className="text-lg leading-5">{fee.toFixed(3)} ETH</dd>
                </div>
                <p className="text-right text-xs leading-4 text-primary">Taxa estimada</p>
                <div className="flex items-center justify-between border-t border-border pt-2 text-[15px] font-bold leading-5">
                  <dt className="pl-8">Total</dt><dd className="pr-8 text-lg leading-5 text-primary">{total.toFixed(3)} ETH</dd>
                </div>
              </dl>

              <fieldset aria-label="Carteira e rede" className="mt-4 space-y-4">
                <legend className="mb-3 w-full text-center text-[17px] font-bold leading-4 text-foreground">Carteira e rede</legend>
                {[
                  { id: 'integrated', label: 'METAMASK · WALLETCONNECT · COINBASE' },
                  { id: 'metamask', label: 'MetaMask' },
                  { id: 'coinbase', label: 'Coinbase Wallet' },
                ].map((option) => (
                  <label
                    className={`flex h-11 cursor-pointer items-center gap-3 rounded-[3px] border px-3 font-mono text-[15px] font-normal leading-5 text-foreground transition-colors ${
                      wallet === option.id ? 'border-primary' : 'border-border'
                    }`}
                    key={option.id}
                  >
                    <input
                      checked={wallet === option.id}
                      className="size-4 accent-primary"
                      name="payment-wallet"
                      onChange={() => setWallet(option.id)}
                      type="radio"
                      value={option.id}
                    />
                    {option.id === 'integrated' ? (
                      <span className="inline-flex h-3 w-[215px] items-center justify-center whitespace-nowrap rounded-md border border-[#633B1D] bg-[#2D1A10] px-2 font-mono text-[9px] font-bold leading-[9px] tracking-[0.1px] text-primary">
                        {option.label}
                      </span>
                    ) : (
                      <span>{option.label}</span>
                    )}
                  </label>
                ))}
              </fieldset>
              <button
                className="mt-6 h-11 w-full rounded-md bg-primary px-4 font-mono text-[15px] font-bold leading-4 text-[#140D0A] transition-colors hover:bg-primary-dark"
                type="submit"
              >
                Confirmar compra
              </button>
              {confirmationMessage && (
                <p aria-live="polite" className="mt-3 text-center text-sm leading-5 text-text-secondary">
                  {confirmationMessage}
                </p>
              )}
            </aside>
          </form>
        )}
      </main>
      <HomeFooter />
    </>
  )
}
