import axios from 'axios'
import { binary, json, serializePrimitives } from '@waves/marshall'
import { verifySignature } from '@waves/waves-crypto'
import {
  IAliasTransaction,
  IBurnTransaction,
  ICancelLeaseTransaction,
  ICancelOrder,
  IDataTransaction, IExchangeTransaction,
  IIssueTransaction,
  ILeaseTransaction,
  IMassTransferTransaction,
  IOrder,
  IReissueTransaction,
  ISetAssetScriptTransaction,
  ISetScriptTransaction,
  ISponsorshipTransaction,
  ITransferTransaction,
  TRANSACTION_TYPE,
  TTx,
  TTxParams,
  IInvokeScriptTransaction
} from './transactions'
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

export interface WithTxType {
  type: TRANSACTION_TYPE
}

export const txTypeMap: { [type: number]: { sign: (tx: TTx | TTxParams & WithTxType, seed: TSeedTypes) => TTx } } = {
  [TRANSACTION_TYPE.ISSUE]: { sign: (x, seed) => issue(x as IIssueTransaction, seed) },
  [TRANSACTION_TYPE.TRANSFER]: { sign: (x, seed) => transfer(x as ITransferTransaction, seed) },
  [TRANSACTION_TYPE.REISSUE]: { sign: (x, seed) => reissue(x as IReissueTransaction, seed) },
  [TRANSACTION_TYPE.BURN]: { sign: (x, seed) => burn(x as IBurnTransaction, seed) },
  [TRANSACTION_TYPE.LEASE]: { sign: (x, seed) => lease(x as ILeaseTransaction, seed) },
  [TRANSACTION_TYPE.CANCEL_LEASE]: { sign: (x, seed) => cancelLease(x as ICancelLeaseTransaction, seed) },
  [TRANSACTION_TYPE.ALIAS]: { sign: (x, seed) => alias(x as IAliasTransaction, seed) },
  [TRANSACTION_TYPE.MASS_TRANSFER]: { sign: (x, seed) => massTransfer(x as IMassTransferTransaction, seed) },
  [TRANSACTION_TYPE.DATA]: { sign: (x, seed) => data(x as IDataTransaction, seed) },
  [TRANSACTION_TYPE.SET_SCRIPT]: { sign: (x, seed) => setScript(x as ISetScriptTransaction, seed) },
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: { sign: (x, seed) => setAssetScript(x as ISetAssetScriptTransaction, seed) },
  [TRANSACTION_TYPE.SPONSORSHIP]: { sign: (x, seed) => sponsorship(x as ISponsorshipTransaction, seed) },
  [TRANSACTION_TYPE.EXCHANGE]: { sign: (x, seed) => exchange(x as IExchangeTransaction, seed) },
  [TRANSACTION_TYPE.INVOKE_SCRIPT]: { sign: (x, seed) => invokeScript(x as IInvokeScriptTransaction, seed) },
}

/**
 * Signs arbitrary transaction. Can also create signed transaction if provided params have type field
 * @param tx
 * @param seed
 */
export function signTx(tx: TTx | TTxParams & WithTxType, seed: TSeedTypes): TTx {
  if (!txTypeMap[tx.type]) throw new Error(`Unknown tx type: ${tx.type}`)

  return txTypeMap[tx.type].sign(tx, seed)
}

/**
 * Converts transaction or order object to Uint8Array
 * @param obj transaction or order
 */
export function serialize(obj: TTx | IOrder): Uint8Array {
  if (isOrder(obj)) return binary.serializeOrder(obj)
  return binary.serializeTx(obj)
}

/**
 * Verifies signature of transaction or order
 * @param obj
 * @param proofN - proof index. Takes first proof by default
 * @param publicKey - takes senderPublicKey by default
 */
export function verify(obj: TTx | IOrder, proofN = 0, publicKey?: string): boolean {
  publicKey = publicKey || obj.senderPublicKey
  const bytes = serialize(obj)
  const signature = obj.version == null ? (obj as any).signature : obj.proofs[proofN]
  return verifySignature(publicKey, bytes, signature)
}

/**
 * Sends transaction to waves node
 * @param tx - transaction to send
 * @param nodeUrl - node address to send tx to. E.g. https://nodes.wavesplatform.com/
 */
export function broadcast(tx: TTx, nodeUrl: string) {
  return axios.post('transactions/broadcast', json.stringifyTx(tx), {
    baseURL: nodeUrl,
    headers: { 'content-type': 'application/json' },
  })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Retrieve information about waves account balance
 * @param address - waves address as base58 string
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export function addressBalance(address: string, nodeUrl: string): Promise<number> {
  return axios.get(`addresses/balance/${address}`, { baseURL: nodeUrl })
    .then(x => x.data && x.data.balance)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Get data from account dictionary by key
 * @param address - waves address as base58 string
 * @param key - dictionary key
 * @param nodeUrl - node address to ask balance from. E.g. https://nodes.wavesplatform.com/
 */
export function addressDataByKey(address: string, key: string, nodeUrl: string): Promise<number | Uint8Array | string | null> {
  return axios.get(`addresses/data/${address}/${key}`, { baseURL: nodeUrl })
    .then(x => {
      switch (x.data.type) {
        case 'integer':
        case 'string':
          return x.data.value
        case 'binary':
          return serializePrimitives.BASE64_STRING(x.data.value)
        case 'boolean':
          return x.data.value === 'true'
      }
      return null
    })
    .catch(e => e.response && e.response.status === 404 ?
      Promise.resolve(null) :
      Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Sends order to matcher
 * @param ord - transaction to send
 * @param matcherUrl - matcher address to send order to. E.g. https://matcher.wavesplatform.com/
 */
export function submitOrder(ord: IOrder, matcherUrl: string) {
  return axios.post('matcher/orderbook', json.stringifyOrder(ord), {
    baseURL: matcherUrl,
    headers: { 'content-type': 'application/json' },
  })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}

/**
 * Sends cancel order command to matcher. Since matcher api requires amountAsset and priceAsset in request url,
 * this function requires them as params
 * @param co - signed cancelOrder object
 * @param amountAsset - amount asset of the order to be canceled
 * @param priceAsset - price asset of the order to be canceled
 * @param matcherUrl - matcher address to send order cancel to. E.g. https://matcher.wavesplatform.com/
 */
export function cancelSubmittedOrder(co: ICancelOrder, amountAsset: string | null, priceAsset: string | null, matcherUrl: string) {
  return axios.post(`matcher/orderbook/${amountAsset || 'WAVES'}/${priceAsset || 'WAVES'}/cancel`, JSON.stringify(co), {
    baseURL: matcherUrl,
    headers: { 'content-type': 'application/json' },
  })
    .then(x => x.data)
    .catch(e => Promise.reject(e.response && e.response.status === 400 ? new Error(e.response.data.message) : e))
}