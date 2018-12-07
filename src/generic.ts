import { WithProofs, TTxParams, IOrderParams, TTx, IOrder } from './transactions'
import { TSeedTypes } from './types'
import { publicKey } from 'waves-crypto'

export function getSenderPublicKey(seedsAndIndexes: [string, number?][], params: TTxParams | TTx | IOrderParams | IOrder) {
  if (seedsAndIndexes.length === 0 && params.senderPublicKey == null)
    throw new Error('Please provide either seed or senderPublicKey');
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
    throw new Error(`Proof at index ${index} already exists.`);
  for (let i = tx.proofs.length; i < index; i++)
    tx.proofs.push('')
  tx.proofs[index] = proof;
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
    const keys = Object.keys(seedObj).map(k => parseInt(k)).filter(k => !isNaN(k)).sort();
    return keys.map(k => [seedObj[k], k] as [string, number])
  }
}
