interface ErrorMessageProps {
  erro: string | null
}

/**
 * Componente para exibição de mensagens de erro
 * Aparece apenas se houver erro
 */
export function ErrorMessage({ erro }: ErrorMessageProps) {
  if (!erro) return null

  return (
    <div className="error-message">
      <strong>Erro:</strong> {erro}
    </div>
  )
}
