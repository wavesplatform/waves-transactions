import { TypelessDataEntry } from './transactions/data'

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
  INVOKE_SCRIPT = 16,
}

export enum DATA_FIELD_TYPE {
  INTEGER = 'integer',
  BOOLEAN = 'boolean',
  BINARY = 'binary',
  STRING = 'string',
}

export interface WithSender {
  /**
   * Account public key. This account will pay fee and this account's script will be executed if exists
   */
  senderPublicKey: string
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
   * Transaction ID. 32 bytes hash encoded as base58 string
   */
  id: string
}

/**
 * This interface has common fields for all transactions
 * @typeparam LONG Generic type representing LONG type. Default to string | number
 */
export interface ITransaction<LONG = string | number> extends WithProofs, WithSender {
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
  | IExchangeTransaction
  | ICancelLeaseTransaction<LONG>
  | IMassTransferTransaction<LONG>
  | ISetScriptTransaction<LONG>
  | ISponsorshipTransaction<LONG>
  | IDataTransaction<LONG>
  | ISetAssetScriptTransaction<LONG>
  | IInvokeScriptTransaction<LONG>


/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IIssueTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.ISSUE
  /**
   * @minLength 4
   * @maxLength 16
   */
  name: string
  /**
   * @maxLength 1000
   */
  description: string
  decimals: number
  quantity: LONG
  reissuable: boolean
  script?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetScriptTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.SET_SCRIPT
  /**
   * Compiled script encoded as base64 string
   */
  script: string | null //base64
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetAssetScriptTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.SET_ASSET_SCRIPT
  assetId: string
  /**
   * Compiled script encoded as base64 string
   */
  script: string | null //base64
}

/**
 * Used to transfer assets from one account to another.
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ITransferTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.TRANSFER
  recipient: string
  amount: LONG
  attachment: string
  feeAssetId?: string | null
  assetId?: string | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IMassTransferItem<LONG = string | number> {
  recipient: string
  amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IReissueTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.REISSUE
  assetId: string
  quantity: LONG
  reissuable: boolean
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IBurnTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.BURN
  assetId: string
  quantity: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IExchangeTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.EXCHANGE
  order1: IOrder
  order2: IOrder
  price: LONG
  amount: LONG
  buyMatcherFee: LONG
  sellMatcherFee: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ILeaseTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.LEASE
  amount: LONG
  recipient: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ICancelLeaseTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.CANCEL_LEASE
  leaseId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 * Library requires chainId to be present in this transaction, even thought node returns json without it
 */
export interface IAliasTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.ALIAS
  alias: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IMassTransferTransaction<LONG = string | number> extends ITransaction<LONG> {
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
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISponsorshipTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.SPONSORSHIP
  /**
   * Minimal fee amount in sponsored asset. To disable sponsorship set it to 0
   */
  minSponsoredAssetFee: LONG
  /**
   * AssetID of sponsored token
   */
  assetId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IDataTransaction<LONG = string | number> extends ITransaction<LONG> {
  type: TRANSACTION_TYPE.DATA
  data: DataEntry[]
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IInvokeScriptPayment<LONG = string | number> {
  assetId: string | null
  amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IInvokeScriptTransaction<LONG = string | number> extends ITransaction<LONG>, WithChainId {
  type: TRANSACTION_TYPE.INVOKE_SCRIPT
  dappAddress: string
  feeAssetId?: string | null
  call: {
    function: string
    args: any[]
  },
  payment?: IInvokeScriptPayment[]
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IOrder<LONG = string | number> extends WithProofs, WithSender {
  version?: number,
  orderType: 'buy' | 'sell'
  assetPair: {
    amountAsset: string | null
    priceAsset: string | null
  }
  price: LONG
  amount: LONG
  timestamp: number
  expiration: number
  matcherFee: number
  matcherPublicKey: string
}

/**
 * CancelOrder object. When this object is sent to matcher, order with 'orderId' will be canceled
 */
export interface ICancelOrder {
  sender: string
  orderId: string
  signature: string
}

//////////////params
export type TTxParams<LONG = string | number> =
  | IAliasParams<LONG>
  | IBurnParams<LONG>
  | IInvokeScriptParams<LONG>
  | ICancelLeaseParams<LONG>
  | IDataParams<LONG>
  | IIssueParams<LONG>
  | ILeaseParams<LONG>
  | IMassTransferParams<LONG>
  | IReissueParams<LONG>
  | ISetAssetScriptParams<LONG>
  | ISetScriptParams<LONG>
  | ISponsorshipParams<LONG>
  | ITransferParams<LONG>

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IBasicParams<LONG = string | number> {
  /**
   * Transaction fee. If not set, fee will be calculated automatically
   */
  fee?: LONG
  /**
   * If fee is not set, this value will be added to automatically calculated fee. E.x.:
   * Account is scripted and 400000 fee more is required.
   */
  additionalFee?: number
  /**
   * If not set, public key will be derived from seed phrase. You should provide senderPublicKey in two cases:
   * 1. Account, from which this tx should be sent, differs from tx signer. E.g., we have smart account that requires 2 signatures.
   * 2. You to create tx without proof. Therefore no seed is provided.
   */
  senderPublicKey?: string
  /**
   * Transaction timestamp. If not set current timestamp will be used. Date.now()
   */
  timestamp?: number
}

export interface WithChainIdParam {
  /**
   * Network byte. Could be set as number or as char.
   * If set as char(string), charCodeAt(0) will be used. E.g.,
   * 'W' will be converted to '87'
   * If not set, 87 will be used as default
   */
  chainId?: string | number
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IAliasParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  alias: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IBurnParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  assetId: string
  quantity: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ICancelLeaseParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  leaseId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IDataParams<LONG = string | number> extends IBasicParams<LONG> {
  data: Array<DataEntry | TypelessDataEntry>
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IIssueParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  /**
   * @minLength 4
   * @maxLength 16
   */
  name: string
  /**
   * @maxLength 1000
   */
  description: string
  quantity: LONG
  decimals?: number
  reissuable?: boolean
  script?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ILeaseParams<LONG = string | number> extends IBasicParams<LONG> {
  recipient: string
  amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IMassTransferParams<LONG = string | number> extends IBasicParams<LONG> {
  transfers: IMassTransferItem[]
  /**
   * Bytearray encoded as base string
   */
  attachment?: string
  assetId?: string | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IOrderParams<LONG = string | number> {
  matcherPublicKey: string
  price: LONG
  amount: LONG
  orderType: 'buy' | 'sell',
  amountAsset: string | null
  priceAsset: string | null
  senderPublicKey?: string
  matcherFee?: number
  timestamp?: number
  expiration?: number
}

export interface ICancelOrderParams {
  orderId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IReissueParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  assetId: string
  quantity: LONG
  reissuable: boolean
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetAssetScriptParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  /**
   * Compiled script encoded as base64 string
   */
  script: string
  assetId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetScriptParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  /**
   * Compiled script encoded as base64 string
   */
  script: string | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISponsorshipParams<LONG = string | number> extends IBasicParams<LONG> {
  /**
   * AssetID of sponsored token
   */
  assetId: string
  /**
   * Minimal fee amount in sponsored asset. To disable sponsorship set it to 0
   */
  minSponsoredAssetFee: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ITransferParams<LONG = string | number> extends IBasicParams<LONG> {
  recipient: string
  amount: LONG
  assetId?: string | null
  /**
   * Fee can be paid in custom token if sponsorship has been set for this token
   */
  feeAssetId?: string | null
  /**
   * Bytearray encoded as base58 string
   */
  attachment?: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IInvokeScriptParams<LONG = string | number> extends IBasicParams<LONG>, WithChainIdParam {
  dappAddress: string
  feeAssetId?: string | null
  call: {
    function: string
    args: {
      type: 'binary' | 'integer' | 'boolean' | 'string',
      value: string | number | boolean
    }[]
  },
  payment?: IInvokeScriptPayment[]
}

