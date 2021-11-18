import {
    isEq,
    isArray,
    getError,
    validateByShema,
    ifElse,
    prop,
    isBase64,
    validatePipe,
    isRequired,
    isValidDataPair,
    pipe
} from './validators'

const customDataV1Scheme = {
    version: isEq(1),
    binary: isBase64,
}

const customDataV2Scheme = {
    version: isEq(2),
    data: validatePipe(
        isArray,
        (data: Array<unknown>) => data.every(
            validatePipe(
                isRequired(true),
                isValidDataPair
            )
        )
    ),
}

const v1Validator = validateByShema(customDataV1Scheme, getError)
const v2Validator = validateByShema(customDataV2Scheme, getError)

export const customDataValidator = ifElse(
    pipe(prop('version'), isEq(1)),
    v1Validator, 
    v2Validator
)
