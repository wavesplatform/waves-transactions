import { TypelessDataEntry } from "./transactions/data";

export enum TRANSACTION_TYPE {
  GENESIS = 1,
  PAYMENT = 2,
  ISSUE = 3,
  TRANSFER = 4,
  REISSUE = 5,
  BURN = 6,
  EXCHANGE = 7,
  LEASE = 8,
  CANCEL_LEASE = 9,
  ALIAS = 10,
  MASS_TRANSFER = 11,
  DATA = 12,
  SET_SCRIPT = 13,
  SPONSORSHIP = 14,
  SET_ASSET_SCRIPT = 15,
}

export enum DATA_FIELD_TYPE {
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  STRING = 'string',
  BINARY = 'binary'
}

export interface WithProofs {
  /**
   * ITransaction signatures
   * @minItems 0
   * @maxItems 8
   */
  proofs: string[]
}

export interface WithChainId {
  /**
   * Network byte.
   * E.g.,
   * 87 is used for Waves mainnet, 84 for Waves testnet
   */
  chainId: number
}


export interface WithId {
  /**
   * Transaction ID. 32 bytes object hash encoded as base58 string
   */
  id: string
}

/**
 * This interface has common fields for all transactions
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ITransaction<LONG = string | number> extends WithProofs {
  type: number
  timestamp: number
  fee: LONG
  version: number
}

/**
 *
 */
export type TTx<LONG = string | number> =
  | IAliasTransaction<LONG>
  | IIssueTransaction<LONG>
  | ITransferTransaction<LONG>
  | IReissueTransaction<LONG>
  | IBurnTransaction<LONG>
  | ILeaseTransaction<LONG>
  | ICancelLeaseTransaction<LONG>
  | IMassTransferTransaction<LONG>
  | ISetScriptTransaction<LONG>
  | IDataTransaction<LONG>
  | ISetAssetScriptTransaction<LONG>

export interface WithSender {
  senderPublicKey: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IIssueTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender, WithChainId {
  type: TRANSACTION_TYPE.ISSUE
  name: string
  description: string
  decimals: number
  quantity: LONG
  reissuable: boolean
  script?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ISetScriptTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender, WithChainId {
  type: TRANSACTION_TYPE.SET_SCRIPT
  script: string | null //base64
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ISetAssetScriptTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender, WithChainId {
  type: TRANSACTION_TYPE.SET_ASSET_SCRIPT
  assetId: string
  script: string | null //base64
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ITransferTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender {
  type: TRANSACTION_TYPE.TRANSFER
  recipient: string
  amount: LONG
  attachment: string
  feeAssetId?: string | null
  assetId?: string | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IMassTransferItem<LONG = string | number> {
  recipient: string
  amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IReissueTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender, WithChainId {
  type: TRANSACTION_TYPE.REISSUE
  assetId: string
  quantity: LONG
  reissuable: boolean
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IBurnTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender, WithChainId {
  type: TRANSACTION_TYPE.BURN
  assetId: string
  quantity: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ILeaseTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender {
  type: TRANSACTION_TYPE.LEASE
  amount: LONG
  recipient: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ICancelLeaseTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender, WithChainId {
  type: TRANSACTION_TYPE.CANCEL_LEASE
  leaseId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IAliasTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender {
  type: TRANSACTION_TYPE.ALIAS
  alias: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IMassTransferTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender {
  type: TRANSACTION_TYPE.MASS_TRANSFER
  transfers: IMassTransferItem<LONG>[]
  attachment: string
  assetId?: string | null
}

export interface DataEntry {
  key: string
  type: DATA_FIELD_TYPE
  value: string | number | boolean
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IDataTransaction<LONG = string | number> extends ITransaction<LONG>, WithSender {
  type: TRANSACTION_TYPE.DATA
  data: DataEntry[]
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IOrder<LONG = string | number> extends WithSender, WithProofs {
  id: string
  orderType: 'buy' | 'sell'
  assetPair: {
    amountAsset?: string
    priceAsset?: string
  }
  price: LONG
  amount: LONG
  timestamp: number
  expiration: number
  matcherFee: number
  matcherPublicKey: string
}

//////////////params
export type TTxParams<LONG = string | number> =
  | IAliasParams<LONG>
  | IBurnParams<LONG>
  | ICancelLeaseParams<LONG>
  | IDataParams<LONG>
  | IIssueParams<LONG>
  | ILeaseParams<LONG>
  | IMassTransferParams<LONG>
  | IReissueParams<LONG>
  | ISetAssetScriptParams<LONG>
  | ISetScriptParams<LONG>
  | ITransferParams<LONG>

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IBasicParams<LONG> {
  /**
   * Transaction fee. If not set, fee will be calculated automatically
   */
  fee?: LONG
  /**
   * If fee is not set, this value will be added to automatically calculated fee. E.x.:
   * Account is scripted and 400000 fee more is required.
   */
  additionalFee?: LONG
  /**
   * If not set, public key will be derived from seed phrase. You should provide senderPublicKey in two cases:
   * 1. Account, from which this tx should be sent, differs from tx signer. E.g., we have smart account that requires 2 signatures.
   * 2. You want only to create tx, not to sign it. Therefore no seed is provided.
   */
  senderPublicKey?: string
  /**
   * Transaction timestamp. If not set current timestamp will be used. Date.now()
   */
  timestamp?: number
}

export interface WithChainIdParam {
  /**
   * Network byte. Could beb set as number or as char.
   * If set as char(string), charCodeAt(0) will be used. E.g.,
   * 'W' will be converted to '87'
   * If not set, 87 will be used as default
   */
  chainId?: string | number
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IAliasParams<LONG = string | number>  extends IBasicParams<LONG>{
  alias: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IBurnParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam{
  assetId: string
  quantity: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ICancelLeaseParams<LONG = string | number> {
  leaseId: string
  fee?: LONG
  timestamp?: number
  chainId?: string
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IDataParams<LONG = string | number> {
  data: Array<DataEntry | TypelessDataEntry>
  fee?: LONG,
  timestamp?: number
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IIssueParams<LONG = string | number> {
  name: string
  description: string
  decimals?: number
  quantity: LONG
  reissuable?: boolean
  fee?: LONG
  timestamp?: number
  chainId?: string
  script?: string
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ILeaseParams<LONG = string | number> {
  recipient: string
  amount: LONG
  fee?: LONG
  timestamp?: number
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IMassTransferParams<LONG = string | number> {
  transfers: IMassTransferItem[]
  attachment?: string
  assetId?: string
  fee?: LONG
  timestamp?: number
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IOrderParams<LONG = string | number> {
  matcherPublicKey: string
  price: LONG
  amount: LONG
  orderType: 'buy' | 'sell',
  amountAsset?: string
  priceAsset?: string
  senderPublicKey?: string
  matcherFee?: number
  timestamp?: number
  expiration?: number
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface IReissueParams<LONG = string | number> {
  assetId: string
  quantity: LONG
  reissuable: boolean
  fee?: LONG
  timestamp?: number
  chainId?: string
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ISetAssetScriptParams<LONG = string | number> {
  script: string | null
  assetId: string
  fee?: LONG
  timestamp?: number
  chainId?: string
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ISetScriptParams<LONG = string | number> {
  script: string | null
  fee?: LONG
  timestamp?: number
  chainId?: string
  senderPublicKey?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ITransferParams<LONG = string | number> {
  recipient: string
  amount: LONG
  attachment?: string
  feeAssetId?: string
  assetId?: string
  fee?: LONG
  timestamp?: number
  senderPublicKey?: string
}