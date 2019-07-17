import { validators } from '../../src/index'

describe('Validators', () => {
    
    describe('Atomic validators', () => {
        
        it('Require', () => {
            
            const notRequired = validators.isRequired(false);
            const required = validators.isRequired(true);
            
            expect(notRequired(null)).toBe(true)
            expect(notRequired(undefined)).toBe(true)
            expect(notRequired(1)).toBe(true)
            expect(notRequired(0)).toBe(true)
            expect(notRequired('')).toBe(true)
            expect(notRequired('test')).toBe(true)
            expect(notRequired(Object.create(null))).toBe(true)
            
            expect(required(null)).toBe(false)
            expect(required(undefined)).toBe(false)
            expect(required(1)).toBe(true)
            expect(required(0)).toBe(true)
            expect(required('')).toBe(true)
            expect(required('test')).toBe(true)
            expect(required(Object.create(null))).toBe(true)
        })
        
        it('Equal', () => {
            const isOne = validators.isEq(1)
            const isNull = validators.isEq(null)
            const isUndefined = validators.isEq(undefined)
            const isTest = validators.isEq('test')
            
            expect(isOne(0)).toBe(false)
            expect(isOne('1')).toBe(false)
            expect(isOne(1)).toBe(true)
            expect(isOne(new Number(1))).toBe(true)
            
            expect(isNull(undefined)).toBe(false)
            expect(isNull(null)).toBe(true)
            
            expect(isUndefined(undefined)).toBe(true)
            expect(isUndefined(null)).toBe(false)
            
            expect(isTest(null)).toBe(false)
            expect(isTest('test')).toBe(true)
            expect(isTest(new String('test'))).toBe(true)
        })
        
        it('OrEqual', () => {
            const oneOf = validators.orEq([0, 1, 2, 'test'])
            
            expect(oneOf(null)).toBe(false)
            expect(oneOf(0)).toBe(true)
            expect(oneOf('1')).toBe(false)
            expect(oneOf(1)).toBe(true)
            expect(oneOf(2)).toBe(true)
            expect(oneOf('test')).toBe(true)
            expect(oneOf(new String('test'))).toBe(true)
        })
        
        it('IsString', () => {
            expect(validators.isString(1)).toBe(false)
            expect(validators.isString('')).toBe(true)
            expect(validators.isString(new String('123'))).toBe(true)
        })
        
        it('IsNumber', () => {
            expect(validators.isNumberLike('')).toBe(false)
            expect(validators.isNumberLike(0)).toBe(true)
            expect(validators.isNumberLike(null)).toBe(false)
            expect(validators.isNumberLike(1)).toBe(true)
            expect(validators.isNumberLike(new String('123'))).toBe(true)
            expect(validators.isNumberLike('123')).toBe(true)
            expect(validators.isNumberLike(new Number(0))).toBe(true)
        })
        
        it('Valid Waves Address', () => {
            expect(validators.isValidAddress(null)).toBe(false)
            expect(validators.isValidAddress(Object.create(null))).toBe(false)
            expect(validators.isValidAddress('3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj')).toBe(true)
            expect(validators.isValidAddress('3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj', 'T'.charCodeAt(0))).toBe(false)
            expect(validators.isValidAddress('3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj', 'W'.charCodeAt(0))).toBe(true)
            expect(validators.isValidAddress('3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8', 'W'.charCodeAt(0))).toBe(false)
            expect(validators.isValidAddress('3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fa')).toBe(false)
        })
        
        it('Bytes Length', () => {
            const is2 = validators.bytesLength(2)
            const is5 = validators.bytesLength(5)
            const is8 = validators.bytesLength(8)
            
            expect(is2([1, 2])).toBe(true)
            expect(is2([1, 2, 3])).toBe(false)
            expect(is2(null)).toBe(false)
            
            expect(is5(new Uint8Array([1, 2, 3, 4, 5]))).toBe(true)
            expect(is5([])).toBe(false)
            
            expect(is8({ 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, length: 8 })).toBe(true)
            expect(is8({length: 8 })).toBe(true)
            expect(is8(Uint8Array.from({length: 8 }))).toBe(true)
        })
    })
    
    it('Base58 validator', () => {
        expect(validators.isBase58('')).toBe(true)
        expect(validators.isBase58('2M251qL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kd1')).toBe(true)
        expect(validators.isBase58('base58:2M251qL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kd1')).toBe(false)
        expect(validators.isBase58(null)).toBe(false)
    })
    
    it('Base64 validator', () => {
        expect(validators.isBase64('')).toBe(true)
        expect(validators.isBase64('K0HJI42oXrHh')).toBe(true)
        expect(validators.isBase64('base64:K0HJI42oXrHh')).toBe(true)
        expect(validators.isBase64('base64:')).toBe(true)
        expect(validators.isBase64(null)).toBe(false)
    })
    
})
