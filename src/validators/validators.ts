import {base58Decode, base64Decode, keccak, blake2b, stringToBytes} from '@waves/ts-lib-crypto'


const TX_DEFAULTS = {
    MAX_ATTACHMENT: 140,
    ALIAS: {
        AVAILABLE_CHARS: '-.0123456789@_abcdefghijklmnopqrstuvwxyz',
        MAX_ALIAS_LENGTH: 30,
        MIN_ALIAS_LENGTH: 4,
    },
}

const ASSETS = {
    NAME_MIN_BYTES: 4,
    NAME_MAX_BYTES: 16,
    DESCRIPTION_MAX_BYTES: 1000,
}


export const defaultValue = (value: unknown) => () => value

export const nope = (value: any) => value

export const pipe = (...args: Array<Function>) => (value: unknown) => args.reduce((acc: unknown, cb) => cb(acc), value)

export const validatePipe = (...args: Array<Function>) => (value: unknown) => {
    let isValid = true

    for (const cb of args) {
        isValid = !!cb(value)
        if (!isValid) {
            return false
        }
    }

    return isValid
}

export const prop = (key: string | number) => (value: unknown) => value ? (value as any)[key] : undefined

export const lte = (ref: any) => (value: any) => ref >= value

export const gte = (ref: any) => (value: any) => ref <= value

export const ifElse = (condition: Function, a: Function, b: Function) => (value: unknown) => condition(value) ? a(value) : b(value)

export const isEq = <T>(reference: T) => (value: unknown) => {
    switch (true) {
        case isNumber(value) && isNumber(reference):
            return Number(value) === Number(reference)
        case isString(value) && isString(reference):
            return String(reference) === String(value)
        case isBoolean(value) && isBoolean(reference):
            return Boolean(value) === Boolean(reference)
        default:
            return reference === value
    }
}

export const orEq = (referencesList: Array<unknown>) => (value: unknown) => referencesList.some(isEq(value))

export const isRequired = (required: boolean) => (value: unknown) => !required || value != null

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String

export const isNumber = (value: unknown) => (typeof value === 'number' || value instanceof Number) && !isNaN(Number(value))

export const isNumberLike = (value: unknown) => value != null && !isNaN(Number(value)) && !!(value || value === 0)

export const isNaturalNumberLike = (value: unknown) => value != null && !isNaN(Number(value)) && Number(value) > 0

export const isNaturalNumberOrZeroLike = (value: unknown) => value != null && !isNaN(Number(value)) && Number(value) >= 0

export const isNaturalNumberOrNullLike = (value: unknown) => (!isNaN(Number(value)) && Number(value) > 0) || value === null

export const isBoolean = (value: unknown) => value != null && (typeof value === 'boolean' || value instanceof Boolean)

export const isByteArray = (value: unknown) => {
    if (!value) {
        return false
    }

    const bytes = new Uint8Array(value as any)
    return bytes.length === (value as any).length && bytes.every((val, index) => isEq(val)((value as any)[index]))
}

export const isArray = (value: unknown) => Array.isArray(value)

export const bytesLength = (length: number) => (value: unknown) => {
    try {
        return Uint8Array.from(value as ArrayLike<number>).length === length
    } catch (e) {
        return false
    }
}

export const isBase58 = (value: unknown) => {
    try {
        base58Decode(value as string)
    } catch (e) {
        return false
    }

    return true
}

export const isBase64 = (value: unknown) => {
    try {
        value = (value as string).replace(/^base64:/, '')
        base64Decode(value as string)
    } catch (e) {
        return false
    }

    return true
}

export const isValidAddress = (address: unknown, network?: number) => {
    if (typeof address !== 'string' || !isBase58(address)) {
        return false
    }

    let addressBytes = base58Decode(address)

    if (addressBytes[0] !== 1) {
        return false
    }

    if (network != null && addressBytes[1] != network) {
        return false
    }

    let key = addressBytes.slice(0, 22)
    let check = addressBytes.slice(22, 26)
    let keyHash = keccak(blake2b(key)).slice(0, 4)

    for (let i = 0; i < 4; i++) {
        if (check[i] !== keyHash[i]) {
            return false
        }
    }

    return true
}

const validateChars = (chars: string) => (value: string) => value.split('').every((char: string) => chars.includes(char))


export const isValidAliasName = ifElse(
    validateChars(TX_DEFAULTS.ALIAS.AVAILABLE_CHARS),
    pipe(
        prop('length'),
        validatePipe(
            lte(TX_DEFAULTS.ALIAS.MAX_ALIAS_LENGTH),
            gte(TX_DEFAULTS.ALIAS.MIN_ALIAS_LENGTH)
        )
    ),
    defaultValue(false)
)


export const isValidAlias = validatePipe(
    isString,
    pipe(
        (value: string) => value.split(':'),
        ifElse(
            (value: Array<string>) => value[0] !== 'alias' || value.length !== 3,
            defaultValue(false),
            pipe(
                prop(2),
                isValidAliasName
            )
        )
    )
)

export const isHash = validatePipe(
    isRequired(true),
    isBase58,
    pipe(
        (value: string) => base58Decode(value),
        bytesLength(32)
    )
)

export const isPublicKey = isHash

export const isPublicKeyForEthSuppTx = ifElse(
    orEq(['', null, undefined]),
    defaultValue(true),
    pipe(
        (value: string) => base58Decode(value),
        (value: Uint8Array) => {
            try {
                return Uint8Array.from(value).length === 32 || Uint8Array.from(value).length === 64
            } catch (e) {
                return false
            }
        }
    )
)

export const isWavesOrAssetId = ifElse(
    orEq(['', null, undefined, 'WAVES']),
    defaultValue(true),
    isHash
)

export const isAssetId = isHash

export const isAttachment = ifElse(
    orEq([null, undefined]),
    defaultValue(true),
    ifElse(
        // if valid Data Pair
        validatePipe(isArray, (data: any[]) => data.every(isValidDataPair)),
        defaultValue(true),
        // else if valid base58 or bytearray
        pipe(
            ifElse(
                isBase58,
                base58Decode,
                nope
            ),
            ifElse(
                isByteArray,
                pipe(
                    prop('length'),
                    lte(TX_DEFAULTS.MAX_ATTACHMENT)
                ),
                defaultValue(false)
            )
        )
    )
)


const validateType = {
    integer: isNumberLike,
    boolean: isBoolean,
    string: isString,
    binary: isBase64,
    list: isArray,
}

export const isValidDataPair = (data: { type: keyof typeof validateType, value: unknown }) =>
    !!(validateType[data.type] && validateType[data.type](data.value))

export const isValidData = validatePipe(
    isRequired(true),
    pipe(prop('key'), validatePipe(isString, (key: string) => !!key)),

    isValidDataPair
)
export const isValidDeleteRequest = validatePipe(
    isRequired(true),
    pipe(prop('key'), validatePipe(isString, (key: string) => !!key)),
    ({type, value}: any) => type == null && value == null
)

export const isValidAssetName = validatePipe(
    isRequired(true),
    isString,
    pipe(
        stringToBytes,
        prop('length'),
        ifElse(
            gte(ASSETS.NAME_MIN_BYTES),
            lte(ASSETS.NAME_MAX_BYTES),
            defaultValue(false)
        )
    )
)

export const isValidAssetDescription = validatePipe(
    isRequired(false),
    defaultValue(true),
    pipe(
        stringToBytes,
        prop('length'),
        lte(ASSETS.DESCRIPTION_MAX_BYTES)
    )
)

export const exception = (msg: string) => {
    throw new Error(msg)
}

export const isRecipient = ifElse(isValidAddress, defaultValue(true), isValidAlias)

export const validateByShema = (shema: Record<string, Function>, errorTpl: (key: string, value?: unknown) => string) => (tx: Record<string, any>) => {
    Object.entries(shema).forEach(
        ([key, cb]) => {
            const value = prop(key)(tx || {})
            if (!cb(value)) {
                exception(errorTpl(key, value))
            }
        }
    )

    return true
}

export const getError = (key: string, value: any) => {
    return `tx "${key}", has wrong data: ${JSON.stringify(value)}. Check tx data.`
}
