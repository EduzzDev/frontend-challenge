import { useState } from 'react'
import { ChevronLeft, Heart, ShoppingCart, Star } from 'lucide-react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { HomeHeader } from '@/components/home-header'
import { HomeFooter } from '@/components/home-footer'
import { addToCart } from '@/lib/cart'
import { nfts, type Nft } from '@/lib/nfts'

const editionOptions = ['1/1', '1/10', '1/50', 'ABERTA']

const descriptionSections = [
  {
    title: 'Rede:',
    text: 'Curada na Ethereum com procedência imutável e metadados armazenados no IPFS.',
  },
  {
    title: 'Contrato:',
    text: 'Direitos autorais do criador: 5% nas vendas secundárias, pagos automaticamente pelo mercado compatível.',
  },
  {
    title: 'Direitos autorais:',
    text: '0x7A2...19C4 · Contrato inteligente ERC-721 verificado.',
  },
]

function nftSlug(nft: Nft) {
  return `${nft.name.toLowerCase().replaceAll(' ', '-')}-${nft.number}`
}

export function NftDetailPage() {
  const { nftId } = useParams({ from: '/nft/$nftId' })
  const navigate = useNavigate()
  const nft = nfts.find((item) => nftSlug(item) === nftId)
  const [selectedThumbnail, setSelectedThumbnail] = useState(0)
  const [selectedEdition, setSelectedEdition] = useState('1/50')
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  if (!nft) {
    return (
      <>
        <HomeHeader activeHref="/nft/emerald-ape-042" navigationPrefix="/" mobileBrand={false} mobileNavigation={false} />
        <main className="mx-auto min-h-[60vh] w-full max-w-300 px-4 py-16 md:px-0">
          <h1 className="font-mono text-2xl font-bold text-foreground">NFT não encontrado</h1>
          <a className="mt-4 inline-block font-mono text-sm text-primary hover:underline" href="/#mercado">
            Voltar ao mercado
          </a>
        </main>
        <HomeFooter />
      </>
    )
  }

  const selectedNft = nft
  const relatedNfts = nfts.filter((item) => item !== nft).slice(0, 5)
  const shareUrl = encodeURIComponent(window.location.href)

  function buyNft() {
    addToCart(selectedNft, quantity)
    void navigate({ to: '/cart' })
  }

  return (
    <>
      <HomeHeader activeHref="/nft/emerald-ape-042" navigationPrefix="/" mobileBrand={false} mobileNavigation={false} />
      <main className="mx-auto w-full max-w-300 px-4 pb-16 max-md:rounded-t-[32px] max-md:bg-background max-md:px-0 max-md:pb-36 min-[640px]:max-[767px]:px-6 md:px-6 lg:px-0">
        <div className="mx-auto flex h-16 w-full max-w-300 items-center justify-between px-7 md:hidden">
          <a
            aria-label="Voltar ao mercado"
            className="flex size-9 translate-y-[7px] items-center justify-center rounded-full bg-surface-raised text-secondary"
            href="/#mercado"
          >
            <ChevronLeft aria-hidden="true" size={16} />
          </a>
          <button
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={isFavorite}
            className="flex size-9 translate-y-[7px] items-center justify-center rounded-full bg-surface-raised text-primary"
            onClick={() => setIsFavorite((favorite) => !favorite)}
            type="button"
          >
            <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} size={13} />
          </button>
        </div>
        <nav aria-label="Navegação estrutural" className="py-4 font-mono text-sm text-text-secondary max-md:hidden">
          <a className="hover:text-primary" href="/#inicio">Início</a>
          <span aria-hidden="true" className="px-2">/</span>
          <a className="hover:text-primary" href="/#mercado">Mercado</a>
          <span aria-hidden="true" className="px-2">/</span>
          <span aria-current="page" className="text-foreground">{nft.name}</span>
        </nav>

        <section
          aria-labelledby="nft-title"
          className="grid grid-cols-1 items-center gap-8 max-md:gap-0 lg:min-h-112 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]"
        >
          <div className="flex min-w-0 flex-col gap-4 max-md:px-0 max-md:pb-0 sm:flex-row">
            <div aria-label="Imagens do NFT" className="order-2 hidden gap-3 overflow-x-auto sm:order-1 sm:flex sm:w-19 sm:shrink-0 sm:flex-col">
              {Array.from({ length: 4 }, (_, index) => (
                <button
                  aria-label={`Ver imagem ${index + 1} de ${nft.name}`}
                  aria-pressed={selectedThumbnail === index}
                  className={`size-18 shrink-0 overflow-hidden rounded-md border bg-surface-card p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    selectedThumbnail === index ? 'border-primary' : 'border-border hover:border-primary'
                  }`}
                  key={index}
                  onClick={() => setSelectedThumbnail(index)}
                  type="button"
                >
                  <img alt="" className="h-full w-full object-contain" height="64" src={nft.image} width="64" />
                </button>
              ))}
            </div>

            <div className="order-1 mx-7 flex h-[calc(100vw-88px)] min-h-[240px] max-h-[420px] flex-none items-center justify-center overflow-hidden rounded-[24px] bg-surface-card p-0 sm:order-2 sm:mx-0 sm:h-112 sm:min-h-75 sm:max-h-none sm:flex-1 sm:rounded-xl sm:p-4">
              <img
                alt={`NFT ${nft.name} #${nft.number}`}
                className="h-full max-h-104 w-full object-cover sm:object-contain"
                height="620"
                src={nft.image}
                width="620"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 font-mono max-md:gap-4 max-md:rounded-t-[28px] max-md:bg-card max-md:px-6 max-md:pb-4 max-md:pt-8">
            <div className="flex items-center justify-between gap-2">
              <h1 className="text-2xl font-bold leading-8 text-foreground max-md:text-xl max-md:leading-6" id="nft-title">
                {nft.name} #{nft.number}
              </h1>
              <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-primary/70 px-1.5 py-0.5 text-xs leading-4 text-secondary md:hidden">
                <Star aria-hidden="true" className="fill-primary text-primary" size={10} />
                <span>4.8</span>
                <span className="text-text-secondary">(19)</span>
              </div>
            </div>
            <div className="flex items-center gap-3 max-md:hidden">
              <p className="text-lg font-bold text-primary">{nft.price} ETH</p>
              <span className="text-sm text-text-secondary">≈ R$ 18.400</span>
            </div>
            <div className="hidden items-center gap-2 text-xs text-text-secondary md:flex">
              <span aria-label="5 de 5 estrelas" className="flex text-primary">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star aria-hidden="true" fill="currentColor" key={index} size={14} />
                ))}
              </span>
              <span>19 avaliações de colecionadores</span>
            </div>

            <div className="mt-2 space-y-1 text-sm leading-5 text-text-secondary max-md:mt-0 max-md:text-sm max-md:leading-6">
              <h2 className="font-bold text-foreground max-md:hidden">Sobre este NFT:</h2>
              <p>
                Um colecionável digital finalizado à mão da coleção Kurio Editions,
                verificado na Ethereum, com arte desbloqueável e acesso para colecionadores.
              </p>
            </div>

            <div className="space-y-2 text-sm text-text-secondary max-md:space-y-1">
              <h2 className="font-bold text-foreground max-md:text-[15px] max-md:leading-5">Edição:</h2>
              <div aria-label="Opções de edição" className="flex flex-wrap items-center gap-2 max-md:gap-1.5" role="group">
                {editionOptions.map((edition) => (
                  <button
                    aria-pressed={selectedEdition === edition}
                    className={`rounded-full border px-2 py-1 text-sm leading-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary max-md:px-1.5 max-md:py-0.5 max-md:text-xs max-md:leading-4 ${
                      selectedEdition === edition
                        ? 'border-primary text-primary'
                        : 'border-border text-text-secondary hover:border-primary hover:text-primary'
                    }`}
                    key={edition}
                    onClick={() => setSelectedEdition(edition)}
                    type="button"
                  >
                    {edition}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-3 max-md:hidden">
                <button
                  aria-label="Diminuir quantidade"
                  className="flex h-[49.5px] w-[33px] items-center justify-center rounded-full border border-[#140D0A] bg-primary text-lg font-bold text-primary-foreground transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                  type="button"
                >
                  −
                </button>
                <span aria-label="Quantidade" aria-live="polite" className="min-w-3 text-center">{quantity}</span>
                <button
                  aria-label="Aumentar quantidade"
                  className="flex h-[49.5px] w-[33px] items-center justify-center rounded-full border border-[#140D0A] bg-primary text-lg font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
                  onClick={() => setQuantity((current) => current + 1)}
                  type="button"
                >
                  +
                </button>
                <button
                  className="ml-auto rounded-md bg-primary px-5 py-2 font-sans text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark"
                  onClick={buyNft}
                  type="button"
                >
                  COMPRAR
                </button>
                <button
                  aria-pressed={isFavorite}
                  className={`flex items-center gap-1 rounded-md border px-3 py-2 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                    isFavorite ? 'border-primary text-primary' : 'border-border text-text-secondary hover:border-primary hover:text-primary'
                  }`}
                  onClick={() => setIsFavorite((favorite) => !favorite)}
                  type="button"
                >
                  <Heart aria-hidden="true" fill={isFavorite ? 'currentColor' : 'none'} size={14} />
                  Favoritar
                </button>
              </div>
            </div>

            <dl className="space-y-2 font-mono text-[15px] font-normal leading-5 text-secondary max-md:space-y-1 max-md:text-[15px] max-md:leading-[15px]">
              <div><dt className="inline">ID do token: </dt><dd className="inline">#0{nft.number}</dd></div>
              <div><dt className="inline">Coleção: </dt><dd className="inline">Kurio Apes</dd></div>
              <div className="break-words"><dt className="inline">Atributos: </dt><dd className="inline">Óculos, Esmeralda, Raro</dd></div>
            </dl>
            <div className="flex w-fit flex-wrap items-center gap-3 text-xs text-foreground max-md:hidden">
              <span>Compartilhar este NFT:</span>
              <nav aria-label="Compartilhar este NFT" className="flex items-center gap-3">
                <a
                  aria-label="Compartilhar no LinkedIn"
                  className="flex items-center justify-center text-[#F5F1EB] hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg aria-hidden="true" height="15" viewBox="0 0 15 15" width="15">
                    <path
                      d="M3.125 1.5625C3.125 2.4375 2.4375 3.125 1.5625 3.125C0.6875 3.125 0 2.4375 0 1.5625C0 0.6875 0.6875 0 1.5625 0C2.4375 0 3.125 0.6875 3.125 1.5625ZM3.125 4.375H0V14.375H3.125V4.375ZM8.125 4.375H5V14.375H8.125V9.125C8.125 6.1875 11.875 5.9375 11.875 9.125V14.375H15V8.0625C15 3.125 9.4375 3.3125 8.125 5.75V4.375Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
                <a
                  aria-label="Compartilhar por e-mail"
                  className="flex items-center justify-center text-[#F5F1EB] hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`mailto:?subject=${encodeURIComponent(`Confira ${nft.name} #${nft.number}`)}&body=${shareUrl}`}
                >
                  <svg aria-hidden="true" height="18" viewBox="0 0 18 18" width="18">
                    <path
                      d="M9 4.09091C7.30168 4.09091 4.98846 4.2365 3.51951 4.34356C3.03167 4.37911 2.65385 4.76529 2.65385 5.23696V5.76996L8.53304 8.85802C8.82344 9.01056 9.17656 9.01056 9.46697 8.85802L15.3462 5.76996V5.23696C15.3462 4.76529 14.9683 4.37911 14.4805 4.34356C13.0115 4.2365 10.6983 4.09091 9 4.09091ZM15.3462 7.01792L10.0273 9.81165C9.38843 10.1472 8.61157 10.1472 7.97268 9.81165L2.65385 7.01792V12.763C2.65385 13.2347 3.03167 13.6209 3.51951 13.6564C4.98846 13.7635 7.30168 13.9091 9 13.9091C10.6983 13.9091 13.0115 13.7635 14.4805 13.6564C14.9683 13.6209 15.3462 13.2347 15.3462 12.763V7.01792ZM3.43083 3.25588C4.90066 3.14876 7.25301 3 9 3C10.747 3 13.0993 3.14876 14.5692 3.25588C15.6676 3.33593 16.5 4.20441 16.5 5.23696V12.763C16.5 13.7956 15.6676 14.6641 14.5692 14.7441C13.0993 14.8512 10.747 15 9 15C7.25301 15 4.90066 14.8512 3.43083 14.7441C2.33237 14.6641 1.5 13.7956 1.5 12.763V5.23696C1.5 4.20441 2.33237 3.33593 3.43083 3.25588Z"
                      clipRule="evenodd"
                      fill="currentColor"
                      fillRule="evenodd"
                    />
                  </svg>
                </a>
                <a
                  aria-label="Compartilhar no Twitter"
                  className="flex items-center justify-center text-[#F5F1EB] hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${encodeURIComponent(`${nft.name} #${nft.number}`)}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <svg aria-hidden="true" height="13" viewBox="0 0 16 13" width="16">
                    <path
                      d="M5.02106 12.1908C11.0461 12.1908 14.341 7.50111 14.341 3.4346C14.341 3.30135 14.3381 3.1688 14.3316 3.03675C14.9711 2.60239 15.5271 2.06021 15.9657 1.44331C15.3788 1.6883 14.7472 1.85327 14.0846 1.92765C14.7608 1.54669 15.2802 0.94378 15.5251 0.225197C14.8921 0.577835 14.1912 0.834082 13.4452 0.972271C12.8473 0.374134 11.996 0 11.0541 0C9.24495 0 7.77791 1.37831 7.77791 3.07718C7.77791 3.31876 7.80678 3.55351 7.86271 3.77887C5.14054 3.65041 2.72653 2.42565 1.11113 0.563675C0.829489 1.01833 0.667332 1.54686 0.667332 2.11037C0.667332 3.17801 1.24569 4.12059 2.12511 4.67216C1.5878 4.65663 1.08298 4.51776 0.641546 4.2871C0.64082 4.2999 0.64082 4.31286 0.64082 4.32634C0.64082 5.81691 1.77011 7.06129 3.26875 7.3433C2.99364 7.41376 2.70419 7.45163 2.4053 7.45163C2.1943 7.45163 1.9891 7.43184 1.78954 7.39619C2.20646 8.61873 3.41583 9.5086 4.84964 9.53368C3.72834 10.3592 2.31596 10.8511 0.781368 10.8511C0.517159 10.8511 0.256401 10.8369 0 10.8084C1.44961 11.6812 3.17087 12.1908 5.02106 12.1908Z"
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </nav>
            </div>
          </div>
        </section>

        <section aria-label="Descrição do NFT" className="mt-10 min-h-85 border-y border-border px-6 py-4 sm:max-md:px-0 md:px-0">
          <div className="flex gap-8 border-b border-border font-mono text-sm">
            <button className="border-b-2 border-primary pb-3 font-bold text-primary" type="button">Detalhes do NFT</button>
            <button className="pb-3 text-text-secondary hover:text-primary" type="button">Avaliações de colecionadores (19)</button>
          </div>
          <div className="space-y-3 py-4 font-mono text-xs leading-5 text-text-secondary">
            <p>
              {nft.name} #{nft.number} é uma obra digital 1/1 finalizada à mão da coleção Kurio Editions.
              Cada atributo foi selecionado para celebrar a cultura e a criatividade digital.
            </p>
            <p>
              A propriedade inclui a arte em alta resolução, lançamentos exclusivos para colecionadores
              e um registro permanente de procedência na rede. Seja parte desta edição limitada e apoie
              artistas independentes enquanto acompanha novos trabalhos e lançamentos da comunidade.
            </p>
            {descriptionSections.map(({ title, text }) => (
              <p key={title}><strong className="text-foreground">{title}</strong><br />{text}</p>
            ))}
          </div>
        </section>

        <section aria-labelledby="related-nfts-title" className="py-10 max-md:px-6">
          <div className="mb-5 flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-mono text-lg font-bold text-primary" id="related-nfts-title">Mais desta coleção</h2>
            <a className="font-mono text-sm text-text-secondary hover:text-primary" href="/#mercado">Ver coleção</a>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {relatedNfts.map((relatedNft) => (
              <li key={`${relatedNft.name}-${relatedNft.number}`}>
                <a
                  className="group block min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  href={`/nft/${nftSlug(relatedNft)}`}
                >
                  <div className="aspect-square overflow-hidden bg-surface-card p-2">
                    <img
                      alt={`NFT ${relatedNft.name} #${relatedNft.number}`}
                      className="h-full w-full rounded-md object-contain transition-transform group-hover:scale-[1.03]"
                      height="400"
                      loading="lazy"
                      src={relatedNft.image}
                      width="400"
                    />
                  </div>
                  <h3 className="mt-2 truncate font-mono text-xs text-foreground">
                    {relatedNft.name} #{relatedNft.number}
                  </h3>
                  <p className="font-mono text-xs font-bold text-primary">{relatedNft.price} ETH</p>
                </a>
              </li>
            ))}
          </ul>
          <div aria-label="Página 1 de 3" className="mt-4 flex justify-center gap-2">
            <span className="size-2 rounded-full bg-primary" />
            <span className="size-2 rounded-full bg-border" />
            <span className="size-2 rounded-full bg-border" />
          </div>
        </section>
        <section
          aria-label="Compra do NFT"
          className="fixed inset-x-0 bottom-0 z-40 space-y-3 rounded-t-2xl border-t border-border bg-[#1C100C] px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.25)] md:hidden"
        >
          <div className="flex items-center justify-between font-mono">
            <div className="flex items-center gap-[11px] text-base text-text-secondary">
              <span>Qtd.</span>
              <button
                aria-label="Diminuir quantidade"
                className="flex h-[30px] w-[20px] items-center justify-center rounded-full border border-[#140D0A] bg-primary font-mono text-sm font-bold leading-4 text-primary-foreground disabled:opacity-50"
                disabled={quantity <= 1}
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                type="button"
              >
                −
              </button>
              <span aria-label="Quantidade selecionada" aria-live="polite" className="min-w-[11px] text-center text-[17px] leading-6 text-foreground">{quantity}</span>
              <button
                aria-label="Aumentar quantidade"
                className="flex h-[30px] w-[20px] items-center justify-center rounded-full border border-[#140D0A] bg-primary font-mono text-sm font-bold leading-4 text-primary-foreground"
                onClick={() => setQuantity((current) => current + 1)}
                type="button"
              >
                +
              </button>
            </div>
            <p className="text-xl font-bold leading-6 text-primary">{nft.price} ETH</p>
          </div>
          <div className="flex gap-2">
            <button
              className="h-[60px] w-[196px] shrink-0 rounded-full bg-primary font-mono text-base font-bold leading-5 text-primary-foreground"
              onClick={buyNft}
              type="button"
            >
              Comprar NFT
            </button>
            <button
              aria-label="Adicionar ao carrinho"
              className="flex size-[60px] shrink-0 items-center justify-center rounded-[40px] border border-border bg-surface-raised text-primary"
              onClick={() => addToCart(selectedNft, quantity)}
              type="button"
            >
              <ShoppingCart aria-hidden="true" size={17} />
            </button>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  )
}
