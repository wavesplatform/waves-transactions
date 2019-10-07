/**
 * @module index
 */

export type TOption<T> = T | undefined | null

export interface IIndexSeedMap {
  [key: number]: string
}

export type TPrivateKey = { privateKey: string }
export type TSeedTypes = string | TOption<string | TPrivateKey>[] | IIndexSeedMap | TPrivateKey
