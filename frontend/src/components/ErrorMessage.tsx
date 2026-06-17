import { type MouseEvent, useEffect, useState } from 'react'

interface ErrorMessageProps {
  erro: string | null
}

/**
 * Componente para exibição de mensagens de erro
 * Aparece apenas se houver erro
 */
export function ErrorMessage({ erro }: ErrorMessageProps) {
  const [aberto, setAberto] = useState(false)

  useEffect(() => {
    setAberto(Boolean(erro))
  }, [erro])

  useEffect(() => {
    if (!aberto) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAberto(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [aberto])

  if (!erro || !aberto) return null

  const fecharPopup = () => {
    setAberto(false)
  }

  const impedirFechamento = (event: MouseEvent<HTMLDivElement>) => {
    event.stopPropagation()
  }

  return (
    <div className="error-popup-overlay" onClick={fecharPopup}>
      <div
        className="error-popup"
        role="dialog"
        aria-modal="true"
        aria-live="assertive"
        onClick={impedirFechamento}
      >
        <h3>Atenção!</h3>
        <p>{erro}</p>
        <button type="button" onClick={fecharPopup}>
          Fechar
        </button>
      </div>
    </div>
  )
}
