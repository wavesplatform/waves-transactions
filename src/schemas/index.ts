import Ajv from 'ajv'
import { TRANSACTION_TYPE } from '../transactions'
import schemas from './manifest'

const ajv = Ajv({
  allErrors: true,
});

const mapObj = <T, U, K extends string>(obj: Record<K, T>, f:(v: T)=> U): Record<K, U> =>
  Object.entries<T>(obj).map(([k,v]) => [k, f(v)] as [string, U])
    .reduce((acc, [k,v]) => ({...acc as any, [k]: v}), {} as Record<K,U>)

export const validators = mapObj(schemas, (schema:any) => ajv.compile(schema));

export const schemaByTransactionType: { [i: number]: any } = {
  [TRANSACTION_TYPE.ISSUE]: schemas.IIssueTransaction,
  [TRANSACTION_TYPE.TRANSFER]: schemas.ITransferTransaction,
  [TRANSACTION_TYPE.REISSUE]: schemas.IReissueTransaction,
  [TRANSACTION_TYPE.BURN]: schemas.IBurnTransaction,
  [TRANSACTION_TYPE.LEASE]: schemas.ILeaseTransaction,
  [TRANSACTION_TYPE.CANCEL_LEASE]: schemas.ICancelLeaseTransaction,
  [TRANSACTION_TYPE.ALIAS]: schemas.IAliasTransaction,
  [TRANSACTION_TYPE.MASS_TRANSFER]: schemas.IMassTransferTransaction,
  [TRANSACTION_TYPE.DATA]: schemas.IDataTransaction,
  [TRANSACTION_TYPE.SET_SCRIPT]: schemas.ISetScriptTransaction,
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: schemas.ISetAssetScriptTransaction,
}

export const validatorByTransactionType: Record<number, Ajv.ValidateFunction> = {
  [TRANSACTION_TYPE.ISSUE]: validators.IIssueTransaction,
  [TRANSACTION_TYPE.TRANSFER]: validators.ITransferTransaction,
  [TRANSACTION_TYPE.REISSUE]: validators.IReissueTransaction,
  [TRANSACTION_TYPE.BURN]: validators.IBurnTransaction,
  [TRANSACTION_TYPE.LEASE]: validators.ILeaseTransaction,
  [TRANSACTION_TYPE.CANCEL_LEASE]: validators.ICancelLeaseTransaction,
  [TRANSACTION_TYPE.ALIAS]: validators.IAliasTransaction,
  [TRANSACTION_TYPE.MASS_TRANSFER]: validators.IMassTransferTransaction,
  [TRANSACTION_TYPE.DATA]: validators.IDataTransaction,
  [TRANSACTION_TYPE.SET_SCRIPT]: validators.ISetScriptTransaction,
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: validators.ISetAssetScriptTransaction,
}