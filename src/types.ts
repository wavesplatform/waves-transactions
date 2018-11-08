export interface SeedsAndIndexes {
   [key: number]: string
}

export type SeedTypes = string | string[] | SeedsAndIndexes

export interface Params {
  senderPublicKey?: string
  timestamp?: number
}