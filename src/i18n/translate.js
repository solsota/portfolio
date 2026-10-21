import spanish from './es.json'

export function translate(message, language, values = {}) {
  if (typeof message !== 'string') return message
  const key = message.replace(/\s+/g, ' ').trim()
  const translated = language === 'es' ? (spanish[key] ?? key) : key
  const leadingSpace = message.match(/^\s*/)[0]
  const trailingSpace = message.match(/\s*$/)[0]
  return `${leadingSpace}${translated}${trailingSpace}`.replace(/\{(\w+)\}/g, (token, name) => values[name] ?? token)
}
