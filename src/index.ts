// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


// internal libraries access
import * as crypto from '@waves/ts-lib-crypto'
import * as marshall from '@waves/marshall'

import { serializeCustomData } from './requests/custom-data'
import * as seedUtils from './seedUtils'
import * as validators from './validators'
import * as protoSerialize from './proto-serialize'

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
export { commitToGeneration } from './transactions/commit-to-generation'
export { signTx, verify, serialize, verifyAuthData, verifyCustomData, verifyWavesAuthData } from './general'
export { makeTx, makeTxBytes } from './make-tx'

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
  ICommitToGenerationParams,
  IOrderParams,
  ICancelOrder,
  ICancelOrderParams,
  WithId,
  WithSender,
  WithProofs,
  WithTxType,
} from './transactions'

export {
  TSeedTypes, TOption
} from './types'

const libs = {
  crypto,
  marshall,
  // nodeApiJs
}

export {
  libs,
  seedUtils,
  validators,
  protoSerialize
}

