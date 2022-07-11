import {
    DataTransactionEntry,
    GenesisTransaction,
    MassTransferItem,
    PaymentTransaction,
    SignedTransaction,
    Transaction,
    TRANSACTION_TYPE,
    TransactionType
} from '@waves/ts-types/src'
import {InvokeScriptCallArgument} from '@waves/ts-types/src/parts'
import {EthereumTransaction} from '@waves/ts-types'

export interface WithId {
    /**
     * Transaction ID. 32 bytes hash encoded as base58 string
     */
    id: string
}

export interface WithTxType {
    type: TransactionType
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

// export interface IOrderV1<LONG = string | number> extends IOrder<LONG> {
//   version: 1 | undefined
// }
//
// export interface IOrderV2<LONG = string | number> extends IOrder<LONG> {
//   version: 2
// }
//
// export interface IOrderV3<LONG = string | number> extends IOrder<LONG> {
//   version: 3
//   matcherFeeAssetId?: string | null
// }
//
// export type TOrder = IOrderV1 | IOrderV2 | IOrderV3

/**
 * CancelOrder object. When this object is sent to matcher, order with 'orderId' will be canceled
 */
export interface ICancelOrder {
    sender: string
    orderId: string
    signature: string
    hash: string
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
    | IUpdateAssetInfoParams<LONG>
    // | IInvokeExpressionParams<LONG>

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
export interface IAliasParams<LONG = string | number> extends IBasicParams<LONG> {
    alias: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IBurnParams<LONG = string | number> extends IBasicParams<LONG> {
    assetId: string
    amount: LONG
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ICancelLeaseParams<LONG = string | number> extends IBasicParams<LONG> {
    leaseId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IDataParams<LONG = string | number> extends IBasicParams<LONG> {
    data: Array<DataTransactionEntry | { type?: undefined; value?: undefined; key: string; }> //todo separate type for delete entry
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IIssueParams<LONG = string | number> extends IBasicParams<LONG> {
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
    transfers: Array<MassTransferItem<LONG>>
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
    matcherFeeAssetId?: string | null
    priceMode?: 'fixedDecimals' | 'assetDecimals'
}

export interface ICancelOrderParams {
    orderId: string
    signature?: string
    senderPublicKey?: string
}

export interface IWavesAuthParams {
    timestamp?: number
    publicKey?: string
}

export interface IWavesAuth {
    timestamp: number
    address: string
    publicKey: string
    hash: string
    signature: string
}

export interface IAuthParams {
    data: string
    host: string
    publicKey?: string
}

export interface IAuth {
    data: string
    host: string
    address: string
    publicKey: string
    hash: string
    signature: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IReissueParams<LONG = string | number> extends IBasicParams<LONG> {
    assetId: string
    quantity: LONG
    reissuable: boolean
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetAssetScriptParams<LONG = string | number> extends IBasicParams<LONG> {
    /**
     * Compiled script encoded as base64 string
     */
    script: string
    assetId: string
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ISetScriptParams<LONG = string | number> extends IBasicParams<LONG> {
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
    minSponsoredAssetFee: LONG | null
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface ITransferParams<LONG = string | number> extends IBasicParams<LONG> {
    /**
     * Can be either address(base58 encoded 24 byte address) or alias.
     * Alias should be used like 'alias:{chainId}:{alias}>'. E.g.:
     * If we have alias 'foo', and we want TESTNET transaction, recipient should be 'alias:T:foo'
     */
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
export interface IInvokeScriptParams<LONG = string | number> extends IBasicParams<LONG> {
    dApp: string
    feeAssetId?: string | null
    call?: {
        function: string
        args?: Array<InvokeScriptCallArgument<LONG>>
    } | null,
    payment?: {
        assetId?: string | null
        amount: LONG
    }[]
}

/**
 * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
 */
export interface IUpdateAssetInfoParams<LONG = string | number> extends IBasicParams<LONG> {
    /**
     * Id of previously issued asset
     */
    assetId: string
    /**
     * New asset name
     */
    name: string
    /**
     * New asset description
     */
    description: string
}

// /**
//  * @typeparam LONG Generic type representing LONG type. Default to string | number. Since javascript number more than 2 ** 53 -1 cannot be precisely represented, generic type is used
//  */
// export interface IInvokeExpressionParams<LONG = string | number> extends IBasicParams<LONG> {
//     feeAssetId?: string | null
//     expression: string,
// }

export type TTransaction = Exclude<Transaction, GenesisTransaction | PaymentTransaction | EthereumTransaction>

export type TTransactionType = Exclude<typeof TRANSACTION_TYPE[keyof typeof TRANSACTION_TYPE], 1 | 2 | 18>

export type WithChainId = { chainId: number }

export type TTx = SignedTransaction<TTransaction>
