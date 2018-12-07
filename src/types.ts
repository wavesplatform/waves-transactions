export type Option<T> = T | undefined | null

export interface IIndexSeedMap {
  [key: number]: string
}

export type TSeedTypes = string | Option<string>[] | IIndexSeedMap
