import { ArrowRight } from 'lucide-react'

const banners = [
  {
    title: 'Lançamentos gênesis de edição limitada',
    description: 'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
    image: '/images/hero-ape.png',
    imageAlt: 'Macaco usando óculos e jaqueta verde',
    imageWidth: 292,
    imageLeft: -5,
    imageRadius: 'rounded-[18px]',
    hasCornerCircle: true,
    descriptionWidth: 'w-65.75',
    descriptionOffsetRight: '',
  },
  {
    title: 'Arte digital selecionada e muito mais',
    description: (
      <>
        Explore novos artistas,
        <br />
        coleções verificadas e obras
        <br />
        digitais que definem a cultura.
      </>
    ),
    image: '/images/dapper-kong.png',
    imageAlt: 'Macaco usando terno claro',
    imageWidth: 287,
    imageLeft: 2,
    imageRadius: 'rounded-[17px]',
    hasCornerCircle: true,
    descriptionWidth: 'w-63',
    descriptionOffsetRight: '-mr-0.75',
  },
]

export function PromotionalBanners() {
  return (
    <section
      aria-label="Destaques do marketplace"
      className="mx-auto mt-12 grid w-full max-w-300 gap-7 px-4 md:grid-cols-2 md:px-0"
    >
      {banners.map((banner) => (
        <article
          className="flex h-62.5  min-w-0 flex-col bg-surface-card sm:flex-row"
          key={banner.title}
        >
          <div className="relative h-62.5 w-full shrink-0 sm:w-73.25">
            <img
              alt={banner.imageAlt}
              className={`h-full w-full object-cover sm:absolute sm:top-0 ${
                banner.imageLeft === -5
                  ? 'rounded-[18px] sm:-left-1.25 sm:w-73'
                  : 'rounded-[17px] sm:left-0.5 sm:w-71.75'
              }`}
              height={250}
              loading="lazy"
              src={banner.image}
              width={banner.imageWidth}
            />
            {banner.hasCornerCircle && (
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute top-0 h-full overflow-hidden ${
                  banner.imageLeft === 2
                    ? 'left-0.5 w-68 rounded-[17px]'
                    : 'inset-0 w-full -translate-x-1'
                }`}
              >
                <svg
                  className="h-full w-[256px]"
                  fill="none"
                  viewBox={banner.imageLeft === 2 ? '0 0 260 250' : '0 0 250 250'}
                >
                  <circle
                    cx="-90"
                    cy="256"
                    r="130"
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                  />
                  <circle
                    cx="-85"
                    cy="256"
                    r="128"
                    stroke="var(--color-primary)"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-end
           justify-start pt-9.25 pr-7.5 text-right">
            <h2 className="h-12 w-65 font-mono text-lg font-bold leading-6 text-foreground">
              {banner.title}
            </h2>
            <p
              className={`mt-2.25 h-11.25 ${banner.descriptionWidth} 
              ${banner.descriptionOffsetRight} overflow-visible font-mono text-sm font-normal
               leading-6 text-secondary`}
            >
              {banner.description}
            </p>
            <a
              className="mt-6.25 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 font-mono text-sm font-bold text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-card"
              href="#mercado"
            >
              Explorar
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </div>
        </article>
      ))}
    </section>
  )
}
