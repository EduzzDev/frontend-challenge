import { useState, type FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { changePassword, getProfile, saveProfile } from '@/api/profile'
import { getOrders } from '@/api/orders'
import { getWallets, saveWallets } from '@/api/wallets'
import { HomeFooter } from '@/components/home-footer'
import { HomeHeader } from '@/components/home-header'
import { useCurrentUserKey } from '@/hooks/use-cart'
import { useSession } from '@/hooks/use-session'
import type { Wallet } from '@/types/domain'
import { createId } from '@/lib/id'

function AccountShell({ title, children }: { title: string; children: React.ReactNode }) {
  const { session } = useSession()
  const hasToken = Boolean(window.localStorage.getItem('kurio-session-token'))
  return (
    <>
      <HomeHeader activeHref="#mercado" navigationPrefix="/" />
      <main className="mx-auto min-h-[55vh] w-full max-w-300 px-4 py-10 font-mono md:px-6 xl:px-0">
        {!hasToken ? <section className="rounded-xl bg-card p-8"><h1 className="text-xl font-bold">Entre para acessar sua conta</h1><p className="mt-3 text-sm text-text-secondary">Use o botão Entrar no cabeçalho e depois volte para esta página.</p></section>
          : !session ? <p aria-live="polite">Carregando sessão…</p>
            : <section aria-labelledby="account-page-title"><h1 className="mb-6 text-2xl font-bold text-foreground" id="account-page-title">{title}</h1>{children}</section>}
      </main>
      <HomeFooter />
    </>
  )
}

export function ProfilePage() {
  const userId = useCurrentUserKey()
  const queryClient = useQueryClient()
  const profile = useQuery({ queryKey: ['profile', userId], queryFn: getProfile, enabled: Boolean(window.localStorage.getItem('kurio-session-token')) })
  const [message, setMessage] = useState('')
  const save = useMutation({ mutationFn: saveProfile, onSuccess: (user) => queryClient.setQueryData(['profile', userId], user) })
  const password = useMutation({ mutationFn: ({ current, next }: { current: string; next: string }) => changePassword(current, next) })

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setMessage('')
    save.mutate({ displayName: String(data.get('displayName')), username: String(data.get('username')) }, { onSuccess: () => setMessage('Perfil atualizado.') })
  }

  function submitPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setMessage('')
    password.mutate({ current: String(data.get('currentPassword')), next: String(data.get('newPassword')) }, { onSuccess: () => setMessage('Senha atualizada.'), onError: (error) => setMessage(error.message) })
  }

  return <AccountShell title="Perfil do colecionador">
    {profile.isPending ? <div aria-busy="true" className="h-48 animate-pulse rounded-xl bg-card" /> : profile.error ? <p role="alert">{profile.error.message}</p> : <>
      <form className="grid max-w-2xl gap-4 rounded-xl bg-card p-6 sm:grid-cols-2" onSubmit={submitProfile}>
        <label className="grid gap-2 text-sm">Nome de exibição<input className="rounded border border-border bg-background p-3" defaultValue={profile.data?.displayName} name="displayName" required /></label>
        <label className="grid gap-2 text-sm">Nome de usuário<input className="rounded border border-border bg-background p-3" defaultValue={profile.data?.username} name="username" required /></label>
        <button className="rounded bg-primary p-3 font-bold text-primary-foreground sm:col-span-2" disabled={save.isPending} type="submit">Salvar perfil</button>
      </form>
      <form className="mt-6 grid max-w-2xl gap-4 rounded-xl bg-card p-6" onSubmit={submitPassword}>
        <h2 className="font-bold">Alterar senha</h2>
        <label className="grid gap-2 text-sm">Senha atual<input autoComplete="current-password" className="rounded border border-border bg-background p-3" minLength={8} name="currentPassword" required type="password" /></label>
        <label className="grid gap-2 text-sm">Nova senha<input autoComplete="new-password" className="rounded border border-border bg-background p-3" minLength={8} name="newPassword" required type="password" /></label>
        <button className="rounded bg-primary p-3 font-bold text-primary-foreground" disabled={password.isPending} type="submit">Atualizar senha</button>
      </form>
      {message && <p aria-live="polite" className="mt-4 text-sm text-primary">{message}</p>}
    </>}
  </AccountShell>
}

export function WalletsPage() {
  const userId = useCurrentUserKey()
  const queryClient = useQueryClient()
  const walletsQuery = useQuery({ queryKey: ['wallets', userId], queryFn: getWallets, enabled: Boolean(window.localStorage.getItem('kurio-session-token')) })
  const [message, setMessage] = useState('')
  const save = useMutation({ mutationFn: saveWallets, onSuccess: (wallets) => queryClient.setQueryData(['wallets', userId], wallets) })

  function persist(wallets: Wallet[]) {
    save.mutate(wallets, { onSuccess: () => setMessage('Carteiras salvas.'), onError: (error) => setMessage(error.message) })
  }

  return <AccountShell title="Carteiras">
    {walletsQuery.isPending ? <div aria-busy="true" className="h-48 animate-pulse rounded-xl bg-card" /> : walletsQuery.error ? <p role="alert">{walletsQuery.error.message}</p> : <>
      <ul className="flex max-w-3xl flex-col gap-3">
        {walletsQuery.data?.map((wallet) => <li className="grid gap-3 rounded-xl bg-card p-4 sm:grid-cols-[1fr_1fr_1fr_auto]" key={wallet.id}>
          <label className="grid gap-1 text-xs text-text-secondary">Nome<input aria-label={`Nome da carteira ${wallet.name}`} className="rounded border border-border bg-background p-2 text-sm text-foreground" defaultValue={wallet.name} onChange={(event) => { wallet.name = event.target.value }} /></label>
          <label className="grid gap-1 text-xs text-text-secondary">Endereço<input aria-label={`Endereço da carteira ${wallet.name}`} className="rounded border border-border bg-background p-2 text-sm text-foreground" defaultValue={wallet.address} onChange={(event) => { wallet.address = event.target.value }} /></label>
          <label className="grid gap-1 text-xs text-text-secondary">Rede<input className="rounded border border-border bg-background p-2 text-sm text-foreground" defaultValue={wallet.network} onChange={(event) => { wallet.network = event.target.value }} /></label>
          <label className="flex items-center gap-2 text-sm"><input checked={wallet.isPrimary} name="primary-wallet" onChange={() => { for (const entry of walletsQuery.data ?? []) entry.isPrimary = entry.id === wallet.id }} type="radio" />Principal</label>
        </li>)}
      </ul>
      <div className="mt-4 flex flex-wrap gap-3">
        <button className="rounded border border-primary px-4 py-3 text-sm text-primary" onClick={() => queryClient.setQueryData<Wallet[]>(['wallets', userId], (wallets = []) => [...wallets, { id: `wallet-${createId()}`, name: 'Nova carteira', address: '', network: 'Ethereum', isPrimary: wallets.length === 0 }])} type="button">Adicionar carteira</button>
        <button className="rounded bg-primary px-5 py-3 font-bold text-primary-foreground" onClick={() => persist(walletsQuery.data ?? [])} type="button">Salvar carteiras</button>
      </div>
      {message && <p aria-live="polite" className="mt-4 text-sm text-primary">{message}</p>}
    </>}
  </AccountShell>
}

export function OrdersPage() {
  const userId = useCurrentUserKey()
  const orders = useQuery({ queryKey: ['orders', userId], queryFn: getOrders, enabled: Boolean(window.localStorage.getItem('kurio-session-token')) })
  return <AccountShell title="Meus pedidos">
    {orders.isPending ? <div aria-busy="true" className="h-40 animate-pulse rounded-xl bg-card" /> : orders.error ? <p role="alert">{orders.error.message}</p> : orders.data?.length ? <ul className="flex flex-col gap-3">{orders.data.map((order) => <li className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-card p-5" key={order.id}><span>{order.id} · {new Date(order.createdAt).toLocaleDateString('pt-BR')}</span><span>{order.status}</span><strong className="text-primary">{order.quote.total} ETH</strong></li>)}</ul> : <p className="rounded-xl bg-card p-6 text-sm text-text-secondary">Você ainda não tem pedidos.</p>}
  </AccountShell>
}
