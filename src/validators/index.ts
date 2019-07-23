export * from './validators'

import { transferValidator } from './transfer';
import { aliasValidator } from './alias';


export const validate = {
    transfer: transferValidator,
    alias: aliasValidator,
}
