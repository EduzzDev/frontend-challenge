export function FeaturedNftBanner() {
  return (
    <aside
      aria-label="NFT em destaque, oferta limitada"
      className="flex h-120 w-77.5 flex-col items-center gap-3.75 pt-6 pb-4"
      style={{
        background:
          'linear-gradient(180deg, rgb(210 138 76 / 10%) 0%, rgb(210 138 76 / 3%) 100%)',
      }}
    >
      <div className="flex w-full flex-col gap-2.5">
        <h2 className="h-8 px-5 font-mono text-2xl font-bold leading-8 text-primary">
          NFT EM DESTAQUE
        </h2>
        <p className="h-4 self-center font-mono text-[22px] font-bold leading-4 text-foreground">
          OFERTA LIMITADA
        </p>
      </div>
      <img
        alt="NFT de macaco usando chapéu verde e moletom roxo"
        className="min-h-0 w-full flex-1 object-cover"
        height={732}
        src="/images/chill-chimp.png"
        width={620}
      />
    </aside>
  )
}
