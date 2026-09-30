const translations = [
  ['anonymous sign-ins are disabled', 'O acesso anônimo está desativado.'],
  ['missing email or phone', 'Informe um e-mail ou número de telefone.'],
  ['invalid login credentials', 'E-mail ou senha inválidos.'],
  ['email not confirmed', 'Confirme seu e-mail antes de entrar.'],
  ['user already registered', 'Este e-mail já está cadastrado.'],
  ['email rate limit exceeded', 'Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.'],
  ['for security purposes, you can only request this after', 'Por segurança, aguarde alguns instantes antes de solicitar outro link.'],
  ['password should be at least', 'A senha deve ter pelo menos 6 caracteres.'],
  ['password must be at least', 'A senha deve ter pelo menos 6 caracteres.'],
  ['new password should be different', 'A nova senha deve ser diferente da senha atual.'],
  ['auth session missing', 'Sua sessão expirou. Solicite um novo link para continuar.'],
  ['token has expired', 'Este link expirou. Solicite um novo link de recuperação.'],
  ['invalid token', 'Este link é inválido. Solicite um novo link de recuperação.'],
  ['user not found', 'Não encontramos uma conta com esses dados.'],
  ['email address is invalid', 'Informe um e-mail válido.'],
  ['signup is disabled', 'O cadastro de novas contas está desativado.']
]

export function getErrorMessage(error, fallback = 'Ocorreu um erro. Tente novamente.') {
  const message = error?.message?.toLowerCase() || ''
  const translation = translations.find(([term]) => message.includes(term))

  return translation ? translation[1] : fallback
}
