import { WithProofs, TTxParams, IOrderParams, TTx, IOrder, IBasicParams } from './transactions'
import { TSeedTypes } from './types'
import { publicKey } from 'waves-crypto'
import axios from "axios";

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

export const isOrder = (p: any): p is IOrder => (<IOrder>p).assetPair !== undefined;


export type CancellablePromise<T> = Promise<T> & { cancel: () => void }

export const delay = (timeout: number): CancellablePromise<{}> => {
  const t: any = {}
  const p = new Promise((resolve, _) => {
    t.resolve = resolve
    t.id = setTimeout(() => resolve(), timeout)
  }) as any
  (<any>p).cancel = () => { t.resolve(); clearTimeout(t.id) }
  return p
}

export const waitForTx = async (txId: string, timeout: number, apiBase: string): Promise<TTx> => {
  const promise = (): Promise<TTx> => axios.get(`transactions/info/${txId}`, { baseURL: apiBase })
    .then(x => x.data).catch(_ => delay(1000).then(_ => promise()))

  const t = delay(timeout)
  const r = await Promise.race([t.then(x => Promise.reject('timeout')), promise()]) as TTx
  t.cancel()
  return r
}

export function networkByte(p: number|string|undefined, def: number): number {
  switch (typeof p) {
    case 'string':
      return p.charCodeAt(0);
    case 'number':
      return p;
    default:
      return def
  }
}

export function fee(params: IBasicParams, def: number){
  if (params.fee) return params.fee;
  if (!params.additionalFee) return def;
  return def + params.additionalFee
}