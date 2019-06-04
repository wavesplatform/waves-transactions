import {
  WithProofs,
  IBasicParams,
  WithSender, TOrder
} from './transactions'
import { TSeedTypes } from './types'
import { publicKey } from '@waves/waves-crypto'

export const mapObj = <T, U, K extends string>(obj: Record<K, T>, f: (v: T) => U): Record<K, U> =>
  Object.entries<T>(obj).map(([k, v]) => [k, f(v)] as [string, U])
    .reduce((acc, [k, v]) => ({ ...acc as any, [k]: v }), {} as Record<K, U>)

export function getSenderPublicKey(seedsAndIndexes: [string, number?][], params: Partial<WithSender>) {
  if (seedsAndIndexes.length === 0 && params.senderPublicKey == null)
    throw new Error('Please provide either seed or senderPublicKey')
  else {
    return params.senderPublicKey || publicKey(seedsAndIndexes[0][0])
  }
}

export const base64Prefix = (str: string | null) => str == null || str.slice(0, 7) === 'base64:' ? str : 'base64:' + str

export function addProof(tx: WithProofs, proof: string, index?: number) {
  if (index == null) {
    tx.proofs = [...tx.proofs, proof]
    return tx
  }
  if (tx.proofs != null && !!tx.proofs[index])
    throw new Error(`Proof at index ${index} already exists.`)
  for (let i = tx.proofs.length; i < index; i++)
    tx.proofs.push('')
  tx.proofs[index] = proof
  return tx
}

export function convertToPairs(seedObj?: TSeedTypes): [string, number | undefined][] {
  //Due to typescript duck typing, 'string' type satisfies IIndexSeedMap interface. Because of this we should typecheck against string first
  if (seedObj == null) {
    return []
  }
  else if (typeof seedObj === 'string') {
    return [[seedObj, undefined]]
  }
  else if (Array.isArray(seedObj)) {
    return seedObj.map((s, i) => [s, i] as [string, number]).filter(([s, _]) => s)
  }
  else {
    const keys = Object.keys(seedObj).map(k => parseInt(k)).filter(k => !isNaN(k)).sort()
    return keys.map(k => [seedObj[k], k] as [string, number])
  }
}

export const isOrder = (p: any): p is TOrder => (<TOrder>p).assetPair !== undefined


export function networkByte(p: number | string | undefined, def: number): number {
  switch (typeof p) {
    case 'string':
      return p.charCodeAt(0)
    case 'number':
      return p
    default:
      return def
  }
}

export function fee(params: IBasicParams, def: number) {
  if (params.fee) return params.fee
  if (!params.additionalFee) return def
  return def + params.additionalFee
}
