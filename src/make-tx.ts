import {
  IAliasParams,
  IAliasTransaction,
  IBurnParams,
  IBurnTransaction,
  ICancelLeaseParams,
  ICancelLeaseTransaction,
  IDataParams,
  IDataTransaction,
  IExchangeTransaction,
  IInvokeScriptParams,
  IInvokeScriptTransaction,
  IIssueParams,
  IIssueTransaction,
  ILeaseParams,
  ILeaseTransaction,
  IMassTransferParams,
  IMassTransferTransaction,
  IReissueParams,
  IReissueTransaction,
  ISetAssetScriptParams,
  ISetAssetScriptTransaction,
  ISetScriptTransaction,
  ISponsorshipParams,
  ISponsorshipTransaction,
  ITransferParams,
  ITransferTransaction,
  TRANSACTION_TYPE, TTransactionType, WithId, WithSender
} from './transactions'
import { issue } from './transactions/issue'
import { transfer } from './transactions/transfer'
import { reissue } from './transactions/reissue'
import { burn } from './transactions/burn'
import { lease } from './transactions/lease'
import { cancelLease } from './transactions/cancel-lease'
import { alias } from './transactions/alias'
import { massTransfer } from './transactions/mass-transfer'
import { data } from './transactions/data'
import { setScript } from './transactions/set-script'
import { setAssetScript } from './transactions/set-asset-script'
import { sponsorship } from './transactions/sponsorship'
import { exchange } from './transactions/exchange'
import { invokeScript } from './transactions/invoke-script'

export type TTransaction<T extends TTransactionType> = TxTypeMap[T]

export type TxTypeMap = {
  [TRANSACTION_TYPE.ISSUE]: IIssueTransaction
  [TRANSACTION_TYPE.TRANSFER]: ITransferTransaction
  [TRANSACTION_TYPE.REISSUE]: IReissueTransaction
  [TRANSACTION_TYPE.BURN]: IBurnTransaction
  [TRANSACTION_TYPE.LEASE]: ILeaseTransaction
  [TRANSACTION_TYPE.CANCEL_LEASE]: ICancelLeaseTransaction
  [TRANSACTION_TYPE.ALIAS]: IAliasTransaction
  [TRANSACTION_TYPE.MASS_TRANSFER]: IMassTransferTransaction
  [TRANSACTION_TYPE.DATA]: IDataTransaction
  [TRANSACTION_TYPE.SET_SCRIPT]: ISetScriptTransaction
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: ISetAssetScriptTransaction
  [TRANSACTION_TYPE.SPONSORSHIP]: ISponsorshipTransaction
  [TRANSACTION_TYPE.EXCHANGE]: IExchangeTransaction
  [TRANSACTION_TYPE.INVOKE_SCRIPT]: IInvokeScriptTransaction
}
export type TTxParamsWithType<T extends TTransactionType> = TxParamsTypeMap[T]

export type TxParamsTypeMap = {
  [TRANSACTION_TYPE.ISSUE]: IIssueParams & { type: typeof TRANSACTION_TYPE.ISSUE }
  [TRANSACTION_TYPE.TRANSFER]: ITransferParams & { type: typeof TRANSACTION_TYPE.TRANSFER }
  [TRANSACTION_TYPE.REISSUE]: IReissueParams & { type: typeof TRANSACTION_TYPE.REISSUE }
  [TRANSACTION_TYPE.BURN]: IBurnParams & { type: typeof TRANSACTION_TYPE.BURN }
  [TRANSACTION_TYPE.LEASE]: ILeaseParams & { type: typeof TRANSACTION_TYPE.LEASE }
  [TRANSACTION_TYPE.CANCEL_LEASE]: ICancelLeaseParams & { type: typeof TRANSACTION_TYPE.CANCEL_LEASE }
  [TRANSACTION_TYPE.ALIAS]: IAliasParams & { type: typeof TRANSACTION_TYPE.ALIAS }
  [TRANSACTION_TYPE.MASS_TRANSFER]: IMassTransferParams & { type: typeof TRANSACTION_TYPE.MASS_TRANSFER }
  [TRANSACTION_TYPE.DATA]: IDataParams & { type: typeof TRANSACTION_TYPE.DATA }
  [TRANSACTION_TYPE.SET_SCRIPT]: ISetAssetScriptParams & { type: typeof TRANSACTION_TYPE.SET_SCRIPT }
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: ISetAssetScriptParams & { type: typeof TRANSACTION_TYPE.SET_ASSET_SCRIPT }
  [TRANSACTION_TYPE.SPONSORSHIP]: ISponsorshipParams & { type: typeof TRANSACTION_TYPE.SPONSORSHIP }
  [TRANSACTION_TYPE.EXCHANGE]: IExchangeTransaction & { type: typeof TRANSACTION_TYPE.EXCHANGE }
  [TRANSACTION_TYPE.INVOKE_SCRIPT]: IInvokeScriptParams & { type: typeof TRANSACTION_TYPE.INVOKE_SCRIPT }
}

/**
 * Makes transaction from params. Validates all fields and calculates id
 */
export function makeTx<T extends TTransactionType>(params: TTxParamsWithType<T> & WithSender): TTransaction<T> & WithId {
  if (params.type === TRANSACTION_TYPE.ISSUE) {
    return issue(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.TRANSFER) {
    return transfer(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.REISSUE) {
    return reissue(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.BURN) {
    return burn(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.LEASE) {
    return lease(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.CANCEL_LEASE) {
    return cancelLease(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.ALIAS) {
    return alias(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.MASS_TRANSFER) {
    return massTransfer(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.DATA) {
    return data(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.SET_SCRIPT) {
    return setScript(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.SET_ASSET_SCRIPT) {
    return setAssetScript(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.SPONSORSHIP) {
    return sponsorship(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.EXCHANGE) {
    return exchange(params as any) as any
  } else if (params.type === TRANSACTION_TYPE.INVOKE_SCRIPT) {
    return invokeScript(params as any) as any
  } else {
    throw new Error(`Unknown tx type: ${params.type}`)
  }
}
