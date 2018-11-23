import { WithProofs, TTxParams, IOrderParams } from './transactions'
import { SeedsAndIndexes, SeedTypes, Option } from './types'
import { publicKey } from 'waves-crypto'

export function getSenderPublicKey(seed: Option<SeedTypes>, params: TTxParams | IOrderParams) {
  const { seed: s } = pullSeedAndIndex(seed)

  if (s == null && params.senderPublicKey == null)
    throw new Error('Please provide either seed or senderPublicKey')
  else {
    return params.senderPublicKey || publicKey(s!)
  }
}

export const base64Prefix = (str: string | null) => str == null || str.slice(0,7) === 'base64:' ? str : 'base64:' + str

export type OneOrMany<T> = T | T[]

//export const isOne = <T>(oneOrMany: OneOrMany<T>): oneOrMany is T => !Array.isArray(oneOrMany)
//export const toMany = <T>(oneOrMany: OneOrMany<T>): T[] => isOne(oneOrMany) ? [oneOrMany] : oneOrMany

export function addProof(tx: WithProofs, proof: string, index?: number) {
  if (index == null) {
    tx.proofs = [...tx.proofs, proof]
    return tx
  }
  if (tx.proofs != null && !!tx.proofs[index])
    throw new Error(`Proof at index ${index} is already exists.`)
  for (let i = tx.proofs.length; i < index; i++)
    tx.proofs.push('')
  tx.proofs[index] = proof
  return tx
}

export const valOrDef = <T, K extends T>(val: Option<T>, def: K): T => val != null ? val : def

export const isSeedsAndIndexes = (seed: SeedTypes): seed is SeedsAndIndexes =>
  typeof seed !== 'string' && typeof seed === 'object' && (<string[]>seed).length === undefined

export const isArrayOfSeeds = (seed: SeedTypes): seed is Option<string>[] =>
  typeof seed !== 'string' && typeof seed === 'object' && (<string[]>seed).length !== undefined

export const mapSeed = <T>(seed: Option<SeedTypes>, map: (seed: string, index?: number) => T): Option<T> => {
  const { seed: _seed, index } = pullSeedAndIndex(seed)
  if (_seed != null)
    return map(_seed, index)
  return undefined
}

export const pullSeedAndIndex = (seed: Option<SeedTypes>): { seed?: string, index?: number, nextSeed?: SeedTypes } => {
  const empty = { seed: undefined, index: undefined, nextSeed: undefined }
  if (seed == null || seed === '')
    return empty

  if (isSeedsAndIndexes(seed)) {
    const keys = Object.keys(seed).map(k => parseInt(k)).filter(k => !isNaN(k))
    if (keys == null || keys.length === 0)
      return empty

    const index = keys[0]
    const newSeed: SeedsAndIndexes = Object.assign({}, seed)
    delete newSeed[index]
    return { seed: seed[keys[0]], index, nextSeed: Object.keys(newSeed).length > 0 ? newSeed : undefined }

  } else if (isArrayOfSeeds(seed)) {

    return pullSeedAndIndex(
      Object.entries(seed).filter(([k, v]) => !!v).reduce((acc, [k, v]) => ({
        ...acc,
        [k]: v,
      }), {} as SeedsAndIndexes)
    )
  }

  return { seed: seed }
}