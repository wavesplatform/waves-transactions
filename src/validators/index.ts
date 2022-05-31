export * from './validators'

import { transferValidator as transfer } from './transfer'
import { massTransferValidator as massTransfer } from './mass-transfer'
import { aliasValidator as alias } from './alias'
import { burnValidator as burn} from './burn'
import { cancelLeaseValidator as cancelLease } from './cancel-lease'
import { dataFieldValidator, dataValidator as data } from './data'
import { sponsorshipValidator as sponsorship } from './sponsorship'
import { setAssetScriptValidator as setAssetScript } from './set-asset-script'
import { setScriptValidator as setScript } from './set-script'
import { reissueValidator as reissue } from './reissue'
import { issueValidator as issue } from './issue'
import { leaseValidator as lease } from './lease'
import { invokeValidator as invokeScript } from './invoke-script'
import { exchangeValidator as exchange } from './exchange'
import { updateAssetInfoValidator as updateAssetInfo } from './update-asset-info'
// import { invokeExpressionValidator as invokeExpression } from './invoke-expression'

import { orderValidator as order } from './order'
import { cancelOrderValidator as cancelOrder } from './cancel-order'
import { customDataValidator as customData } from './custom-data'
import { authValidator as auth } from './auth'
import { authValidator as wavesAuth } from './wavesAuth'


export const validate = {
    transfer,
    massTransfer,
    alias,
    issue,
    reissue,
    sponsorship,
    burn,
    setAssetScript,
    cancelLease,
    data,
    dataFieldValidator,
    lease,
    setScript,
    invokeScript,
    exchange,
    updateAssetInfo,
    // invokeExpression,
    cancelOrder,
    customData,
    order,
    wavesAuth,
    auth,
}
