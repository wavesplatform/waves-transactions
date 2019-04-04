import Ajv = require('ajv')
import { mapObj } from '../generic'
import { TRANSACTION_TYPE } from '../transactions'
import schemas from './manifest'

const ajv = Ajv({
  allErrors: true,
})

export const validators = mapObj(schemas, (schema: any) => ajv.compile(schema))

export const schemaTypeMap: { [i: number]: { schema: any, paramsSchema: any, validator: Ajv.ValidateFunction, paramsValidator: Ajv.ValidateFunction } } = {
  [TRANSACTION_TYPE.ISSUE]: {
    schema: schemas.IIssueTransaction,
    paramsSchema: schemas.IIssueParams,
    validator: validators.IIssueTransaction,
    paramsValidator: validators.IIssueParams,
  },
  [TRANSACTION_TYPE.TRANSFER]: {
    schema: schemas.ITransferTransaction,
    paramsSchema: schemas.ITransferParams,
    validator: validators.ITransferTransaction,
    paramsValidator: validators.ITransferParams,
  },
  [TRANSACTION_TYPE.REISSUE]: {
    schema: schemas.IReissueTransaction,
    paramsSchema: schemas.IReissueParams,
    validator: validators.IReissueTransaction,
    paramsValidator: validators.IReissueParams,
  },
  [TRANSACTION_TYPE.BURN]: {
    schema: schemas.IBurnTransaction,
    paramsSchema: schemas.IBurnParams,
    validator: validators.IBurnTransaction,
    paramsValidator: validators.IBurnParams,
  },
  [TRANSACTION_TYPE.EXCHANGE]: {
    schema: schemas.IExchangeTransaction,
    paramsSchema: schemas.IExchangeTransaction,
    validator: validators.IExchangeTransaction,
    paramsValidator: validators.IExchangeTransaction,
  },
  [TRANSACTION_TYPE.LEASE]: {
    schema: schemas.ILeaseTransaction,
    paramsSchema: schemas.ILeaseParams,
    validator: validators.ILeaseTransaction,
    paramsValidator: validators.ILeaseParams,
  },
  [TRANSACTION_TYPE.CANCEL_LEASE]: {
    schema: schemas.ICancelLeaseTransaction,
    paramsSchema: schemas.ICancelLeaseParams,
    validator: validators.ICancelLeaseTransaction,
    paramsValidator: validators.ICancelLeaseParams,
  },
  [TRANSACTION_TYPE.ALIAS]: {
    schema: schemas.IAliasTransaction,
    paramsSchema: schemas.IAliasParams,
    validator: validators.IAliasTransaction,
    paramsValidator: validators.IAliasParams,
  },

  [TRANSACTION_TYPE.MASS_TRANSFER]: {
    schema: schemas.IMassTransferTransaction,
    paramsSchema: schemas.IMassTransferParams,
    validator: validators.IMassTransferTransaction,
    paramsValidator: validators.IMassTransferParams,
  },
  [TRANSACTION_TYPE.DATA]: {
    schema: schemas.IDataTransaction,
    paramsSchema: schemas.IDataParams,
    validator: validators.IDataTransaction,
    paramsValidator: validators.IDataParams,
  },
  [TRANSACTION_TYPE.SET_SCRIPT]: {
    schema: schemas.ISetScriptTransaction,
    paramsSchema: schemas.ISetScriptParams,
    validator: validators.ISetScriptTransaction,
    paramsValidator: validators.ISetScriptParams,
  },
  [TRANSACTION_TYPE.SPONSORSHIP]: {
    schema: schemas.ISponsorshipTransaction,
    paramsSchema: schemas.ISponsorshipParams,
    validator: validators.ISponsorshipTransaction,
    paramsValidator: validators.ISponsorshipParams,
  },
  [TRANSACTION_TYPE.SET_ASSET_SCRIPT]: {
    schema: schemas.ISetAssetScriptTransaction,
    paramsSchema: schemas.ISetAssetScriptParams,
    validator: validators.ISetAssetScriptTransaction,
    paramsValidator: validators.ISetAssetScriptParams,
  },
  [TRANSACTION_TYPE.INVOKE_SCRIPT]: {
    schema: schemas.IInvokeScriptTransaction,
    paramsSchema: schemas.IInvokeScriptParams,
    validator: validators.IInvokeScriptTransaction,
    paramsValidator: validators.IInvokeScriptParams,
  },
}

export {
  schemas
}