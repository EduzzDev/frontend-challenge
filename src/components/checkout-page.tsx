import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createOrder, getOrder, getQuote } from '@/api/orders'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { useCart, useCurrentUserKey } from '@/hooks/use-cart'
import { useSession } from '@/hooks/use-session'
import { fromUnits, toUnits } from '@/lib/money'
import type { Order } from '@/types/domain'
import { createId } from '@/lib/id'

const inputClassName =
  'h-10 w-full max-w-[420px] rounded-[3px] border border-border bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary'
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

function ThankYouIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="80" viewBox="0 0 66 80" width="66">
      <path d="M29.28 25.9317C29.884 26.1624 30.5617 25.8588 30.7922 25.2536L31.1851 24.2217H33.9576L34.3458 25.2503C34.5228 25.7195 34.9687 26.0088 35.4423 26.0088C35.5798 26.0088 35.7197 25.9844 35.8559 25.933C36.4614 25.7045 36.767 25.0284 36.5384 24.4228L33.8309 17.2483C33.827 17.2378 33.8228 17.227 33.8186 17.2167C33.6117 16.7133 33.1264 16.3881 32.5822 16.3881C32.5819 16.3881 32.5815 16.3881 32.5812 16.3881C32.0365 16.3884 31.5512 16.7144 31.345 17.2183C31.3414 17.2273 31.3376 17.2361 31.3344 17.2453L28.602 24.4195C28.3715 25.0242 28.6751 25.7013 29.28 25.9317V25.9317ZM33.0731 21.8781H32.0778L32.5776 20.5656L33.0731 21.8781Z" fill="#D28A4C"/>
      <path d="M38.9121 26.0085C39.5595 26.0085 40.084 25.4839 40.084 24.8366V21.3327L42.8588 25.3508C43.1926 25.8333 43.7537 26.0377 44.2884 25.8708C44.8319 25.7013 45.183 25.1989 45.183 24.58L45.1151 17.5486C45.1088 16.9053 44.5854 16.388 43.9435 16.388C43.9396 16.388 43.9357 16.388 43.932 16.388C43.2846 16.3942 42.7651 16.9241 42.7713 17.5711L42.806 21.1497L39.8765 16.9075C39.5851 16.4855 39.0535 16.3024 38.5634 16.4547C38.0738 16.6074 37.7402 17.0606 37.7402 17.5735V24.8364C37.7402 25.4839 38.2648 26.0085 38.9121 26.0085Z" fill="#D28A4C"/>
      <path d="M47.8302 26.0084C48.4776 26.0084 49.0021 25.4839 49.0021 24.8366V23.5698L51.1893 25.68C51.4167 25.8994 51.7099 26.0086 52.0028 26.0086C52.3098 26.0086 52.6163 25.8886 52.8462 25.6503C53.2956 25.1847 53.2823 24.4427 52.8165 23.9934L49.7724 21.0564L52.5376 18.5145C53.0142 18.0766 53.0454 17.3352 52.6073 16.8587C52.1695 16.3822 51.4279 16.3511 50.9515 16.7891L49.002 18.5809V17.56C49.002 16.9127 48.4774 16.3881 47.8301 16.3881C47.1827 16.3881 46.6582 16.9127 46.6582 17.56V24.8366C46.6584 25.4839 47.1829 26.0084 47.8302 26.0084V26.0084Z" fill="#D28A4C"/>
      <path d="M20.9902 26.0084C21.6376 26.0084 22.1621 25.4839 22.1621 24.8366V22.2453H24.854V24.8366C24.854 25.4839 25.3785 26.0084 26.0259 26.0084C26.6732 26.0084 27.1977 25.4839 27.1977 24.8366V17.56C27.1977 16.9127 26.6732 16.3881 26.0259 16.3881C25.3785 16.3881 24.854 16.9127 24.854 17.56V19.9016H22.1621V17.56C22.1621 16.9127 21.6376 16.3881 20.9902 16.3881C20.3429 16.3881 19.8184 16.9127 19.8184 17.56V24.8366C19.8184 25.4839 20.3429 26.0084 20.9902 26.0084Z" fill="#D28A4C"/>
      <path d="M18.2334 31.64L20.3662 34.9061L20.3579 38.273C20.3564 38.9203 20.8798 39.4463 21.5268 39.4478H21.5298C22.1757 39.4478 22.7001 38.925 22.7017 38.2789L22.7099 34.908L24.826 31.657C25.1792 31.1145 25.0257 30.3886 24.4834 30.0356C23.941 29.6822 23.2149 29.8359 22.862 30.3783L21.5373 32.4131L20.1956 30.3586C19.8417 29.8166 19.1159 29.6645 18.5737 30.0181C18.032 30.372 17.8793 31.0981 18.2334 31.64V31.64Z" fill="#D28A4C"/>
      <path d="M36.3097 36.0064C36.3097 37.1997 36.8758 38.1662 37.9924 38.8798C38.5808 39.2556 39.2438 39.4467 39.963 39.4478H39.9685C40.5858 39.4478 41.1663 39.3133 41.6938 39.0475C42.9938 38.3928 43.7097 37.3109 43.7097 36.0011V30.9992C43.7097 30.3519 43.1852 29.8273 42.5379 29.8273C41.8905 29.8273 41.366 30.3519 41.366 30.9992V36.0011C41.366 36.3061 41.278 36.6326 40.6396 36.9542C40.4394 37.0551 40.2199 37.104 39.9686 37.104C39.9679 37.104 39.9669 37.104 39.9661 37.104C39.6963 37.1037 39.4633 37.0384 39.2541 36.9048C38.6993 36.5503 38.6533 36.2776 38.6533 36.0065V30.9994C38.6533 30.352 38.1288 29.8275 37.4814 29.8275C36.8341 29.8275 36.3096 30.352 36.3096 30.9994V36.0064H36.3097Z" fill="#D28A4C"/>
      <path d="M13.3447 18.7319H14.1741V24.8366C14.1741 25.4839 14.6986 26.0084 15.346 26.0084C15.9933 26.0084 16.5179 25.4839 16.5179 24.8366V18.7319H17.3633C18.0107 18.7319 18.5352 18.2073 18.5352 17.56C18.5352 16.9127 18.0107 16.3881 17.3633 16.3881H13.3447C12.6974 16.3881 12.1729 16.9127 12.1729 17.56C12.1729 18.2073 12.6974 18.7319 13.3447 18.7319V18.7319Z" fill="#D28A4C"/>
      <path d="M30.2125 29.8275C27.5602 29.8275 25.4023 31.9855 25.4023 34.6377C25.4023 37.2898 27.5603 39.4478 30.2125 39.4478C32.865 39.4478 35.0228 37.2898 35.0228 34.6377C35.0228 31.9855 32.8648 29.8275 30.2125 29.8275ZM30.2125 37.1041C28.8525 37.1041 27.7461 35.9977 27.7461 34.6377C27.7461 33.2777 28.8525 32.1712 30.2125 32.1712C31.5725 32.1712 32.6791 33.2777 32.6791 34.6377C32.6791 35.9977 31.5725 37.1041 30.2125 37.1041Z" fill="#D28A4C"/>
      <path d="M63.3789 28.0734L59.9291 24.4797V9.46422C59.9291 7.37484 58.2292 5.67484 56.1397 5.67484H41.8753C41.8717 5.67109 41.8687 5.66687 41.8652 5.66313L39.0922 2.77469C37.3744 0.985469 35.0623 0 32.582 0C30.1017 0 27.7897 0.985469 26.072 2.77469L23.2877 5.675H9.02438C6.93484 5.675 5.235 7.375 5.235 9.46437V24.48L1.78516 28.0734C0.634063 29.2725 0 30.8483 0 32.5103V76.2106C0 78.3002 1.7 80 3.78937 80H61.3745C63.4639 80 65.1639 78.3002 65.1639 76.2106V32.5103C65.1639 30.8483 64.53 29.2725 63.3789 28.0734V28.0734ZM61.6881 29.6967C62.4181 30.457 62.8202 31.4564 62.8202 32.5105V35.168L59.9289 38.1797V27.8641L61.6881 29.6967ZM27.7627 4.39781C29.0344 3.07328 30.7458 2.34375 32.582 2.34375C34.4183 2.34375 36.1297 3.07328 37.4014 4.39781L38.6273 5.67484H26.5367L27.7627 4.39781ZM9.02438 8.01859H56.1395C56.9367 8.01859 57.5852 8.66703 57.5852 9.46422V40.6209L45.1459 53.5784L39.0919 47.2722C37.3742 45.483 35.0622 44.4975 32.5819 44.4975C30.1016 44.4975 27.7895 45.483 26.0719 47.2722L20.0178 53.5784L7.57859 40.6209V9.46422C7.57875 8.66719 8.22734 8.01859 9.02438 8.01859V8.01859ZM18.3936 55.2706L2.34391 71.9891V38.5522L18.3936 55.2706ZM2.34391 32.5103C2.34391 31.4562 2.74594 30.4569 3.47594 29.6966L5.23516 27.8641V38.1794L2.34391 35.1677V32.5103ZM61.3745 77.6562H3.78953C2.99234 77.6562 2.34391 77.0078 2.34391 76.2106V75.3733L27.7628 48.8953C29.0345 47.5706 30.7459 46.8412 32.5822 46.8412C34.4184 46.8412 36.1298 47.5708 37.4016 48.8953L46.8138 58.6997C47.262 59.1667 48.0037 59.1814 48.4706 58.7334C48.9373 58.2853 48.9527 57.5434 48.5044 57.0766L46.7706 55.2706L62.8203 38.5522V71.9891L52.2734 61.0028C51.8252 60.5359 51.0834 60.5209 50.6166 60.9691C50.1498 61.4172 50.1345 62.1591 50.5828 62.6259L62.8203 75.3733V76.2105C62.8202 77.0078 62.1717 77.6562 61.3745 77.6562V77.6562Z" fill="#D28A4C"/>
    </svg>
  )
}

type ReceiptData = { date: string; network: string; wallet: string; order: Order }

function PurchaseReceipt({ receipt }: { receipt: ReceiptData }) {
  const { order } = receipt
  const total = fromUnits(toUnits(order.quote.total), 3)
  const networkFee = fromUnits(toUnits(order.quote.networkFee), 3)

  return (
    <section
      aria-labelledby="purchase-confirmation-title"
      aria-live="polite"
      className="mx-auto mt-6 w-full max-w-[578px] overflow-hidden bg-surface-card font-mono max-md:mt-3 max-md:rounded-2xl"
    >
      <div className="relative flex flex-col items-center border-b border-primary px-5 pb-3 pt-4 text-center">
        <a aria-label="Fechar confirmação" className="absolute right-4 top-3 text-primary hover:text-foreground" href="/#mercado">
          <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
            <path d="m4 4 8 8m0-8-8 8" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
          </svg>
        </a>
        <ThankYouIcon />
        <h1 className="mt-2 text-[15px] font-bold leading-4 text-text-secondary md:text-base md:leading-5" id="purchase-confirmation-title">
          Seus NFTs foram adicionados ao pedido
        </h1>
      </div>

      <dl aria-label="Dados do pedido" className="grid grid-cols-2 divide-x divide-y divide-border border-b border-primary sm:grid-cols-4 sm:divide-y-0">
        <div className="min-w-0 px-3 py-3 sm:px-3 sm:py-2">
          <dt className="text-xs font-bold leading-4 text-text-secondary md:text-sm">ID da transação</dt>
          <dd className="mt-0.5 truncate font-mono text-sm leading-5 text-text-secondary md:text-[15px] md:leading-[15px]">{order.transaction.id}</dd>
        </div>
        <div className="min-w-0 px-3 py-3 sm:px-3 sm:py-2">
          <dt className="text-xs leading-4 text-text-secondary md:text-sm">Data</dt>
          <dd className="mt-0.5 whitespace-nowrap font-mono text-sm leading-5 text-text-secondary md:text-[15px] md:leading-[15px]">{receipt.date}</dd>
        </div>
        <div className="min-w-0 px-3 py-3 sm:px-3 sm:py-2">
          <dt className="text-xs leading-4 text-text-secondary md:text-sm">Total</dt>
          <dd className="mt-0.5 whitespace-nowrap font-mono text-sm leading-5 text-text-secondary md:text-[15px] md:leading-[15px]">{total} ETH</dd>
        </div>
        <div className="min-w-0 px-3 py-3 sm:px-3 sm:py-2">
          <dt className="text-xs leading-4 text-text-secondary md:text-sm">Carteira</dt>
          <dd className="mt-0.5 truncate font-mono text-sm leading-5 text-text-secondary md:text-[15px] md:leading-[15px]">{receipt.wallet}</dd>
        </div>
      </dl>

      <div className="px-4 py-5 sm:px-10 sm:py-4">
        <h2 className="text-base font-bold leading-5 text-foreground md:text-[15px] md:leading-4">Detalhes da transação</h2>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_68px_77px] items-center border-b border-border pb-2 text-base font-bold leading-4 text-foreground max-md:hidden md:grid-cols-[minmax(0,1fr)_68px_68px_77px]">
          <span>NFTs</span><span className="w-[68px] text-center">Edições</span><span aria-hidden="true" /><span className="w-[77px] text-right">Subtotal</span>
        </div>
        <ul aria-label="NFTs do pedido" className="mt-1 divide-y divide-border max-md:hidden">
          {order.items.map((item) => (
            <li className="grid min-w-0 grid-cols-[minmax(0,1fr)_68px_77px] items-center py-2 md:grid-cols-[minmax(0,1fr)_68px_68px_77px]" key={item.nft.id}>
              <div className="flex min-w-0 items-center gap-2">
                <img alt={`NFT ${item.nft.name} #${item.nft.number}`} className="size-[70px] shrink-0 rounded-md object-cover" height="70" src={item.nft.image} width="70" />
                <div className="min-w-0"><h3 className="truncate text-base font-bold leading-4 text-foreground">{item.nft.name} #{item.nft.number}</h3><p className="truncate text-sm leading-4 text-secondary">ID do token: #{item.nft.number.padStart(4, '0')}</p></div>
              </div>
              <span className="w-[68px] text-center text-[15px] text-text-secondary">(x {item.quantity})</span>
              <span aria-hidden="true" />
              <span className="w-[77px] whitespace-nowrap text-right text-base font-bold leading-4 text-primary">{fromUnits(toUnits(item.subtotal), 2)} ETH</span>
            </li>
          ))}
        </ul>
        <ul aria-label="NFTs do pedido" className="hidden flex-col divide-y divide-border max-md:flex">
          {order.items.map((item) => (
            <li className="grid grid-cols-[56px_minmax(0,1fr)] gap-x-3 py-3" key={item.nft.id}>
              <img alt={`NFT ${item.nft.name} #${item.nft.number}`} className="row-span-2 size-14 rounded-lg object-cover" height="56" src={item.nft.image} width="56" />
              <div className="min-w-0 self-center"><h3 className="truncate text-sm font-bold leading-5 text-foreground">{item.nft.name} #{item.nft.number}</h3><p className="truncate text-xs leading-4 text-secondary">ID do token: #{item.nft.number.padStart(4, '0')}</p></div>
              <div className="flex min-w-0 items-center justify-between gap-2"><span className="text-xs leading-4 text-text-secondary">Edições (x {item.quantity})</span><span className="shrink-0 text-sm font-bold leading-5 text-primary">{fromUnits(toUnits(item.subtotal), 2)} ETH</span></div>
            </li>
          ))}
        </ul>

        <dl className="mt-3 space-y-1 border-t border-border pt-2 text-sm leading-4">
          <div className="flex items-center justify-between"><dt className="font-mono text-[15px] leading-5 text-foreground">Taxa de rede</dt><dd className="font-mono text-[15px] leading-5 text-foreground">{networkFee} ETH</dd></div>
          <div className="flex items-center justify-between font-bold"><dt className="font-mono text-base leading-4 text-foreground">Total</dt><dd className="font-mono text-base leading-4 text-primary">{total} ETH</dd></div>
        </dl>
        <p className="mt-3 min-h-[66px] border-t border-border pt-3 text-center font-mono text-sm leading-[22px] text-text-secondary">
          Prévia demonstrativa na rede {receipt.network}. Nenhuma transação real foi enviada e nenhum NFT foi transferido.
        </p>
        <button className="mx-auto mt-4 flex h-10 w-[154px] items-center justify-center rounded-md bg-primary font-mono text-base font-bold leading-4 text-[#140D0A]" disabled title="A transação demonstrativa não possui link no Etherscan." type="button">
          Ver no Etherscan
        </button>
      </div>
      <div aria-hidden="true" className="h-1.5 bg-primary" />
    </section>
  )
}

export function CheckoutPage() {
  const { cart, isPending: cartPending } = useCart()
  const { session, isLoading: sessionLoading } = useSession()
  const hasSessionToken = Boolean(window.localStorage.getItem('kurio-session-token'))
  const items = cart?.items ?? []
  const userId = useCurrentUserKey()
  const queryClient = useQueryClient()
  const [wallet, setWallet] = useState('coinbase')
  const [activeAccount, setActiveAccount] = useState<'reserve' | 'main'>('reserve')
  const [useSecondaryWallet, setUseSecondaryWallet] = useState(false)
  const [showPromoInput, setShowPromoInput] = useState(false)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [couponRemoved, setCouponRemoved] = useState(false)
  const activeCoupon = promoApplied ? promoCode.trim().toUpperCase() : couponRemoved ? undefined : cart?.coupon?.code
  const [purchaseConfirmed, setPurchaseConfirmed] = useState(false)
  const [receipt, setReceipt] = useState<ReceiptData | null>(null)
  const [purchaseError, setPurchaseError] = useState('')
  const quoteQuery = useQuery({
    queryKey: ['quote', userId, activeCoupon ?? ''],
    queryFn: () => getQuote(activeCoupon),
    enabled: items.length > 0,
  })
  const lastOrderId = window.localStorage.getItem('kurio-last-order-id')
  const savedOrderQuery = useQuery({
    queryKey: ['order', lastOrderId],
    queryFn: () => getOrder(lastOrderId!),
    enabled: !items.length && Boolean(lastOrderId && hasSessionToken),
  })
  const quote = quoteQuery.data
  const subtotal = quote?.subtotal ?? '0.00'
  const discount = quote?.discount ?? '0.00'
  const fee = quote?.networkFee ?? '0.000'
  const total = quote?.total ?? '0.00'
  const orderMutation = useMutation({
    mutationFn: (input: { walletId: string; quoteVersion: string; idempotencyKey: string }) =>
      createOrder({ walletId: input.walletId, quoteVersion: input.quoteVersion, coupon: activeCoupon }, input.idempotencyKey),
    onSuccess: (order) => {
      queryClient.setQueryData(['order', order.id], order)
      void queryClient.invalidateQueries({ queryKey: ['cart', userId] })
      void queryClient.invalidateQueries({ queryKey: ['orders', userId] })
    },
  })

  useEffect(() => {
    const order = savedOrderQuery.data
    if (order?.status === 'confirmed') {
      setReceipt({
        date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(order.createdAt)),
        network: order.transaction.network,
        wallet: order.transaction.walletId,
        order,
      })
      setPurchaseConfirmed(true)
    }
  }, [savedOrderQuery.data])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (orderMutation.isPending || !items.length) return
    setPurchaseError('')
    const pendingAttempt = window.localStorage.getItem('kurio-pending-order-attempt')
    let attempt: { idempotencyKey: string; walletId: string; quoteVersion: string }
    if (pendingAttempt) {
      try { attempt = JSON.parse(pendingAttempt) as typeof attempt } catch { window.localStorage.removeItem('kurio-pending-order-attempt'); return }
    } else {
      const latestQuote = await quoteQuery.refetch()
      if (!latestQuote.data) {
        setPurchaseError(latestQuote.error instanceof Error ? latestQuote.error.message : 'Não foi possível validar a cotação.')
        return
      }
      attempt = {
        idempotencyKey: createId(),
        walletId: `${userId}-wallet-${wallet === 'metamask' ? 'reserve' : 'main'}`,
        quoteVersion: latestQuote.data.version,
      }
      window.localStorage.setItem('kurio-pending-order-attempt', JSON.stringify(attempt))
    }
    try {
      const order = await orderMutation.mutateAsync(attempt)
      if (order.status !== 'confirmed') {
        setPurchaseError('O pagamento foi recusado. Seus itens continuam no carrinho.')
        window.localStorage.removeItem('kurio-pending-order-attempt')
        return
      }
      window.localStorage.removeItem('kurio-pending-order-attempt')
      window.localStorage.setItem('kurio-last-order-id', order.id)
      setReceipt({
        date: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(order.createdAt)),
        network: order.transaction.network,
        wallet: wallet === 'metamask' ? 'MetaMask' : wallet === 'coinbase' ? 'Coinbase Wallet' : 'WalletConnect',
        order,
      })
      setPurchaseConfirmed(true)
    } catch (error) {
      setPurchaseError(error instanceof Error ? error.message : 'Não foi possível confirmar o pedido. Tente novamente.')
    }
  }

  return (
    <>
      <HomeHeader activeHref="#mercado" mobileBrand={false} mobileNavigation={false} navigationPrefix="/" />
      <main className="mx-auto w-full max-w-300 px-4 pb-16 md:px-6 xl:px-0 max-md:p-0">
        <nav aria-label="Navegação estrutural" className="py-4 font-mono text-sm font-bold text-foreground max-md:hidden">
          <a className="hover:text-primary" href="/#inicio">Início</a>
          <span aria-hidden="true" className="px-2">/</span>
          <a className="hover:text-primary" href="/#mercado">Mercado</a>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page">Pagamento</span>
        </nav>

        {!hasSessionToken ? (
          <section className="mx-auto max-w-2xl rounded-xl bg-card p-8 font-mono">
            <h1 className="text-xl font-bold">Entre para continuar com o pagamento</h1>
            <p className="mt-3 text-sm text-text-secondary">Abra Entrar no cabeçalho para autenticar; os itens do carrinho serão preservados.</p>
          </section>
        ) : sessionLoading ? (
          <p aria-live="polite" className="py-12 font-mono text-sm text-text-secondary">Validando sessão…</p>
        ) : !session ? (
          <section className="mx-auto max-w-2xl rounded-xl bg-card p-8 font-mono"><h1 className="text-xl font-bold">Sua sessão expirou</h1><p className="mt-3 text-sm text-text-secondary">Entre novamente para continuar. Seus itens continuam salvos no carrinho.</p></section>
        ) : purchaseConfirmed && receipt ? (
          <PurchaseReceipt receipt={receipt} />
        ) : cartPending ? (
          <p aria-live="polite" className="py-12 font-mono text-sm text-text-secondary">Carregando carrinho e cotação…</p>
        ) : items.length === 0 ? (
          <section className="py-12 font-mono">
            <h1 className="text-lg font-bold text-foreground">Seu carrinho está vazio</h1>
            <a className="mt-3 inline-block text-[15px] text-primary hover:underline" href="/#mercado">
              Voltar ao mercado
            </a>
          </section>
        ) : (
          <>
          <form className="grid items-start gap-8 font-mono lg:grid-cols-[minmax(0,1.9fr)_minmax(340px,1fr)] max-md:hidden" onSubmit={handleSubmit}>
            {(purchaseError || quoteQuery.error) && <p className="col-span-full" role="alert">{purchaseError || (quoteQuery.error instanceof Error ? quoteQuery.error.message : 'Falha na cotação.')}</p>}
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
                  <select className={`${inputClassName} text-secondary`} defaultValue="" name="network" required>
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
                  <select className={`${inputClassName} text-secondary`} defaultValue="" name="walletType" required>
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

              <label className="mt-3 inline-flex cursor-pointer items-center gap-2 font-mono text-[15px] leading-5 text-foreground">
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
                      {fromUnits(toUnits(nft.price) * BigInt(quantity), 2)} ETH
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
                      value={promoCode || cart?.coupon?.code || ''}
                    />
                    <button
                      className="shrink-0 rounded-r-sm bg-primary px-3 font-mono text-sm font-bold text-primary-foreground"
                      onClick={() => {
                        if (activeCoupon) { setPromoApplied(false); setCouponRemoved(true) }
                        else { setCouponRemoved(false); setPromoApplied(promoCode.trim().length > 0) }
                      }}
                      type="button"
                    >
                      {activeCoupon ? 'Remover' : 'Aplicar'}
                    </button>
                  </div>
                )}
                {quoteQuery.error && <p className="mt-1 text-xs text-primary" role="alert">{quoteQuery.error.message}</p>}
                {quote?.discount !== '0.00000000' && quote && <p className="mt-1 text-xs text-primary">Desconto de {activeCoupon} aplicado.</p>}
              </div>

              <dl className="mt-3 space-y-2 font-mono">
                <div className="flex h-6 items-center justify-between text-[15px] leading-5">
                  <dt>Subtotal</dt><dd className="text-lg leading-5">{subtotal} ETH</dd>
                </div>
                <div className="flex h-6 items-center justify-between text-[15px] leading-5">
                  <dt>Desconto do lançamento</dt><dd className="text-lg leading-5">(−) {discount} ETH</dd>
                </div>
                <div className="flex h-6 items-center justify-between text-[15px] leading-5">
                  <dt>Taxa de rede</dt><dd className="text-lg leading-5">{fee} ETH</dd>
                </div>
                <p className="text-right text-xs leading-4 text-primary">Taxa estimada</p>
                <div className="flex items-center justify-between border-t border-border pt-2 text-[15px] font-bold leading-5">
                  <dt className="pl-8">Total</dt><dd className="pr-8 text-lg leading-5 text-primary">{total} ETH</dd>
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
                disabled={orderMutation.isPending || !quote}
                className="mt-6 h-11 w-full rounded-md bg-primary px-4 font-mono text-[15px] font-bold leading-4 text-[#140D0A] transition-colors hover:bg-primary-dark"
                type="submit"
              >
                Confirmar compra
              </button>
            </aside>
          </form>
          <form className="relative min-h-[calc(100dvh-24px)] rounded-b-[28px] bg-background px-[13px] pb-24 pt-3 font-mono md:hidden" onSubmit={handleSubmit}>
            <input name="network" type="hidden" value="Polygon" />
            <header className="mb-4 flex h-8 items-center gap-4">
              <a aria-label="Voltar ao carrinho" className="flex size-6 items-center justify-center rounded-full bg-card text-secondary" href="/cart">
                <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 16 16" width="14">
                  <path d="m10 3-5 5 5 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </a>
              <h1 className="text-xl font-bold leading-4 text-foreground max-[360px]:text-base">Pagamento com carteira</h1>
            </header>
            {(purchaseError || quoteQuery.error) && <p className="mb-3 text-xs text-primary" role="alert">{purchaseError || quoteQuery.error?.message}</p>}

            <section aria-labelledby="connected-wallet-title">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-bold leading-4 text-foreground" id="connected-wallet-title">Carteira conectada</h2>
                <button className="text-sm font-bold leading-4 text-primary max-[360px]:text-xs" onClick={() => setActiveAccount((current) => current === 'reserve' ? 'main' : 'reserve')} type="button">Trocar carteira</button>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { id: 'reserve' as const, title: 'Reserva', address: 'nova.kurio.eth', network: 'Rede Polygon' },
                  { id: 'main' as const, title: 'Principal', address: '0xA91F...E82C', network: 'Rede principal Ethereum' },
                ].map((account) => (
                  <button
                    aria-pressed={activeAccount === account.id}
                    className="flex h-[93px] w-full items-center gap-3 rounded-xl bg-card px-3 py-2 text-left"
                    key={account.id}
                    onClick={() => setActiveAccount(account.id)}
                    type="button"
                  >
                    <span aria-hidden="true" className={`flex size-[11px] shrink-0 items-center justify-center rounded-full border ${activeAccount === account.id ? 'border-primary' : 'border-[#633B1D]'}`}>
                      {activeAccount === account.id && <span className="size-[5px] rounded-full bg-primary" />}
                    </span>
                    <span className="min-w-0 flex-1 pl-1">
                      <span className="block text-base font-bold leading-4 text-foreground">{account.title}</span>
                      <span className="block truncate text-sm leading-[22px] text-secondary">{account.address}</span>
                      <span className="block truncate text-sm leading-[22px] text-secondary">{account.network}</span>
                    </span>
                    <span aria-hidden="true" className="px-1 text-sm leading-4 text-secondary">⋮</span>
                  </button>
                ))}
              </div>
            </section>

            <fieldset aria-label="Carteira e rede" className="mt-4">
              <legend className="mb-2 text-base font-bold leading-4 text-foreground">Carteira e rede</legend>
              <div className="flex flex-col gap-4">
                {[
                  { id: 'walletconnect', label: 'WalletConnect', mark: 'W' },
                  { id: 'metamask', label: 'MetaMask', mark: 'M' },
                  { id: 'coinbase', label: 'Coinbase Wallet', mark: '↪' },
                ].map((option) => (
                  <label className="flex h-[65px] w-full cursor-pointer items-center gap-2 rounded-xl bg-card px-2.5" key={option.id}>
                    <input checked={wallet === option.id} className="peer sr-only" name="mobile-wallet" onChange={() => setWallet(option.id)} type="radio" value={option.id} />
                    <span aria-hidden="true" className="flex size-7 shrink-0 items-center justify-center rounded-full border border-[#382116] bg-surface-raised text-[10px] font-bold text-primary">{option.mark}</span>
                    <span className="min-w-0 flex-1 text-sm leading-4 text-foreground">{option.label}</span>
                    <span aria-hidden="true" className={`flex size-[11px] items-center justify-center rounded-full border ${wallet === option.id ? 'border-primary' : 'border-[#633B1D]'}`}>
                      {wallet === option.id && <span className="size-[5px] rounded-full bg-primary" />}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="mt-3 flex items-center justify-end gap-5 pr-1 text-sm font-bold leading-5">
              <span className="text-foreground">Total:</span>
              <span className="text-base text-primary">{total} ETH</span>
            </div>

            <button disabled={orderMutation.isPending || !quote} className="fixed inset-x-[13px] bottom-[18px] z-30 h-[60px] rounded-full bg-primary px-4 text-[15px] font-bold leading-4 text-[#140D0A] disabled:opacity-60" type="submit">
              Confirmar compra
            </button>
          </form>
          </>
        )}
      </main>
      <div className="max-md:hidden"><HomeFooter /></div>
    </>
  )
}
