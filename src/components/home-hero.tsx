export function HomeHero() {
  return (
    <>
    <section
      aria-labelledby="home-hero-title"
      className="relative mx-auto mt-8 hidden h-112.5 w-full max-w-300 grid-cols-[600px_450px] items-start justify-between pl-10 max-[1279px]:h-auto max-[1279px]:grid-cols-1 max-[1279px]:gap-8 max-[1279px]:px-5 md:grid"
    >
      <div className="w-150 pt-10.5 max-[1279px]:w-full max-[1279px]:pt-8">
        <div className="flex h-60 w-150 flex-col gap-1 max-[1279px]:h-auto max-[1279px]:w-full">
          <p className="font-mono text-sm leading-5 tracking-[0.08em] text-foreground">
            Bem-vindo à Kurio
          </p>
          <h1
            className="mt-3 font-mono text-[42px] font-bold leading-normal tracking-[-0.035em] text-foreground max-[639px]:text-[32px]"
            id="home-hero-title"
          >
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </h1>
          <p className="max-w-142.5 font-mono text-sm leading-6 text-secondary">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            <br className="max-[639px]:hidden" />
            {' '}Colecione arte digital rara, apoie artistas e tenha uma parte da
            <br className="max-[639px]:hidden" />
            {' '}cultura da internet.
          </p>
        </div>

        <a
          className="mt-8 inline-flex h-10 w-35 items-center rounded-md bg-primary py-2.5 pl-7 pr-9 font-sans
           text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          href="#mercado"
        >
          EXPLORAR
        </a>
      </div>

      <img
        alt="Macaco usando óculos e jaqueta verde, arte em destaque da Kurio"
        className="h-112.5 w-112.5 rounded-3xl object-cover max-[1279px]:mx-auto max-[1279px]:h-auto max-[1279px]:w-full max-[1279px]:max-w-112.5"
        height={450}
        src="/images/hero-ape.png"
        width={450}
      />

      <div aria-label="Slide 1 de 3" className="absolute bottom-10.75 left-1/2 flex -translate-x-1/2 gap-2 max-[1279px]:hidden">
        <span className="size-2 rounded-full bg-primary" />
        <span className="size-2 rounded-full bg-primary" />
        <span className="size-2 rounded-full bg-primary" />
      </div>
    </section>
    <section
      aria-labelledby="mobile-home-hero-title"
      className="relative mx-auto mt-2.5 h-[190px] w-[calc(100%-28px)] max-w-[366px] overflow-hidden rounded-xl bg-surface-card px-4 pt-3 max-[359px]:h-[180px] max-[359px]:w-[calc(100%-20px)] max-[359px]:px-3 md:hidden"
    >
      <p className="relative z-10 font-mono text-xs font-medium leading-4 text-foreground">Bem-vindo à Kurio</p>
      <h1
        className="relative z-10 mt-1 w-[190px] font-mono text-lg font-bold leading-[29px] tracking-[-0.035em] text-foreground max-[359px]:w-[170px] max-[359px]:text-base max-[359px]:leading-6"
        id="mobile-home-hero-title"
      >
        SEJA DONO DA
        <br />
        CULTURA DIGITAL
      </h1>
      <p className="relative z-10 mt-1 w-[150px] font-mono text-[8px] leading-[10px] text-secondary">
        Descubra NFTs selecionados de criadores do mundo todo.
      </p>
      <a className="relative z-10 mt-0.5 inline-flex items-center gap-1 font-mono text-[8px] leading-3 text-primary" href="#mercado">
        EXPLORAR <span aria-hidden="true">→</span>
      </a>
      <img
        alt=""
        className="absolute right-3 top-1 size-[138px] rounded-xl object-cover max-[359px]:right-2 max-[359px]:size-[128px]"
        height="138"
        src="/images/hero-ape.png"
        width="138"
      />
      <img
        alt=""
        className="absolute bottom-8 right-[58px] size-[58px] rounded-xl object-cover max-[359px]:right-[48px] max-[359px]:size-[52px]"
        height="58"
        src="/images/chill-chimp.png"
        width="58"
      />
      <div aria-label="Slide 1 de 3" className="absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="size-1.5 rounded-full bg-primary" />
        <span className="size-1.5 rounded-full bg-primary" />
      </div>
    </section>
    </>
  )
}
