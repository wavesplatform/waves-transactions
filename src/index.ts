// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { serializeCustomData } from './requests/custom-data'

export { massTransfer } from './transactions/mass-transfer'
export { reissue } from './transactions/reissue'
export { burn } from './transactions/burn'
export { exchange } from './transactions/exchange'
export { lease } from './transactions/lease'
export { cancelLease } from './transactions/cancel-lease'
export { data } from './transactions/data'
export { issue } from './transactions/issue'
export { transfer } from './transactions/transfer'
export { alias } from './transactions/alias'
export { setScript } from './transactions/set-script'
export { setAssetScript } from './transactions/set-asset-script'
export { sponsorship } from './transactions/sponsorship'
export { order } from './requests/order'
export { cancelOrder } from './requests/cancel-order'
export { customData, serializeCustomData } from './requests/custom-data'
export { auth } from './requests/auth'
export { wavesAuth } from './requests/wavesAuth'
export { invokeScript } from './transactions/invoke-script'
export { updateAssetInfo } from './transactions/update-asset-info'
export { signTx, verify, serialize, submitOrder, cancelSubmittedOrder, verifyAuthData, verifyCustomData, verifyWavesAuthData } from './general'
export { waitForTx, broadcast } from './nodeInteraction'
export { makeTx, makeTxBytes } from './make-tx'
// export { invokeExpression } from './transactions/invoke-expression'

// Export interfaces
export {
  TTx,
  TTxParams,
  IAliasParams,
  IIssueParams,
  IReissueParams,
  IBurnParams,
  ILeaseParams,
  ICancelLeaseParams,
  ITransferParams,
  IMassTransferParams,
  ISetScriptParams,
  ISponsorshipParams,
  IDataParams,
  ISetAssetScriptParams,
  IInvokeScriptParams,
  IUpdateAssetInfoParams,
  IOrderParams,
  ICancelOrder,
  ICancelOrderParams,
  WithId,
  WithSender,
  WithProofs,
  WithTxType,
} from './transactions'

export { INodeRequestOptions, IStateChangeResponse } from './nodeInteraction'

export {
  TSeedTypes, TOption
} from './types'

// internal libraries access
import * as crypto from '@waves/ts-lib-crypto'
import * as marshall from '@waves/marshall'
// import * as nodeApiJs from '@waves/node-api-js'

const libs = {
  crypto,
  marshall,
  // nodeApiJs
}

import * as seedUtils from './seedUtils'
import * as nodeInteraction from './nodeInteraction'
import * as validators from './validators'
import * as protoSerialize from './proto-serialize'

export {
  libs,
  seedUtils,
  nodeInteraction,
  validators,
  protoSerialize
}

