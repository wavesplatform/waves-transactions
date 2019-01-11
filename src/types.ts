export type TOption<T> = T | undefined | null

export interface IIndexSeedMap {
  [key: number]: string
}

export type TSeedTypes = string | TOption<string>[] | IIndexSeedMap
