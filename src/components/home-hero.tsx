export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-title"
      className="relative mx-auto mt-8 grid h-112.5 w-full max-w-300 grid-cols-[600px_450px] items-start justify-between pl-10 max-[1279px]:h-auto max-[1279px]:grid-cols-1 max-[1279px]:gap-8 max-[1279px]:px-5"
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
  )
}
