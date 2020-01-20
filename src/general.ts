import { binary } from '@waves/marshall'
import { address, verifySignature } from '@waves/ts-lib-crypto'
import request from '@waves/node-api-js/cjs/tools/request'
import stringify from '@waves/node-api-js/cjs/tools/stringify'

import { IAuthParams, ICancelOrder, TOrder, TTxParams, WithTxType } from './transactions'
import { TSeedTypes } from './types'
import { issue } from './transactions/issue'
import { transfer } from './transactions/transfer'
import { reissue } from './transactions/reissue'
import { burn } from './transactions/burn'
import { lease } from './transactions/lease'
import { cancelLease } from './transactions/cancel-lease'
import { data } from './transactions/data'
import { massTransfer } from './transactions/mass-transfer'
import { alias } from './transactions/alias'
import { setScript } from './transactions/set-script'
import { isOrder } from './generic'
import { setAssetScript } from './transactions/set-asset-script'
import { exchange } from './transactions/exchange'
import { sponsorship } from './transactions/sponsorship'
import { invokeScript } from './transactions/invoke-script'
import { serializeCustomData, TSignedData } from './requests/custom-data'
import { serializeAuthData } from './requests/auth';
import { serializeWavesAuthData } from './requests/wavesAuth';
import {
    TAliasTransaction,
    TBurnTransaction,
    TCancelLeaseTransaction,
    TDataTransaction,
    TExchangeTransaction,
    TInvokeScriptTransaction,
    TIssueTransaction,
    TLeaseTransaction,
    TMassTransferTransaction,
    TRANSACTION_TYPE,
    TReissueTransaction,
    TSetAssetScriptTransaction,
    TSetScriptTransaction,
    TSponsorshipTransaction,
    TTransaction,
    TTransferTransaction,
} from '@waves/ts-types'


export const txTypeMap: { [type: number]: { sign: (tx: TTransaction | TTxParams & WithTxType, seed: TSeedTypes) => TTransaction } } = {
    [TRANSACTION_TYPE.ISSUE]: {sign: (x, seed) => issue(x as TIssueTransaction, seed)},
    [TRANSACTION_TYPE.TRANSFER]: {sign: (x, seed) => transfer(x as TTransferTransaction, seed)},
    [TRANSACTION_TYPE.REISSUE]: {sign: (x, seed) => reissue(x as TReissueTransaction, seed)},
    [TRANSACTION_TYPE.BURN]: {sign: (x, seed) => burn(x as TBurnTransaction, seed)},
    [TRANSACTION_TYPE.LEASE]: {sign: (x, seed) => lease(x as TLeaseTransaction, seed)},
    [TRANSACTION_TYPE.CANCEL_LEASE]: {sign: (x, seed) => cancelLease(x as TCancelLeaseTransaction, seed)},
    [TRANSACTION_TYPE.ALIAS]: {sign: (x, seed) => alias(x as TAliasTransaction, seed)},
    [TRANSACTION_TYPE.MASS_TRANSFER]: {sign: (x, seed) => massTransfer(x as TMassTransferTransaction, seed)},
    [TRANSACTION_TYPE.DATA]: {sign: (x, seed) => data(x as TDataTransaction, seed)},
    [TRANSACTION_TYPE.SET_SCRIPT]: {sign: (x, seed) => setScript(x as TSetScriptTransaction, seed)},
    [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: {sign: (x, seed) => setAssetScript(x as TSetAssetScriptTransaction, seed)},
    [TRANSACTION_TYPE.SPONSORSHIP]: {sign: (x, seed) => sponsorship(x as TSponsorshipTransaction, seed)},
    [TRANSACTION_TYPE.EXCHANGE]: {sign: (x, seed) => exchange(x as TExchangeTransaction, seed)},
    [TRANSACTION_TYPE.INVOKE_SCRIPT]: {sign: (x, seed) => invokeScript(x as TInvokeScriptTransaction, seed)},
}

/**
 * Signs arbitrary transaction. Can also create signed transaction if provided params have type field
 * @param tx
 * @param seed
 */
export function signTx(tx: TTransaction | TTxParams & WithTxType, seed: TSeedTypes): TTransaction {
    if (!txTypeMap[tx.type]) throw new Error(`Unknown tx type: ${tx.type}`)

    return txTypeMap[tx.type].sign(tx, seed)
}

/**
 * Converts transaction or order object to Uint8Array
 * @param obj transaction or order
 */
export function serialize(obj: TTransaction | TOrder): Uint8Array {
    if (isOrder(obj)) return binary.serializeOrder(obj)
    return binary.serializeTx(obj)
}

/**
 * Verifies signature of transaction or order
 * @param obj
 * @param proofN - proof index. Takes first proof by default
 * @param publicKey - takes senderPublicKey by default
 */
export function verify(obj: TTransaction | TOrder, proofN = 0, publicKey?: string): boolean {
    publicKey = publicKey || obj.senderPublicKey
    const bytes = serialize(obj)
    const signature = obj.version == null ? (obj as any).signature : obj.proofs[proofN]
    return verifySignature(publicKey, bytes, signature)
}

export function verifyCustomData(data: TSignedData): boolean {
    const bytes = serializeCustomData(data)
    return verifySignature(data.publicKey as string, bytes, data.signature as string)
}

export function verifyAuthData(authData: { signature: string, publicKey: string, address: string }, params: IAuthParams, chainId?: string | number): boolean {
    chainId = chainId || 'W'
    const bytes = serializeAuthData(params)
    const myAddress = address({publicKey: authData.publicKey}, chainId)
    return myAddress === authData.address && verifySignature(authData.publicKey, bytes, authData.signature)
}

export function verifyWavesAuthData(authData: { signature: string, publicKey: string, address: string, timestamp: number }, params: { publicKey: string, timestamp: number }, chainId?: string | number): boolean {
    chainId = chainId || 'W'
    const bytes = serializeWavesAuthData(params)
    const myAddress = address({publicKey: authData.publicKey}, chainId)
    return myAddress === authData.address && verifySignature(authData.publicKey, bytes, authData.signature)
}

/**
 * Sends order to matcher
 * @param ord - transaction to send
 * @param options - matcher address to send order to. E.g. https://matcher.waves.exchange/. Optional 'market' flag to send market order
 */
export function submitOrder(ord: TOrder, options: { matcherUrl: string, market?: boolean }): Promise<any>
/**
 * Sends order to matcher
 * @param ord - transaction to send
 * @param matcherUrl - matcher address to send order to. E.g. https://matcher.waves.exchange/
 */
export function submitOrder(ord: TOrder, matcherUrl: string): Promise<any>
export function submitOrder(ord: TOrder, opts: any) {
    let endpoint, matcherUrl: string
    if (typeof opts === 'string') {
        matcherUrl = opts
        endpoint = 'matcher/orderbook'
    } else {
        matcherUrl = opts.matcherUrl
        endpoint = opts.market ? 'matcher/orderbook/market' : 'matcher/orderbook'
    }
    return request({base: matcherUrl, url: endpoint, options: {method: 'POST', body: stringify(ord)}})
}

/**
 * Sends cancel order command to matcher. Since matcher api requires amountAsset and priceAsset in request url,
 * this function requires them as params
 * @param co - signed cancelOrder object
 * @param amountAsset - amount asset of the order to be canceled
 * @param priceAsset - price asset of the order to be canceled
 * @param matcherUrl - matcher address to send order cancel to. E.g. https://matcher.waves.exchange/
 */
export function cancelSubmittedOrder(co: ICancelOrder, amountAsset: string | null, priceAsset: string | null, matcherUrl: string) {
    const endpoint = `matcher/orderbook/${amountAsset || 'WAVES'}/${priceAsset || 'WAVES'}/cancel`;
    return request({base: matcherUrl, url: endpoint, options: {method: 'POST', body: stringify(co)}})
}
