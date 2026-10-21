import { useEffect, useRef, useState } from 'react'

type AuthMode = 'login' | 'signup'

function PasswordVisibilityIcon({ visible }: { visible: boolean }) {
  if (visible) {
    return (
      <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 23 20" width="23">
        <path d="M2.6 10.1c0-2.7 3.9-6.1 8.7-6.1s8.8 3.4 8.8 6.1-4 6.1-8.8 6.1-8.7-3.4-8.7-6.1Z" stroke="#B39463" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        <circle cx="11.3" cy="10.1" r="2.8" stroke="#B39463" strokeWidth="1.5" />
      </svg>
    )
  }

  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 23 20" width="23">
      <path d="M6.063 14.775C3.957 13.558 2.597 11.725 2.597 10.117c0-2.734 3.91-6.084 8.736-6.084 1.974 0 3.806.559 5.28 1.425M18.747 7.175c.841.942 1.332 1.984 1.332 2.942 0 2.734-3.92 6.084-8.746 6.084-.859 0-1.699-.109-2.484-.3M9.223 11.972a3.19 3.19 0 0 1-.874-1.857c-.004-1.454 1.33-2.636 2.979-2.638.793-.002 1.555.275 2.116.77m.826 2.335c-.221 1.077-1.176 1.921-2.396 2.118M18.787 3.542 3.889 16.687" stroke="#B39463" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  )
}

function PasswordField({
  placeholder,
  visible,
  onToggle,
  autoComplete,
}: {
  placeholder: string
  visible: boolean
  onToggle: () => void
  autoComplete: string
}) {
  return (
    <label className="relative block">
      <input
        autoComplete={autoComplete}
        className="h-10 w-full rounded-[5px] border border-border bg-transparent px-3 pr-10 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
        placeholder={placeholder}
        required
        type={visible ? 'text' : 'password'}
      />
      <button
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        aria-pressed={visible}
        className="absolute inset-y-0 right-2 flex w-6 items-center justify-center rounded-sm text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        onClick={onToggle}
        type="button"
      >
        <PasswordVisibilityIcon visible={visible} />
      </button>
    </label>
  )
}

function SocialSignIn() {
  return (
    <section aria-label="Outras formas de entrar" className="mt-6 max-[700px]:mt-3">
      <div className="flex h-4 items-center gap-2 font-mono text-[13px] leading-4 text-foreground">
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
        <span className="shrink-0 px-1">Ou continue com</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <div className="mt-3 flex flex-col gap-3">
        <button
          className="flex h-10 w-full items-center justify-center gap-3 rounded-[5px] border border-border font-mono text-[13px] font-medium leading-4 text-text-secondary transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          type="button"
        >
          <img alt="google img" className="size-4" height="16" src="/images/google.png" width="16" />
          Continuar com Google
        </button>
        <button
          className="flex h-10 w-full items-center justify-center gap-3 rounded-[5px] border border-border font-mono text-[13px] font-medium leading-4 text-text-secondary transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          type="button"
        >
          <img alt="facebook img" className="size-4" height="16" src="/images/facebook.png" width="16" />
          Continuar com Facebook
        </button>
      </div>
    </section>
  )
}

export function AuthModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [mode, setMode] = useState<AuthMode>('login')
  const [passwordVisible, setPasswordVisible] = useState(false)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.showModal()
    return () => dialog.close()
  }, [])

  return (
    <dialog
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 m-auto h-[min(656px,calc(100dvh-16px))] w-[min(500px,calc(100vw-32px))] 
      max-w-none rounded-lg border border-border bg-card p-0
       overflow-y-auto text-foreground shadow-2xl backdrop:bg-black/70"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      ref={dialogRef}
    >
      <div className="relative flex min-h-full flex-col px-6 pt-13 max-[700px]:pt-8 sm:px-10 md:px-20">
        <button
          aria-label="Fechar"
          className="absolute top-5 right-5 flex size-5 items-center justify-center rounded-sm text-primary transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={onClose}
          type="button"
        >
          <svg aria-hidden="true" fill="none" height="14" viewBox="0 0 14 14" width="14">
            <path d="m3 3 8 8m0-8-8 8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.2" />
          </svg>
        </button>

        <div className="flex h-4 items-center justify-center font-mono text-[20px] font-medium leading-4" id="auth-modal-title">
          <button
            aria-pressed={mode === 'login'}
            className={mode === 'login' ? 'text-primary' : 'text-foreground transition-colors hover:text-primary'}
            onClick={() => setMode('login')}
            type="button"
          >
            Entrar
          </button>
          <span aria-hidden="true" className="px-1 text-primary">|</span>
          <button
            aria-pressed={mode === 'signup'}
            className={mode === 'signup' ? 'text-primary' : 'text-foreground transition-colors hover:text-primary'}
            onClick={() => setMode('signup')}
            type="button"
          >
            Criar conta
          </button>
        </div>

        <p className="mt-11.5 text-center font-mono text-[13px] leading-4 text-foreground max-[700px]:mt-7">
          {mode === 'signup'
            ? <>Crie seu perfil de colecionador e conecte uma<br className="hidden sm:block" /> carteira quando quiser.</>
            : <>Entre para gerenciar sua carteira, coleção e perfil de criador.</>}
        </p>

        {mode === 'signup' ? (
          <form className="mt-5 flex flex-col gap-3 max-[700px]:mt-3 max-[700px]:gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              autoComplete="username"
              className="h-10 w-full rounded-[5px] border border-border bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="Nome de usuário"
              required
            />
            <input
              autoComplete="email"
              className="h-10 w-full rounded-[5px] border border-border bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="Digite seu e-mail"
              required
              type="email"
            />
            <PasswordField
              autoComplete="new-password"
              onToggle={() => setPasswordVisible((visible) => !visible)}
              placeholder="Senha"
              visible={passwordVisible}
            />
            <input
              autoComplete="new-password"
              className="h-10 w-full rounded-[5px] border border-border bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="Confirmar senha"
              required
              type={passwordVisible ? 'text' : 'password'}
            />
            <button
              className="mt-2 h-11.25 w-full rounded-[5px] bg-primary font-mono text-base font-bold leading-4 text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card max-[700px]:mt-1"
              type="submit"
            >
              Criar conta
            </button>
          </form>
        ) : (
          <form className="mt-5 flex flex-col gap-3 max-[700px]:mt-3 max-[700px]:gap-2" onSubmit={(event) => event.preventDefault()}>
            <input
              autoComplete="email"
              className="h-10 w-full rounded-[5px] border border-border bg-transparent px-3 font-mono text-sm leading-4 text-foreground outline-none placeholder:text-secondary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary"
              placeholder="contato@email.com"
              required
              type="email"
            />
            <PasswordField
              autoComplete="current-password"
              onToggle={() => setPasswordVisible((visible) => !visible)}
              placeholder="Senha"
              visible={passwordVisible}
            />
            <div className="flex justify-end pt-1">
              <button
                className="font-mono text-xs leading-4 text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                type="button"
              >
                Esqueceu a senha?
              </button>
            </div>
            <button
              className="mt-2 h-11.25 w-full rounded-[5px] bg-primary font-mono text-base font-bold leading-4 text-primary-foreground transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card max-[700px]:mt-1"
              type="submit"
            >
              Entrar
            </button>
          </form>
        )}

        <SocialSignIn />
        <div aria-hidden="true" className="-mx-6 mt-auto h-2.5 shrink-0 bg-primary sm:-mx-10 md:-mx-20" />
      </div>
    </dialog>
  )
}
