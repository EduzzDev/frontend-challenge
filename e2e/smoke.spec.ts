import { expect, test } from '@playwright/test'

test('home route renders the marketplace storefront', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle('Jungle Gaming — Frontend Challenge')
  await expect(page.getByRole('region', { name: 'NFTs disponíveis' })).toBeVisible()
})

test('mobile home matches the storefront layout and uses the supplied menu icons', async ({ page }) => {
  await page.setViewportSize({ width: 414, height: 896 })
  await page.goto('/')

  await expect(page.getByRole('searchbox', { name: 'Explorar coleções' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Filtros' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'SEJA DONO DA CULTURA DIGITAL' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Menu mobile' })).toBeVisible()
  for (const [label, image] of [
    ['Início', 'home.png'],
    ['Favoritos', 'favorite-heart.png'],
    ['Carrinho', 'carrinho.png'],
    ['Entrar', 'user.png'],
  ]) {
    await expect(page.getByRole('navigation', { name: 'Menu mobile' }).getByRole(label === 'Entrar' ? 'button' : 'link', { name: label }).locator('img')).toHaveAttribute('src', `/images/${image}`)
  }

  const nftRegion = page.getByRole('region', { name: 'NFTs disponíveis' })
  const nftLinks = nftRegion.getByRole('link', { name: /^Ver detalhes de/ })
  const emerald = await nftRegion.getByRole('link', { name: 'Ver detalhes de Emerald Ape #042' }).boundingBox()
  const sage = await nftRegion.getByRole('link', { name: 'Ver detalhes de Sage Nomad #009' }).boundingBox()
  const ivory = await nftRegion.getByRole('link', { name: 'Ver detalhes de Ivory Baron #008' }).boundingBox()
  const golden = await nftRegion.getByRole('link', { name: 'Ver detalhes de Golden Beat #207' }).boundingBox()
  if (!emerald || !sage || !ivory || !golden) throw new Error('Não foi possível medir os cartões da vitrine mobile.')
  expect(emerald.x).toBeLessThan(sage.x)
  expect(Math.abs(emerald.y - sage.y)).toBeLessThanOrEqual(1)
  expect(ivory.x).toBeLessThan(golden.x)
  expect(Math.abs(ivory.y - golden.y)).toBeLessThanOrEqual(1)
  expect(ivory.y).toBeGreaterThan(emerald.y)

  await page.getByRole('button', { name: 'Filtros' }).click()
  await expect(page.getByRole('dialog', { name: 'Filtros do mercado' })).toBeVisible()
  await page.getByRole('button', { name: 'Fechar filtros' }).click()
  await page.getByRole('searchbox', { name: 'Explorar coleções' }).fill('Ivory Baron')
  await expect(nftLinks).toHaveCount(1)
  await expect(nftLinks).toHaveAccessibleName('Ver detalhes de Ivory Baron #008')
})

test('320px mobile layout keeps promotional content and footer readable', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/')

  const promotionalBanners = page.getByRole('region', { name: 'Destaques do marketplace' })
  const firstBanner = promotionalBanners.locator('article').first()
  const bannerImage = await firstBanner.locator('img').boundingBox()
  const bannerHeading = await firstBanner.getByRole('heading').boundingBox()
  const bannerDescription = await firstBanner.locator('p').boundingBox()
  const bannerLink = await firstBanner.getByRole('link').boundingBox()

  if (!bannerImage || !bannerHeading || !bannerDescription || !bannerLink) {
    throw new Error('Não foi possível medir o banner promocional no mobile.')
  }
  expect(bannerHeading.y).toBeGreaterThanOrEqual(bannerImage.y + bannerImage.height)
  expect(bannerDescription.y).toBeGreaterThanOrEqual(bannerHeading.y + bannerHeading.height)
  expect(bannerLink.y).toBeGreaterThanOrEqual(bannerDescription.y + bannerDescription.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)

  await expect(page.getByRole('region', { name: 'Destaques e novidades' }).getByText('Alertas de lançamentos')).toBeVisible()
  await expect(page.getByRole('region', { name: 'Destaques e novidades' })).not.toContainText('cunhagem')
})

test('application routes load when opened directly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/cart')
  await expect(page.getByRole('navigation', { name: 'Menu mobile' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'NFTs' })).toBeVisible()

  await page.goto('/checkout')
  await expect(page.getByRole('navigation', { name: 'Menu mobile' })).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Entre para continuar com o pagamento' })).toBeVisible()

  await page.goto('/nft/emerald-ape-042')
  await expect(page.locator('#nft-title')).toHaveText('Emerald Ape #042')
})

test('NFT detail matches the mobile product layout with a fixed purchase bar', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.goto('/nft/emerald-ape-042')

  await expect(page.getByRole('link', { name: 'Voltar ao mercado' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Adicionar aos favoritos' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expect(page.getByText('4.8', { exact: true })).toBeVisible()
  await expect(page.getByRole('group', { name: 'Opções de edição' }).getByRole('button')).toHaveCount(4)
  await expect(page.getByRole('region', { name: 'Compra do NFT' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Comprar NFT' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Adicionar ao carrinho' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Menu mobile' })).toHaveCount(0)

  const artwork = await page.getByRole('img', { name: 'NFT Emerald Ape #042' }).boundingBox()
  const title = await page.getByRole('heading', { name: 'Emerald Ape #042' }).boundingBox()
  if (!artwork || !title) throw new Error('Não foi possível medir a arte e o título no layout mobile.')
  expect(title.y).toBeGreaterThan(artwork.y + artwork.height)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320)

  await page.getByRole('button', { name: 'Aumentar quantidade' }).click()
  await expect(page.getByLabel('Quantidade selecionada')).toHaveText('2')
  await page.getByRole('button', { name: 'Adicionar ao carrinho' }).click()
  await expect(page).toHaveURL(/\/nft\/emerald-ape-042$/)
})

test('marketplace NFT opens its detail page with aligned related artwork and existing footer', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Ver detalhes de Emerald Ape #042' }).click()

  await expect(page).toHaveURL(/\/nft\/emerald-ape-042$/)
  await expect(page.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  const marketplaceLink = page.locator('header a[href="/#mercado"]')
  await expect(marketplaceLink).toHaveAttribute('aria-current', 'page')
  await expect(marketplaceLink).toHaveCSS('color', 'rgb(210, 138, 76)')
  await expect(marketplaceLink).toHaveCSS('font-weight', '700')
  if ((await page.evaluate(() => window.innerWidth)) >= 768) {
    await expect(page.getByRole('navigation', { name: 'Navegação estrutural' })).toBeVisible()
  } else {
    await expect(page.getByRole('navigation', { name: 'Navegação estrutural' })).toBeHidden()
  }
  await expect(page.getByRole('heading', { name: 'Mais desta coleção' })).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()

  await expect(page.getByRole('list', { name: 'Redes sociais' }).getByRole('link')).toHaveCount(5)

  const mainNftImage = page.getByRole('img', { name: 'NFT Emerald Ape #042' }).first()
  const mainImageSource = await mainNftImage.getAttribute('src')
  const galleryOptions = page.getByRole('button', { name: /^Ver imagem \d de Emerald Ape$/ })
  if ((await page.evaluate(() => window.innerWidth)) >= 768) {
    await expect(galleryOptions).toHaveCount(4)
    for (const option of await galleryOptions.all()) {
      await expect(option.locator('img')).toHaveAttribute('src', mainImageSource!)
    }
    await galleryOptions.nth(2).click()
    await expect(galleryOptions.nth(2)).toHaveAttribute('aria-pressed', 'true')
    await expect(mainNftImage).toHaveAttribute('src', mainImageSource!)
  } else {
    await expect(galleryOptions).toHaveCount(0)
  }

  const editions = page.getByRole('group', { name: 'Opções de edição' })
  await expect(editions.getByRole('button', { name: '1/50' })).toHaveAttribute('aria-pressed', 'true')
  await editions.getByRole('button', { name: '1/10' }).click()
  await expect(editions.getByRole('button', { name: '1/10' })).toHaveAttribute('aria-pressed', 'true')
  await expect(editions.getByRole('button', { name: '1/50' })).toHaveAttribute('aria-pressed', 'false')

  const quantity = page.getByLabel('Quantidade', { exact: true })
  const decreaseQuantity = page.getByRole('button', { name: 'Diminuir quantidade' })
  const increaseQuantity = page.getByRole('button', { name: 'Aumentar quantidade' })
  await expect(quantity).toHaveText('1')
  await expect(decreaseQuantity).toBeDisabled()
  for (const button of [decreaseQuantity, increaseQuantity]) {
    if ((await page.evaluate(() => window.innerWidth)) >= 768) {
      await expect(button).toHaveCSS('width', '33px')
      await expect(button).toHaveCSS('height', '49.5px')
      await expect(button).toHaveCSS('border-top-width', '1px')
      const borderRadius = await button.evaluate((element) =>
        Number.parseFloat(getComputedStyle(element).borderTopLeftRadius),
      )
      expect(borderRadius).toBeGreaterThanOrEqual(24.75)
    } else {
      await expect(button).toHaveCSS('width', '20px')
      await expect(button).toHaveCSS('height', '30px')
    }
  }
  await increaseQuantity.click()
  await expect(quantity).toHaveText('2')
  await decreaseQuantity.click()
  await expect(quantity).toHaveText('1')

  const tokenDetails = page.locator('dl')
  const isDesktopViewport = (await page.evaluate(() => window.innerWidth)) >= 768
  await expect(tokenDetails).toHaveCSS('font-size', '15px')
  await expect(tokenDetails).toHaveCSS('font-weight', '400')
  await expect(tokenDetails).toHaveCSS('line-height', isDesktopViewport ? '20px' : '15px')
  await expect(tokenDetails).toHaveCSS('color', 'rgb(179, 148, 99)')

  if (isDesktopViewport) {
    const shareOptions = page.getByRole('navigation', { name: 'Compartilhar este NFT' })
    await expect(shareOptions.getByRole('link')).toHaveCount(3)
    await expect(shareOptions.getByRole('link', { name: 'Compartilhar no LinkedIn' })).toHaveAttribute(
      'href',
      /linkedin\.com\/sharing\/share-offsite\/\?url=/,
    )
    await expect(shareOptions.getByRole('link', { name: 'Compartilhar por e-mail' })).toHaveAttribute(
      'href',
      /^mailto:/,
    )
    await expect(shareOptions.getByRole('link', { name: 'Compartilhar no Twitter' })).toHaveAttribute(
      'href',
      /twitter\.com\/intent\/tweet\?url=/,
    )
    const shareLabel = page.getByText('Compartilhar este NFT:', { exact: true })
    const labelBounds = await shareLabel.boundingBox()
    const linkedinBounds = await shareOptions.getByRole('link', { name: 'Compartilhar no LinkedIn' }).boundingBox()
    expect(labelBounds).not.toBeNull()
    expect(linkedinBounds).not.toBeNull()
    expect(Math.abs(labelBounds!.y + labelBounds!.height / 2 - (linkedinBounds!.y + linkedinBounds!.height / 2))).toBeLessThan(2)
  }

  const relatedImages = page.getByRole('region', { name: 'Mais desta coleção' }).getByRole('img')
  await expect(relatedImages).toHaveCount(5)
  for (const image of await relatedImages.all()) {
    await expect(image).toHaveCSS('object-fit', 'contain')
    await expect(image.locator('..')).toHaveClass(/aspect-square/)
  }

  if ((await page.evaluate(() => window.innerWidth)) >= 1024) {
    await page
      .getByRole('navigation', { name: 'Navegação principal' })
      .getByRole('link', { name: 'Mercado', exact: true })
      .click()
    await expect(page).toHaveURL(/\/(?:\?[^#]*)?#mercado$/)
    await expect(page.getByRole('region', { name: 'NFTs disponíveis' })).toBeVisible()
  }
})

test('market navigation returns to collections and marketplace filters update the NFTs', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  const marketLink = page
    .getByRole('navigation', { name: 'Navegação principal' })
    .getByRole('link', { name: 'Mercado', exact: true })
  await marketLink.click()

  await expect(page).toHaveURL(/\/(?:\?[^#]*)?#mercado$/)
  await expect(marketLink).toHaveAttribute('aria-current', 'page')
  await expect(marketLink).toHaveCSS('color', 'rgb(210, 138, 76)')
  await expect(marketLink).toHaveCSS('font-weight', '700')
  await expect(marketLink).toHaveCSS('height', '45px')
  const marketplace = page.getByRole('region', { name: 'NFTs disponíveis' })
  await expect(marketplace).toBeVisible()

  await page.getByRole('button', { name: /Arte digital/ }).click()
  await expect(marketplace.getByRole('link')).toHaveCount(4)
  await expect(marketplace.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()

  await page.getByRole('button', { name: /Arte digital/ }).click()
  await page.getByRole('button', { name: /Polygon/ }).click()
  await expect(marketplace.getByRole('link')).toHaveCount(9)
  await expect(marketplace.getByRole('heading', { name: 'Sage Nomad #009' })).toBeVisible()
  await expect(marketplace.getByRole('heading', { name: 'Violet Nomad #314' })).toBeVisible()

  const maximumPrice = page.getByRole('slider', { name: 'Preço máximo' })
  await maximumPrice.focus()
  await maximumPrice.press('Home')
  for (let step = 0; step < 47; step += 1) {
    await maximumPrice.press('ArrowRight')
  }
  await expect(page.getByText('Preço: 0,02 - 0,50 ETH')).toBeVisible()
  await page.getByRole('button', { name: /Aplicar faixa de preço/ }).click()
  await expect(marketplace.getByRole('link')).toHaveCount(1)
  await expect(marketplace.getByRole('heading', { name: 'Golden Signal #160' })).toBeVisible()
  await expect(marketplace.getByRole('heading', { name: 'Sage Nomad #009' })).toHaveCount(0)
})

test('cart header opens the cart and buying an NFT adds the selected quantity', async ({ page }) => {
  await page.goto('/')
  if ((await page.evaluate(() => window.innerWidth)) < 768) {
    await page.getByRole('navigation', { name: 'Menu mobile' }).getByRole('link', { name: 'Carrinho' }).click()
  } else {
    await page.locator('a[href="/cart"]').first().click()
  }

  await expect(page).toHaveURL(/\/cart$/)
  const cartItems = page.getByRole('region', { name: 'Itens do carrinho' })
  if ((await page.evaluate(() => window.innerWidth)) < 768) {
    await expect(cartItems.getByRole('heading', { name: 'NFTs', exact: true })).toBeVisible()
    await expect(cartItems.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
    await expect(cartItems.getByRole('heading', { name: 'Violet Nomad #314' })).toBeVisible()
    await expect(cartItems.getByRole('heading', { name: 'Ivory Baron #008' })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
      await page.evaluate(() => window.innerWidth),
    )
    await page.getByRole('button', { name: 'Conectar e finalizar' }).click()
    await expect(page).toHaveURL(/\/checkout$/)
    await expect(page.getByRole('heading', { name: 'Entre para continuar com o pagamento' })).toBeVisible()
    return
  }
  await expect(page.getByRole('heading', { name: 'Resumo da carteira' })).toBeVisible()
  await expect(cartItems.getByRole('heading', { name: 'Emerald Ape #042' })).toBeVisible()
  await expect(cartItems.getByRole('heading', { name: 'Violet Nomad #314' })).toBeVisible()
  await expect(cartItems.getByRole('heading', { name: 'Ivory Baron #008' })).toBeVisible()
  await expect(page.getByText('26.83 ETH')).toBeVisible()
  await expect(page.getByText('26.846 ETH')).toBeVisible()

  const recommendations = page.getByRole('region', { name: 'Colecionadores também viram' })
  await expect(recommendations.getByRole('listitem')).toHaveCount(5)
  for (const name of [
    'Cosmic Bloom #118',
    'Violet Nomad #314',
    'Ivory Baron #008',
    'Golden Beat #207',
    'Golden Signal #160',
  ]) {
    await expect(recommendations.getByRole('link', { name: `Ver detalhes de ${name}` })).toBeVisible()
  }
  await expect(recommendations.locator('img')).toHaveCount(5)
  await expect(recommendations.getByLabel('Página 2 de 3')).toBeVisible()
  await expect(recommendations).not.toHaveCSS('border-top-width', '1px')
  await expect(recommendations.getByRole('heading', { name: 'Colecionadores também viram' }))
    .toHaveCSS('font-size', '17px')
  await expect(recommendations.getByRole('heading', { name: 'Colecionadores também viram' }))
    .toHaveCSS('border-bottom-width', '1px')
  await expect(recommendations.locator('ul')).toHaveCSS('border-bottom-width', '0px')
  await expect(recommendations.locator('h3').first()).toHaveCSS('font-size', '15px')
  await expect(recommendations.locator('h3').first()).toHaveCSS('line-height', '20px')
  await expect(recommendations.locator('p').first()).toHaveCSS('font-size', '16px')
  await expect(recommendations.locator('p').first()).toHaveCSS('color', 'rgb(232, 155, 85)')
  expect(await recommendations.evaluate((element) => {
    const footer = document.querySelector('footer')
    return footer !== null && Boolean(element.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING)
  })).toBe(true)

  const summary = page.getByRole('complementary', { name: 'Resumo da carteira' })
  for (const label of ['Subtotal', 'Desconto do lançamento', 'Taxa de rede']) {
    await expect(summary.locator('dt').filter({ hasText: label })).toHaveCSS('font-size', '15px')
    await expect(summary.locator('dt').filter({ hasText: label })).toHaveCSS('font-weight', '400')
    await expect(summary.locator('dt').filter({ hasText: label })).toHaveCSS('line-height', '15px')
    await expect(summary.locator('dt').filter({ hasText: label }).locator('..')).toHaveCSS('height', '20px')
  }
  const subtotalValue = summary.locator('dd').filter({ hasText: '26.83 ETH' })
  await expect(subtotalValue).toHaveCSS('width', '98px')
  await expect(subtotalValue).toHaveCSS('font-size', '18px')
  await expect(subtotalValue).toHaveCSS('font-weight', '400')
  await expect(subtotalValue).toHaveCSS('line-height', '16px')
  const totalLabel = summary.getByText('Total', { exact: true })
  await expect(totalLabel).toHaveCSS('font-size', '15px')
  await expect(totalLabel).toHaveCSS('font-weight', '700')
  await expect(totalLabel).toHaveCSS('line-height', '16px')
  const totalValue = summary.locator('dd').filter({ hasText: '26.846 ETH' })
  await expect(totalValue).toHaveCSS('width', '109px')
  await expect(totalValue).toHaveCSS('font-size', '18px')
  await expect(totalValue).toHaveCSS('font-weight', '700')
  await expect(totalValue).toHaveCSS('line-height', '16px')
  const checkoutButton = summary.getByRole('button', { name: 'Conectar e finalizar' })
  await expect(checkoutButton).toHaveCSS('font-size', '15px')
  await expect(checkoutButton).toHaveCSS('font-weight', '700')
  await expect(checkoutButton).toHaveCSS('line-height', '16px')
  await expect(checkoutButton).toHaveCSS('color', 'rgb(20, 13, 10)')
  const continueExploring = summary.getByRole('link', { name: 'Continuar explorando' })
  await expect(continueExploring).toHaveCSS('font-size', '15px')
  await expect(continueExploring).toHaveCSS('font-weight', '400')
  await expect(continueExploring).toHaveCSS('line-height', '15px')
  await expect(continueExploring).toHaveCSS('color', 'rgb(232, 155, 85)')
  await checkoutButton.click()
  await expect(page).toHaveURL(/\/checkout$/)
  await expect(page.getByRole('heading', { name: 'Entre para continuar com o pagamento' })).toBeVisible()
  await page.getByRole('button', { name: 'Entrar' }).click()
  const loginDialog = page.getByRole('dialog')
  await loginDialog.getByPlaceholder('contato@email.com').fill('colecionador@kurio.test')
  await loginDialog.getByPlaceholder('Senha', { exact: true }).fill('Kurio123!')
  await loginDialog.locator('form').getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Seus NFTs' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Confirmar compra' })).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Perfil do colecionador' })).toHaveCSS('font-size', '17px')
  const walletOptions = page.getByRole('group', { name: 'Carteira e rede' })
  const walletHeading = walletOptions.locator('legend')
  await expect(walletHeading).toHaveCSS('font-size', '17px')
  await expect(walletHeading).toHaveCSS('font-weight', '700')
  await expect(walletHeading).toHaveCSS('line-height', '16px')
  await expect(walletOptions.locator('label')).toHaveCount(3)
  for (const label of ['MetaMask', 'Coinbase Wallet']) {
    const walletLabel = walletOptions.locator('label').filter({ hasText: label }).last()
    await expect(walletLabel).toHaveCSS('height', '44px')
    await expect(walletLabel).toHaveCSS('font-size', '15px')
    await expect(walletLabel).toHaveCSS('font-weight', '400')
  }
  const providerBadge = walletOptions.getByText('METAMASK · WALLETCONNECT · COINBASE')
  await expect(providerBadge).toBeVisible()
  await expect(providerBadge).toHaveCSS('width', '215px')
  await expect(providerBadge).toHaveCSS('height', '12px')
  await expect(providerBadge).toHaveCSS('font-size', '9px')
  await expect(providerBadge).toHaveCSS('font-weight', '700')
  await expect(providerBadge).toHaveCSS('line-height', '9px')
  await expect(providerBadge).toHaveCSS('letter-spacing', '0.1px')
  const confirmPurchase = page.getByRole('button', { name: 'Confirmar compra' })
  await expect(confirmPurchase).toHaveCSS('height', '44px')
  await expect(confirmPurchase).toHaveCSS('font-size', '15px')
  await expect(confirmPurchase).toHaveCSS('font-weight', '700')
  const ensName = page.getByRole('combobox', { name: 'Nome ENS' })
  await expect(ensName).toHaveValue('.eth')
  await expect(ensName).toHaveCSS('width', '80px')
  await expect(ensName).toHaveCSS('height', '40px')
  const profileName = page.getByLabel('Nome do perfil')
  const walletType = page.getByLabel('Tipo de carteira')
  const referralCode = page.getByLabel('Código de indicação')
  await expect(walletType).toBeVisible()
  if ((await page.evaluate(() => window.innerWidth)) >= 640) {
    const networkBox = await page.locator('form select[name="network"]').boundingBox()
    const profileNameBox = await profileName.boundingBox()
    const walletTypeBox = await walletType.boundingBox()
    const referralCodeBox = await referralCode.boundingBox()
    const emailBox = await page.locator('form').getByLabel('E-mail').boundingBox()
    const ensNameBox = await ensName.boundingBox()
    const useSecondaryWalletBox = await page.getByText('Usar outra carteira?', { exact: true }).boundingBox()
    if (!networkBox || !profileNameBox || !walletTypeBox || !referralCodeBox || !emailBox || !ensNameBox || !useSecondaryWalletBox) {
      throw new Error('Não foi possível medir o posicionamento dos campos do colecionador.')
    }
    expect(networkBox.x).toBeLessThan(profileNameBox.x)
    expect(Math.abs(networkBox.y - profileNameBox.y)).toBeLessThanOrEqual(1)
    expect(walletTypeBox.x).toBeLessThan(referralCodeBox.x)
    expect(Math.abs(walletTypeBox.y - referralCodeBox.y)).toBeLessThanOrEqual(1)
    expect(emailBox.x).toBeLessThan(ensNameBox.x)
    expect(Math.abs(emailBox.y - ensNameBox.y)).toBeLessThanOrEqual(1)
    expect(useSecondaryWalletBox.y - (ensNameBox.y + ensNameBox.height)).toBeLessThanOrEqual(14)
  }
  const checkoutNfts = page.getByLabel('NFTs para pagamento')
  await expect(checkoutNfts.getByRole('listitem')).toHaveCount(3)
  const checkoutEmerald = checkoutNfts.getByRole('listitem').filter({ hasText: 'Emerald Ape #042' })
  await expect(checkoutEmerald.getByRole('heading', { name: 'Emerald Ape #042' })).toHaveCSS('font-size', '16px')
  await expect(checkoutEmerald.getByRole('heading', { name: 'Emerald Ape #042' })).toHaveCSS('font-weight', '700')
  await expect(checkoutEmerald.getByText('ID do token: #0042')).toHaveCSS('font-size', '14px')
  await expect(checkoutEmerald.getByText('(x 2)')).toHaveCSS('font-size', '17px')
  await expect(checkoutEmerald.getByText('2.38 ETH')).toHaveCSS('font-size', '16px')
  await expect(checkoutEmerald.getByText('2.38 ETH')).toHaveCSS('font-weight', '700')
  const requiredFields = page.locator('form input[required]')
  for (const [index, value] of [
    'Collector',
    'collector42',
    'Kurio Collector',
    '0x1234567890abcdef',
    'INVITE42',
    'collector@example.com',
  ].entries()) {
    await requiredFields.nth(index).fill(value)
  }
  await page.locator('form select[required]').nth(0).selectOption({ label: 'Ethereum' })
  await page.locator('form select[name="walletType"]').selectOption({ label: 'Carteira própria' })
  await page.locator('input[name="payment-wallet"][value="metamask"]').check()
  await page.getByRole('button', { name: 'Confirmar compra' }).click()
  await expect(page.getByRole('heading', { name: 'Seus NFTs foram adicionados ao pedido' })).toBeVisible()
  await expect(page.getByLabel('Dados do pedido')).toContainText(/0x[a-f0-9]+/i)
  const receiptItems = page.getByRole('list', { name: 'NFTs do pedido' })
  await expect(receiptItems.getByRole('listitem')).toHaveCount(3)
  await expect(receiptItems).toContainText('Emerald Ape #042')
  await expect(receiptItems).toContainText('(x 2)')
  await expect(receiptItems).toContainText('Violet Nomad #314')
  await expect(receiptItems).toContainText('(x 6)')
  await expect(receiptItems).toContainText('Ivory Baron #008')
  await expect(receiptItems).toContainText('(x 9)')
  await expect(page.getByText('Rede Polygon')).toBeVisible()
  await expect(page.getByText('0.016 ETH', { exact: true })).toBeVisible()
  const confirmationIcon = page.locator('section[aria-live="polite"] svg[viewBox="0 0 66 80"]')
  await expect(confirmationIcon).toHaveAttribute('viewBox', '0 0 66 80')
  await expect(confirmationIcon).toHaveAttribute('width', '66')
  await expect(confirmationIcon).toHaveAttribute('height', '80')
  const confirmation = page.locator('section[aria-live="polite"]')
  await expect(confirmation).not.toHaveCSS('border-width', '1px')
  await expect(confirmation.getByText('26.846 ETH', { exact: true }).last()).toBeVisible()
  await expect(receiptItems).toContainText('2.38 ETH')
  await expect(receiptItems).toContainText('8.34 ETH')
  await expect(receiptItems).toContainText('16.11 ETH')
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await page.goto('/cart')
  await expect(page.getByText(/Seu carrinho está vazio/)).toBeVisible()

  await page.goto('/nft/emerald-ape-042')
  await page.getByRole('button', { name: 'Aumentar quantidade' }).click()
  await page.getByRole('button', { name: 'Aumentar quantidade' }).click()
  await page.getByRole('button', { name: 'COMPRAR' }).click()

  await expect(page).toHaveURL(/\/cart$/)
  const purchasedNftRow = page.getByRole('listitem').filter({ hasText: 'Emerald Ape #042' }).first()
  await expect(purchasedNftRow).toBeVisible()
  const quantityGroup = purchasedNftRow.getByRole('group', { name: 'Edições de Emerald Ape #042' }).filter({ visible: true }).first()
  await expect(quantityGroup.getByText('3', { exact: true })).toBeVisible()
})

test('authentication modal switches to signup and toggles password visibility', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Entrar' }).click()

  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  const dialogBounds = await dialog.boundingBox()
  const viewport = page.viewportSize()
  expect(dialogBounds).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(dialogBounds!.x + dialogBounds!.width / 2).toBeCloseTo(viewport!.width / 2, 0)
  expect(dialogBounds!.y + dialogBounds!.height / 2).toBeCloseTo(viewport!.height / 2, 0)
  if ((viewport?.width ?? 0) <= 700) {
    await dialog.getByRole('button', { name: /Novo na Kurio/ }).click()
  } else {
    await dialog.getByRole('button', { name: 'Criar conta', exact: true }).click()
  }

  const isMobileModal = (viewport?.width ?? 0) <= 700
  if (isMobileModal) {
    await expect(dialog.getByRole('heading', { name: 'Criar perfil de colecionador' })).toHaveCSS('font-size', '16px')
  } else {
    const title = dialog.locator('#auth-modal-title')
    await expect(title).toHaveCSS('font-size', '20px')
    await expect(title).toHaveCSS('font-weight', '500')
    await expect(title).toHaveCSS('line-height', '16px')
    await expect(title.getByRole('button', { name: 'Criar conta' })).toHaveCSS('color', 'rgb(210, 138, 76)')
    await expect(dialog.locator('[aria-hidden="true"].bg-primary')).toHaveCSS('height', '10px')
  }
  await expect(dialog.getByPlaceholder('Nome de usuário')).toBeVisible()
  await expect(dialog.getByPlaceholder('Digite seu e-mail')).toBeVisible()
  await expect(dialog.getByPlaceholder('Confirmar senha')).toBeVisible()
  await expect(dialog.getByRole('button', { name: 'Continuar com Google' })).toBeVisible()
  const signupFormBounds = await dialog.locator('form').boundingBox()
  const googleButtonBounds = await dialog.getByRole('button', { name: 'Continuar com Google' }).boundingBox()
  expect(signupFormBounds).not.toBeNull()
  expect(googleButtonBounds).not.toBeNull()
  const expectedSocialSpacing = (page.viewportSize()?.width ?? 0) <= 700 ? 68 : 52
  expect(googleButtonBounds!.y - signupFormBounds!.y - signupFormBounds!.height).toBeCloseTo(
    expectedSocialSpacing,
    0,
  )

  const passwordInput = dialog.getByPlaceholder('Senha', { exact: true })
  await expect(passwordInput).toHaveAttribute('type', 'password')
  await passwordInput.locator('xpath=..').getByRole('button', { name: 'Mostrar senha' }).click()
  await expect(passwordInput).toHaveAttribute('type', 'text')

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
})

test('authentication modal fits HD and short viewport sizes', async ({ page }) => {
  await page.goto('/')

  for (const viewport of [{ width: 1280, height: 720 }, { width: 643, height: 598 }]) {
    await page.setViewportSize(viewport)
    await page.getByRole('button', { name: 'Entrar' }).click()

    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    const dialogBounds = await dialog.boundingBox()
    expect(dialogBounds).not.toBeNull()
    const mobileModal = viewport.width <= 700
    expect(dialogBounds!.width).toBe(mobileModal ? Math.min(414, viewport.width) : 500)
    expect(dialogBounds!.height).toBeLessThanOrEqual(
      mobileModal ? viewport.height : Math.min(656, viewport.height - 16),
    )
    if (!mobileModal && viewport.height >= 720) expect(dialogBounds!.height).toBe(656)
    expect(dialogBounds!.x + dialogBounds!.width / 2).toBeCloseTo(viewport.width / 2, 0)
    expect(dialogBounds!.y + dialogBounds!.height / 2).toBeCloseTo(viewport.height / 2, 0)

    if (mobileModal) {
      await dialog.getByRole('button', { name: /Novo na Kurio/ }).click()
    } else {
      await dialog.getByRole('button', { name: 'Criar conta', exact: true }).click()
    }
    const facebookButton = await dialog.getByRole('button', { name: 'Continuar com Facebook' }).boundingBox()
    const footerStripe = await dialog.locator('[aria-hidden="true"].bg-primary').boundingBox()
    expect(facebookButton).not.toBeNull()
    if (mobileModal) {
      await expect(dialog.getByText('KURIO', { exact: true })).toBeVisible()
    } else {
      expect(footerStripe).not.toBeNull()
      expect(footerStripe!.y - facebookButton!.y - facebookButton!.height).toBeGreaterThanOrEqual(16)
      expect(
        Math.abs(footerStripe!.y + footerStripe!.height - dialogBounds!.y - dialogBounds!.height),
      ).toBeLessThanOrEqual(1)

      const closeButton = await dialog.getByRole('button', { name: 'Fechar' }).boundingBox()
      expect(closeButton).not.toBeNull()
      expect(closeButton!.x).toBeGreaterThanOrEqual(dialogBounds!.x + 20)
      expect(closeButton!.y).toBeGreaterThanOrEqual(dialogBounds!.y + 20)
    }

    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()
  }
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
  const isDesktopBanner = (await page.evaluate(() => window.innerWidth)) >= 640
  await expect(title).toHaveCSS('font-size', isDesktopBanner ? '18px' : '16px')
  await expect(title).toHaveCSS('font-weight', '700')
  await expect(title).toHaveCSS('line-height', '24px')
  await expect(title).toHaveCSS('text-align', isDesktopBanner ? 'right' : 'center')
  if (isDesktopBanner) {
    await expect(title).toHaveCSS('width', '260px')
    await expect(title).toHaveCSS('height', '48px')
  }
  await expect(title).toHaveCSS('margin-top', '0px')
  await expect(description).toHaveCSS('font-size', isDesktopBanner ? '14px' : '12px')
  await expect(description).toHaveCSS('font-weight', '400')
  await expect(description).toHaveCSS('line-height', isDesktopBanner ? '24px' : '20px')
  if (isDesktopBanner) {
    await expect(description).toHaveCSS('text-align', 'right')
    await expect(description).toHaveCSS('width', '233px')
    await expect(description).toHaveCSS('height', '45px')
    await expect(description).toHaveCSS('margin-top', '9px')
    await expect(collectionDescription).toHaveCSS('width', '236px')
    await expect(collectionDescription).toHaveCSS('height', '45px')
    await expect(collectionDescription).toHaveCSS('margin-top', '9px')
  }
  await expect(collectionDescription.locator('br')).toHaveCount(0)
  await expect(collectionDescription).toHaveText(
    /Explore novos artistas,\s+coleções verificadas e obras\s+digitais que definem a cultura\./,
  )
  if (isDesktopBanner) {
    await expect(bannerSection.getByRole('link', { name: 'Explorar' }).first()).toHaveCSS(
      'margin-top',
      '25px',
    )
  }
  const launchImage = bannerSection.getByRole('img', { name: 'Macaco usando óculos e jaqueta verde' })
  await expect(launchImage).toHaveCSS('border-top-left-radius', isDesktopBanner ? '18px' : '12px')
  const cornerCircle = bannerSection.locator('article').first().locator('svg circle')
  await expect(cornerCircle).toHaveCount(2)
  await expect(cornerCircle.nth(0)).toHaveAttribute('r', '130')
  await expect(cornerCircle.nth(1)).toHaveAttribute('r', '128')
  await expect(cornerCircle.first()).toHaveAttribute('stroke', 'var(--color-primary)')
  const secondBannerCircle = bannerSection.locator('article').nth(1).locator('svg circle')
  await expect(secondBannerCircle).toHaveCount(2)
  await expect(secondBannerCircle.first().locator('xpath=../..')).toHaveCSS('overflow', 'hidden')
  const collectionImage = bannerSection.getByRole('img', { name: 'Macaco usando terno claro' })
  await expect(collectionImage).toHaveCSS('border-top-left-radius', isDesktopBanner ? '17px' : '12px')
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
      const titleRect = article.querySelector('h2')!.getBoundingClientRect()
      const descriptionRect = article.querySelector('p')!.getBoundingClientRect()
      const actionRect = article.querySelector('a')!.getBoundingClientRect()

      return {
        titleBottom: titleRect.bottom,
        descriptionTop: descriptionRect.top,
        descriptionBottom: descriptionRect.bottom,
        actionTop: actionRect.top,
        titleRight: titleRect.right,
        descriptionRight: descriptionRect.right,
      }
    })

    expect(textPositions.descriptionTop).toBeGreaterThan(textPositions.titleBottom)
    expect(textPositions.actionTop).toBeGreaterThan(textPositions.descriptionBottom)
    expect(Math.abs(textPositions.titleRight - textPositions.descriptionRight)).toBeLessThanOrEqual(1)

    const collectionTextPositions = await bannerSection.locator('article').nth(1).evaluate((article) => {
      const articleRect = article.getBoundingClientRect()
      const descriptionRect = article.querySelector('p')!.getBoundingClientRect()

      return {
        x: descriptionRect.x - articleRect.x,
        right: descriptionRect.right - articleRect.x,
        articleWidth: articleRect.width,
        width: descriptionRect.width,
      }
    })

    expect(collectionTextPositions.x).toBeGreaterThanOrEqual(0)
    expect(collectionTextPositions.right).toBeLessThanOrEqual(collectionTextPositions.articleWidth)
    expect(collectionTextPositions.width).toBeGreaterThan(0)
  }
  const exploreLinks = bannerSection.getByRole('link', { name: 'Explorar' })
  await expect(exploreLinks).toHaveCount(2)
  for (const link of await exploreLinks.all()) {
    await expect(link).toHaveAttribute('href', '#mercado')
  }
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
    await expect(footerSections.nth(1)).toHaveCSS('height', '104px')
    await expect(footerSections.nth(2)).toHaveCSS('height', '236px')
    await expect(footerSections.first().locator('article').first().locator('p')).toHaveCSS(
      'max-width',
      '280px',
    )
    await expect(footerSections.first().locator('article').first().locator('p')).toHaveCSS(
      'height',
      '66px',
    )
    await expect(footerSections.first().locator('section button')).toHaveCSS('width', '85px')
    await expect(footerSections.first().locator('section button')).toHaveCSS('height', '40px')
  }
})

test('marketplace keeps nine NFTs per page and four populated pages', async ({ page }) => {
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
  await expect(page.getByRole('heading', { name: 'Jade Guardian #073' })).toBeVisible()

  await pagination.getByRole('button', { name: 'Página 3' }).click()
  await expect(page.locator('#mercado ul li')).toHaveCount(9)
  await expect(page.getByRole('heading', { name: 'Saffron Scout #204' })).toBeVisible()

  await pagination.getByRole('button', { name: 'Página 4' }).click()
  await expect(page.locator('#mercado ul li')).toHaveCount(9)
  await expect(page.getByRole('heading', { name: 'Sunlit Sage #346' })).toBeVisible()
  await expect(pagination.getByRole('button', { name: 'Próxima página' })).toBeDisabled()
})
