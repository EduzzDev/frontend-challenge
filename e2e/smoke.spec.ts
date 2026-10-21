import { expect, test } from '@playwright/test'

test('home route renders the challenge heading', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Jungle Gaming — Frontend Challenge')
  await expect(page.getByRole('heading', { name: 'Frontend Challenge' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Base shadcn/ui pronta' })).toBeVisible()
})

test('home route renders promotional banners with their typography', async ({ page }) => {
  await page.goto('/')

  const bannerSection = page.getByRole('region', { name: 'Destaques do marketplace' })
  const title = bannerSection.getByRole('heading', { name: 'Lançamentos gênesis de edição limitada' })
  const description = bannerSection.getByText(
    'Colecione edições escassas diretamente dos criadores antes da revelação pública.',
  )
  const collectionDescription = bannerSection.locator('article').nth(1).locator('p')

  await expect(title).toBeVisible()
  await expect(title).toHaveCSS('font-size', '18px')
  await expect(title).toHaveCSS('font-weight', '700')
  await expect(title).toHaveCSS('line-height', '24px')
  await expect(title).toHaveCSS('text-align', 'right')
  await expect(title).toHaveCSS('width', '206px')
  await expect(title).toHaveCSS('height', '48px')
  await expect(title).toHaveCSS('margin-top', '0px')
  await expect(description).toHaveCSS('font-size', '14px')
  await expect(description).toHaveCSS('font-weight', '400')
  await expect(description).toHaveCSS('line-height', '24px')
  await expect(description).toHaveCSS('text-align', 'right')
  await expect(description).toHaveCSS('width', '263px')
  await expect(description).toHaveCSS('height', '45px')
  await expect(description).toHaveCSS('margin-top', '9px')
  await expect(collectionDescription).toHaveCSS('width', '252px')
  await expect(collectionDescription).toHaveCSS('height', '45px')
  await expect(collectionDescription).toHaveCSS('margin-top', '9px')
  await expect(collectionDescription.locator('br')).toHaveCount(2)
  await expect(collectionDescription).toHaveText(
    /Explore novos artistas,\s+coleções verificadas e obras\s+digitais que definem a cultura\./,
  )
  await expect(bannerSection.getByRole('link', { name: 'Explorar' }).first()).toHaveCSS(
    'margin-top',
    '25px',
  )
  const launchImage = bannerSection.getByRole('img', { name: 'Macaco usando óculos e jaqueta verde' })
  await expect(launchImage).toHaveCSS('border-radius', '18px')
  const cornerCircle = bannerSection.locator('article').first().locator('svg circle')
  await expect(cornerCircle).toHaveCount(2)
  await expect(cornerCircle.nth(0)).toHaveAttribute('r', '130')
  await expect(cornerCircle.nth(1)).toHaveAttribute('r', '128')
  await expect(cornerCircle.first()).toHaveAttribute('stroke', 'var(--color-primary)')
  const secondBannerCircle = bannerSection.locator('article').nth(1).locator('svg circle')
  await expect(secondBannerCircle).toHaveCount(2)
  await expect(secondBannerCircle.first().locator('xpath=../..')).toHaveCSS('overflow', 'hidden')
  const collectionImage = bannerSection.getByRole('img', { name: 'Macaco usando terno claro' })
  await expect(collectionImage).toHaveCSS('border-radius', '17px')
  if ((await page.evaluate(() => window.innerWidth)) >= 1280) {
    const imageBounds = await launchImage.evaluate((image) => {
      const imageRect = image.getBoundingClientRect()
      const cardRect = image.closest('article')!.getBoundingClientRect()

      return {
        x: imageRect.x - cardRect.x,
        width: imageRect.width,
        height: imageRect.height,
      }
    })
    expect(imageBounds).toEqual({ x: -5, width: 292, height: 250 })

    const collectionImageBounds = await collectionImage.evaluate((image) => {
      const imageRect = image.getBoundingClientRect()
      const cardRect = image.closest('article')!.getBoundingClientRect()

      return {
        x: imageRect.x - cardRect.x,
        width: imageRect.width,
        height: imageRect.height,
      }
    })
    expect(collectionImageBounds).toEqual({ x: 2, width: 287, height: 250 })

    const textPositions = await bannerSection.locator('article').first().evaluate((article) => {
      const articleRect = article.getBoundingClientRect()
      const titleRect = article.querySelector('h2')!.getBoundingClientRect()
      const descriptionRect = article.querySelector('p')!.getBoundingClientRect()
      const actionRect = article.querySelector('a')!.getBoundingClientRect()

      return {
        title: { x: titleRect.x - articleRect.x, y: titleRect.y - articleRect.y },
        description: {
          x: descriptionRect.x - articleRect.x,
          y: descriptionRect.y - articleRect.y,
        },
        action: { y: actionRect.y - articleRect.y },
      }
    })

    expect(textPositions).toEqual({
      title: { x: 350, y: 37 },
      description: { x: 293, y: 94 },
      action: { y: 164 },
    })

    const collectionTextPositions = await bannerSection.locator('article').nth(1).evaluate((article) => {
      const articleRect = article.getBoundingClientRect()
      const descriptionRect = article.querySelector('p')!.getBoundingClientRect()

      return {
        x: descriptionRect.x - articleRect.x,
        y: descriptionRect.y - articleRect.y,
        width: descriptionRect.width,
        height: descriptionRect.height,
      }
    })

    expect(collectionTextPositions).toEqual({ x: 295, y: 94, width: 252, height: 45 })
  }
  await expect(bannerSection.getByRole('link', { name: 'Explorar' })).toHaveAttribute('href', '#mercado')
})

test('home route renders the blog cards below the promotional banners', async ({ page }) => {
  await page.goto('/')

  const blog = page.getByRole('region', { name: 'Diário da Cunhagem' })

  await expect(blog.getByRole('heading', { name: 'Diário da Cunhagem' })).toBeVisible()
  await expect(
    blog.getByText(
      'Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.',
    ),
  ).toBeVisible()
  await expect(blog.locator('article')).toHaveCount(4)
  await expect(blog.getByRole('heading', { name: 'Como funciona a propriedade de NFTs' })).toBeVisible()
  await expect(blog.getByRole('heading', { name: '10 artistas digitais para acompanhar' })).toBeVisible()
  await expect(blog.getByRole('heading', { name: 'Raridade, atributos e procedência' })).toBeVisible()
  await expect(blog.getByRole('heading', { name: 'Como proteger sua carteira' })).toBeVisible()
  await expect(blog.getByRole('img')).toHaveCount(4)
  await expect(blog.locator('article').first()).toHaveCSS('width', '268px')
  await expect(blog.locator('article').first()).toHaveCSS('height', '369px')
  const articleMetadata = blog.locator('article').first().locator('div > p').first()
  await expect(articleMetadata).toHaveCSS('width', '236px')
  await expect(articleMetadata).toHaveCSS('height', '32px')
  await expect(articleMetadata).toHaveCSS('font-size', '12px')
  await expect(articleMetadata).toHaveCSS('font-weight', '500')
  await expect(articleMetadata).toHaveCSS('line-height', '16px')
  await expect(articleMetadata).toHaveCSS('color', 'rgb(207, 178, 140)')
  const firstArticleTitle = blog
    .getByRole('heading', { name: 'Como funciona a propriedade de NFTs' })
  await expect(firstArticleTitle).toHaveCSS('width', '236px')
  await expect(firstArticleTitle).toHaveCSS('height', '42px')
  await expect(firstArticleTitle).toHaveCSS('font-size', '16px')
  await expect(firstArticleTitle).toHaveCSS('font-weight', '700')
  await expect(firstArticleTitle).toHaveCSS('line-height', '16px')
  const firstArticleDescription = blog.getByText(
    'Aprenda a colecionar, negociar e verificar ativos digitais.',
  )
  await expect(firstArticleDescription).toHaveCSS('width', '236px')
  await expect(firstArticleDescription).toHaveCSS('height', '32px')
  await expect(firstArticleDescription).toHaveCSS('font-size', '12px')
  await expect(firstArticleDescription).toHaveCSS('font-weight', '500')
  await expect(firstArticleDescription).toHaveCSS('line-height', '16px')
  await expect(firstArticleDescription).toHaveCSS('color', 'rgb(207, 178, 140)')

  const sectionSpacing = await blog.evaluate((section) => {
    const promotions = section.previousElementSibling
    if (!promotions || promotions.getAttribute('aria-label') !== 'Destaques do marketplace') {
      throw new Error('The blog section must follow the promotional banners')
    }

    return section.getBoundingClientRect().top - promotions.getBoundingClientRect().bottom
  })

  expect(sectionSpacing).toBe(96)
})

test('home route renders the footer after the blog section', async ({ page }) => {
  await page.goto('/')

  const footer = page.getByRole('contentinfo')

  await expect(footer).toBeVisible()
  await expect(footer.getByRole('heading', { name: 'Segurança da carteira' })).toBeVisible()
  await expect(footer.getByRole('heading', { name: 'Criadores em destaque' })).toBeVisible()
  await expect(footer.getByRole('heading', { name: 'Alertas de lançamentos' })).toBeVisible()
  await expect(footer.getByRole('heading', { name: 'Antecipe-se ao próximo lançamento' })).toBeVisible()
  await expect(footer.getByRole('heading', { name: 'Carteiras compatíveis' })).toBeVisible()
  await expect(footer.getByRole('link', { name: 'Facebook' })).toBeVisible()
  await expect(footer.getByText('© 2026 Kurio. Propriedade digital para todos.')).toBeVisible()
  await expect(footer.locator('[aria-hidden="true"]').first()).toHaveCSS(
    'background-color',
    'rgb(210, 138, 76)',
  )

  const footerBounds = await footer.evaluate((element) => {
    const rect = element.getBoundingClientRect()
    const lastCardRect = document
      .querySelector('[aria-labelledby="blog-title"] article:last-child')!
      .getBoundingClientRect()

    return {
      width: rect.width,
      gapAfterBlog: rect.top - lastCardRect.bottom,
    }
  })

  expect(footerBounds.width).toBeLessThanOrEqual(1200)
  expect(footerBounds.gapAfterBlog).toBeGreaterThanOrEqual(80)

  if ((await page.evaluate(() => window.innerWidth)) >= 1280) {
    const footerSections = footer.locator(':scope > div > section')
    await expect(footerSections.first()).toHaveCSS('height', '250px')
    await expect(footerSections.nth(1)).toHaveCSS('height', '88px')
    await expect(footerSections.nth(2)).toHaveCSS('height', '236px')
    await expect(footerSections.first().locator('article').first().locator('p')).toHaveCSS(
      'width',
      '204px',
    )
    await expect(footerSections.first().locator('article').first().locator('p')).toHaveCSS(
      'height',
      '88px',
    )
    await expect(footerSections.first().locator('section button')).toHaveCSS('width', '85px')
    await expect(footerSections.first().locator('section button')).toHaveCSS('height', '40px')
  }
})

test('marketplace grid shows nine NFTs and four pagination controls', async ({ page }) => {
  await page.goto('/')

  const pagination = page.getByRole('navigation', { name: 'Paginação dos NFTs' })
  await expect(page.locator('#mercado ul li')).toHaveCount(9)
  await expect(pagination.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Neon Vessel #552' })).toBeVisible()
  await expect(pagination.getByRole('button', { name: 'Página 4' })).toBeVisible()

  await pagination.getByRole('button', { name: 'Próxima página' }).click()
  await expect(pagination.getByRole('button', { name: 'Página 2' })).toHaveAttribute(
    'aria-current',
    'page',
  )
  await expect(page.locator('#mercado ul li')).toHaveCount(9)

  await pagination.getByRole('button', { name: 'Página 4' }).click()
  await expect(pagination.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
})
