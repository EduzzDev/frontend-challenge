const footerFeatures = [
  {
    initial: 'W',
    title: 'Segurança da carteira',
    description: 'Proteja sua carteira e colecione arte digital verificada com confiança.',
  },
  {
    initial: 'C',
    title: 'Criadores em destaque',
    description: 'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
  },
  {
    initial: 'D',
    title: 'Alertas de lançamentos',
    description: 'Receba novidades de coleções, listas de acesso antecipado e análises do mercado.',
  },
]

const footerGroups = [
  {
    title: 'Meu perfil',
    links: ['Meu perfil', 'Minha coleção', 'Atividade', 'Estúdio do criador', 'Lista de interesse'],
  },
  {
    title: 'Central de ajuda',
    links: [
      'Central de ajuda',
      'Como comprar NFTs',
      'Carteira e segurança',
      'Política do mercado',
      'Denunciar item',
    ],
  },
  {
    title: 'Coleções',
    links: ['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'],
  },
]

const socialLinks = [
  { name: 'Facebook', icon: 'f' },
  { name: 'Instagram', icon: 'instagram' },
  { name: 'Twitter', icon: 'twitter' },
  { name: 'LinkedIn', icon: 'in' },
  { name: 'YouTube', icon: 'youtube' },
]

function SocialIcon({ icon }: { icon: string }) {
  if (icon === 'instagram') {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
        <rect height="13" rx="3.5" stroke="currentColor" strokeWidth="1.7" width="13" x="2.5" y="2.5" />
        <circle cx="9" cy="9" r="3" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="13.2" cy="4.9" fill="currentColor" r="1" />
      </svg>
    )
  }

  if (icon === 'twitter') {
    return (
      <svg aria-hidden="true" fill="currentColor" height="17" viewBox="0 0 18 18" width="18">
        <path d="M16 4.1a5.2 5.2 0 0 1-1.5.4 2.6 2.6 0 0 0 1.1-1.4 5.2 5.2 0 0 1-1.7.6 2.6 2.6 0 0 0-4.5 1.8c0 .2 0 .4.1.6a7.4 7.4 0 0 1-5.4-2.7 2.6 2.6 0 0 0 .8 3.5 2.6 2.6 0 0 1-1.2-.3v.1c0 1.3.9 2.3 2.1 2.6a2.6 2.6 0 0 1-1.2 0 2.6 2.6 0 0 0 2.4 1.8A5.2 5.2 0 0 1 3 12.8a7.4 7.4 0 0 0 11.4-6.3v-.3A5.3 5.3 0 0 0 16 4.1Z" />
      </svg>
    )
  }

  if (icon === 'youtube') {
    return (
      <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 18 18" width="18">
        <rect height="11" rx="3" stroke="currentColor" strokeWidth="1.7" width="15" x="1.5" y="3.5" />
        <path d="m7.3 6.5 4.1 2.5-4.1 2.5v-5Z" fill="currentColor" />
      </svg>
    )
  }

  return (
    <span aria-hidden="true" className="font-sans text-base font-bold leading-none">
      {icon}
    </span>
  )
}

export function HomeFooter() {
  return (
    <footer className="mx-auto w-full max-w-300 px-4 pb-[calc(64px+env(safe-area-inset-bottom))] max-md:px-0 md:px-0 md:pb-0">
      <div className="overflow-hidden rounded-t-3xl bg-card md:rounded-2xl">
        <section
          aria-label="Destaques e novidades"
          className="px-4 py-8 md:px-8 md:py-10 xl:h-[250px] xl:pt-8 xl:pb-4"
        >
          <div className="mx-auto grid max-w-[1154px] grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2 xl:h-full xl:grid-cols-[repeat(3,minmax(0,1fr))_minmax(0,1.3fr)] xl:gap-x-0 xl:gap-y-0">
            {footerFeatures.map(({ initial, title, description }) => (
              <article
                className="min-w-0 px-3 md:px-0 max-[359px]:px-1 xl:px-5 xl:border-r xl:border-primary/70"
                key={initial}
              >
                <div
                  aria-hidden="true"
                  className="flex size-[74px] items-center justify-center rounded-full bg-primary font-mono text-xl font-bold text-primary-foreground"
                >
                  {initial}
                </div>
                <h2 className="mt-3 font-mono text-[17px] font-bold leading-6 text-foreground">
                  {title}
                </h2>
                <p className="mt-2 w-full max-w-[280px] font-mono text-sm font-normal leading-[22px] text-text-secondary">
                  {description}
                </p>
              </article>
            ))}

            <section aria-labelledby="footer-newsletter-title" className="min-w-0 px-3 md:px-0 xl:px-5">
              <h2
                className="w-full max-w-[325px] font-mono text-base font-bold leading-6 text-foreground sm:text-lg"
                id="footer-newsletter-title"
              >
                Antecipe-se ao próximo lançamento
              </h2>
              <div className="mt-4 flex h-10 w-full max-w-[325px] overflow-hidden rounded-md bg-surface-dark">
                <input
                  aria-label="Seu e-mail"
                  className="min-w-0 flex-1 bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary"
                  placeholder="digite seu e-mail..."
                  type="email"
                />
                <button
                  className="flex h-10 w-[85px] shrink-0 items-center justify-center bg-primary font-mono text-base font-bold leading-5 text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-foreground"
                  type="button"
                >
                  Enviar
                </button>
              </div>
              <p className="mt-3 min-h-[66px] w-full max-w-[325px] font-mono text-sm font-normal leading-[22px] text-text-secondary">
                Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
              </p>
            </section>
          </div>
        </section>

        <section
          aria-label="Informações de contato"
          className="grid grid-cols-1 items-start gap-4 border-t border-border bg-surface-dark px-6 py-6 font-mono text-sm leading-[22px] text-foreground sm:px-8 md:grid-cols-2 md:gap-x-8 md:gap-y-4 xl:min-h-[104px] xl:grid-cols-4 xl:items-center xl:gap-4 xl:py-0"
        >
          <a
            aria-label="Kurio - início"
            className="w-fit font-bold tracking-[0.12em] hover:text-primary"
            href="#inicio"
          >
            KURIO
          </a>
          <p className="max-w-[260px]">
            Feito para colecionadores, criadores e cultura
          </p>
          <a className="w-fit hover:text-primary" href="mailto:contato@email.com">
            contato@email.com
          </a>
          <a className="w-fit hover:text-primary" href="tel:+551140028922">
            +55 11 4002 8922
          </a>
        </section>

        <section
          aria-label="Links e redes sociais"
          className="grid grid-cols-1 gap-x-8 gap-y-10 border-t border-border px-6 py-8 sm:px-8 md:grid-cols-2 md:gap-x-12 md:gap-y-10 xl:min-h-[236px] xl:grid-cols-4 xl:gap-x-6 xl:gap-y-8"
        >
          {footerGroups.map(({ title, links }) => (
            <nav aria-label={title} key={title}>
              <h2 className="font-mono text-lg font-bold leading-[22px] text-foreground">
                {title}
              </h2>
              <ul className="mt-2 flex flex-col gap-1">
                {links.map((label) => (
                  <li key={label}>
                    <a
                      className="font-mono text-sm leading-[22px] text-foreground hover:text-primary"
                      href="#inicio"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h2 className="font-mono text-lg font-bold leading-[22px] text-foreground">
              Redes sociais
            </h2>
            <ul aria-label="Redes sociais" className="mt-3 flex gap-2">
              {socialLinks.map(({ name, icon }) => (
                <li key={name}>
                  <a
                    aria-label={name}
                    className="flex size-8 items-center justify-center rounded-md border border-primary text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    href="#inicio"
                  >
                    <SocialIcon icon={icon} />
                  </a>
                </li>
              ))}
            </ul>
            <h2 className="mt-7 font-mono text-lg font-bold leading-[22px] text-foreground">
              Carteiras compatíveis
            </h2>
            <p className="mt-2 inline-flex rounded-md border border-border-soft bg-surface-dark px-2 py-1 font-mono text-[9px] font-bold leading-3 text-primary">
              METAMASK&nbsp; · &nbsp;WALLETCONNECT&nbsp; · &nbsp;COINBASE
            </p>
          </div>
        </section>
      </div>

      <p className="py-3 text-center font-mono text-sm leading-[22px] text-foreground">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  )
}
