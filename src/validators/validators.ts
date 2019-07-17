import { base58Decode, base64Decode, keccak, blake2b } from '@waves/waves-crypto'




export const isEq = <T>(reference: T) => (value: unknown) => {
    switch (true) {
        case isNumber(value) && isNumber(reference):
            return Number(value) === Number(reference)
        case isString(value) && isString(reference):
            return String(reference) === String(value)
        default:
            return reference === value;
    }
}

export const orEq = (referencesList: Array<unknown>) => (value: unknown) => referencesList.some(isEq(value))

export const isRequired = (required: boolean) => (value: unknown) => !required || value != null

export const isString = (value: unknown) => typeof value === 'string' || value instanceof String

export const isNumber = (value: unknown) => (typeof value === 'number' || value instanceof Number) && !isNaN(Number(value))

export const isNumberLike = (value: unknown) => value != null && !isNaN(Number(value)) && !!(value || value === 0)

export const isArrayLike = (value: unknown) => {
    
}

export const bytesLength = (length: number) => (value: unknown) => {
    try {
        return Uint8Array.from(value as ArrayLike<number>).length === length
    } catch (e) {
        return false
    }
}

export const isBase58 = (value: unknown) => {
    try {
        base58Decode(value as string);
    } catch (e) {
        return false;
    }
    
    return true;
}

export const isBase64 = (value: unknown) => {
    try {
        base64Decode(value as string);
    } catch (e) {
        return false;
    }
    
    return true;
}

export const isValidAddress = (address: unknown, network?: number) => {
    if (typeof address !== 'string') {
        return false;
    }
    
    let addressBytes = base58Decode(address);
    
    if (addressBytes[0] !== 1) {
        return false;
    }
    
    if (network != null && addressBytes[1] != network) {
        return false;
    }
    
    let key = addressBytes.slice(0, 22);
    let check = addressBytes.slice(22, 26);
    let keyHash = keccak(blake2b(key)).slice(0, 4);
    
    for (let i = 0; i < 4; i++) {
        if (check[i] !== keyHash[i]) {
            return false;
        }
    }
    
    return true;
};
