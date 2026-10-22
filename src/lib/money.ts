const PRECISION = 8n
const SCALE = 10n ** PRECISION

export function toUnits(value: string): bigint {
  const match = /^(\d+)(?:\.(\d{0,8}))?$/.exec(value)
  if (!match) throw new Error(`Valor ETH inválido: ${value}`)
  return BigInt(match[1]) * SCALE + BigInt((match[2] ?? '').padEnd(Number(PRECISION), '0'))
}

export function fromUnits(value: bigint, decimals = 8): string {
  const rounded = value / 10n ** (PRECISION - BigInt(decimals))
  const scale = 10n ** BigInt(decimals)
  const fraction = (rounded % scale).toString().padStart(decimals, '0')
  return decimals ? `${rounded / scale}.${fraction}` : `${rounded / scale}`
}

export function addEth(values: string[]): string {
  return fromUnits(values.reduce((total, value) => total + toUnits(value), 0n))
}
