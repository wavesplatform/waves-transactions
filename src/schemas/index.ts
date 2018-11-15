import Ajv, { ValidateFunction } from 'ajv'
import { TransactionType } from '../transactions'
import schemas from './manifest'

const ajv = Ajv({
  allErrors: true,
})

const mapObj = (obj: any, f: (v: any) => any): { [key: string]: ValidateFunction } => {
  return Object.entries(obj).map(([k, v]) => [k, f(v)]).reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {} as any)
}

export const VALIDATOR_MAP = mapObj(schemas, ajv.compile.bind(ajv))

export const schemaByTranscationType: { [i: number]: any } = {
  [TransactionType.Issue]: schemas.IssueTransaction,
  [TransactionType.Transfer]: schemas.TransferTransaction,
  [TransactionType.Reissue]: schemas.ReissueTransaction,
  [TransactionType.Burn]: schemas.BurnTransaction,
  [TransactionType.Lease]: schemas.LeaseTransaction,
  [TransactionType.CancelLease]: schemas.CancelLeaseTransaction,
  [TransactionType.Alias]: schemas.AliasTransaction,
  [TransactionType.MassTransfer]: schemas.MassTransferTransaction,
  [TransactionType.Data]: schemas.DataTransaction,
  [TransactionType.SetScript]: schemas.SetScriptTransaction,
}