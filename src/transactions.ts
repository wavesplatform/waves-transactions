import { Option } from "./types";

export type long = number | string

export const enum TransactionType {
  Genesis = 1,
  Payment = 2,
  Issue = 3,
  Transfer = 4,
  Reissue = 5,
  Burn = 6,
  Exchange = 7,
  Lease = 8,
  CancelLease = 9,
  Alias = 10,
  MassTransfer = 11,
  Data = 12,
  SetScript = 13,
  SponsorFee = 14,
}

export interface WithProofs {
  /**
   * Transaction signatures
   * @minItems 0
   * @maxItems 8
   */
  proofs: Option<string>[]
}

export interface WithChainId {
  /**
   * Network byte
   * @minLength 1
   * @maxLength 1
   */
  chainId: string
}
export interface Transaction extends WithProofs {
  id: string
  type: number
  timestamp: number
  fee: long
  version: number
}

export type Tx =
  | AliasTransaction
  | IssueTransaction
  | TransferTransaction
  | ReissueTransaction
  | BurnTransaction
  | LeaseTransaction
  | CancelLeaseTransaction
  | MassTransferTransaction
  | SetScriptTransaction
  | DataTransaction

export interface WithSender {
  senderPublicKey: string
}

export interface IssueTransaction extends Transaction, WithSender {
  type: TransactionType.Issue
  name: string
  description: string
  decimals: number
  quantity: long
  reissuable: boolean
  chainId: string
}

export interface SetScriptTransaction extends Transaction, WithSender, WithChainId {
  type: TransactionType.SetScript
  script: string | null //base64
}

export interface TransferTransaction extends Transaction, WithSender {
  type: TransactionType.Transfer
  recipient: string
  amount: long
  feeAssetId?: string
  assetId?: string
  attachment?: string
}

export interface Transfer {
  recipient: string
  amount: long
}

export interface ReissueTransaction extends Transaction, WithSender, WithChainId {
  type: TransactionType.Reissue
  assetId: string
  quantity: long
  reissuable: boolean
}

export interface BurnTransaction extends Transaction, WithSender, WithChainId {
  type: TransactionType.Burn
  assetId: string
  quantity: long
}

export interface LeaseTransaction extends Transaction, WithSender {
  type: TransactionType.Lease
  amount: long
  recipient: string
}

export interface CancelLeaseTransaction extends Transaction, WithSender, WithChainId {
  type: TransactionType.CancelLease
  leaseId: string
}

export interface AliasTransaction extends Transaction, WithSender {
  type: TransactionType.Alias
  alias: string
}

export interface MassTransferTransaction extends Transaction, WithSender {
  type: TransactionType.MassTransfer
  transfers: Transfer[]
  assetId?: string
  attachment?: string
}

export type DataType = 'integer' | 'boolean' | 'string' | 'binary'

export interface DataEntry {
  key: string
  type: DataType
  value: string | number | boolean
}
export interface DataTransaction extends Transaction, WithSender {
  type: TransactionType.Data
  data: DataEntry[]
}

export interface Order extends WithSender, WithProofs {
  id: string
  orderType: "buy" | "sell"
  assetPair: {
    amountAsset?: string
    priceAsset?: string
  };
  price: long
  amount: long
  timestamp: number
  expiration: number
  matcherFee: number
  matcherPublicKey: string
}