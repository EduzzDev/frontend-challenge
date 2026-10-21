const articles = [
  {
    date: '12 de setembro',
    readingTime: 'Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    image: '/images/dapper-kong.png',
    imageAlt: 'Macaco usando terno claro',
  },
  {
    date: '13 de setembro',
    readingTime: 'Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
    image: '/images/hero-ape.png',
    imageAlt: 'Macaco usando óculos e jaqueta verde',
  },
  {
    date: '15 de setembro',
    readingTime: 'Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    image: '/images/chill-chimp.png',
    imageAlt: 'Macaco usando chapéu e moletom roxo',
  },
  {
    date: '15 de setembro',
    readingTime: 'Leitura de 2 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
    image: '/images/DJ-golden-chimp.png',
    imageAlt: 'Macaco dourado usando fones de ouvido',
  },
]

export function BlogCards() {
  return (
    <section
      aria-labelledby="blog-title"
      className="mx-auto mt-24 w-full max-w-300 px-4 pb-20 md:px-0"
    >
      <header className="text-center">
        <h2
          className="flex h-9.25 items-center justify-center font-mono text-[28px] font-bold leading-none text-foreground"
          id="blog-title"
        >
          Diário da Cunhagem
        </h2>
        <p className="mt-2 font-mono text-sm font-normal leading-4.5 text-text-secondary">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </header>

      <div className="mt-10 grid grid-cols-1 justify-items-center gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {articles.map((article) => (
          <article
            className="h-92.25 w-full max-w-67 overflow-hidden rounded-lg bg-surface-card"
            key={article.title}
          >
            <img
              alt={article.imageAlt}
              className="h-48.75 w-full object-cover"
              height={195}
              loading="lazy"
              src={article.image}
              width={268}
            />
            <div className="flex h-43.5 flex-col gap-2 px-4 pt-3 pb-4">
              <p className="h-8 w-full font-mono text-xs font-medium leading-4 text-text-secondary">
                {article.date}
                <span aria-hidden="true" className="mx-2">
                  |
                </span>
                {article.readingTime}
              </p>
              <h3 className="h-10.5 w-full font-mono text-base font-bold leading-4 text-foreground">
                {article.title}
              </h3>
              <p className="h-8 w-full font-mono text-xs font-medium leading-4 text-text-secondary">
                {article.description}
              </p>
              <a
                className="mt-auto inline-flex items-center gap-1 font-mono text-xs font-bold leading-3.5 text-[#E89B55] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                href="#mercado"
              >
                Ler mais
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
