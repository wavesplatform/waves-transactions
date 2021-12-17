import { validators } from '../../src/index'
import { validate } from '../../src/validators'
import {TRANSACTION_TYPE} from '@waves/ts-types'


describe('Validators', () => {

    describe('Atomic validators', () => {

        it('Require', () => {

            const notRequired = validators.isRequired(false)
            const required = validators.isRequired(true)

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

        it('Valid Waves Alias', () => {
            expect(validators.isValidAlias('alias:W:test')).toBe(true)
            expect(validators.isValidAlias('alias:T:test1')).toBe(true)
            expect(validators.isValidAlias('alias:T:helloisalongaliasfortestwith30')).toBe(true)
            expect(validators.isValidAlias('test1')).toBe(false)
            expect(validators.isValidAlias('alias:W:tes')).toBe(false)
            expect(validators.isValidAlias('alias:W:helloisalongaliasfortestmorethan30simbols')).toBe(false)
            expect(validators.isValidAlias('alias:W:truealias:wrongalias')).toBe(false)
            expect(validators.isValidAlias('alias:W:WrongAlias')).toBe(false)

        })

        it('Is recipient', () => {
            expect(validators.isRecipient('alias:W:test')).toBe(true)
            expect(validators.isRecipient('3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj')).toBe(true)
            expect(validators.isRecipient('4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj')).toBe(false)
            expect(validators.isRecipient('test')).toBe(false)
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
            expect(is8({ length: 8 })).toBe(true)
            expect(is8(Uint8Array.from({ length: 8 }))).toBe(true)
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

        it('isByteArray', () => {
            expect(validators.isByteArray('')).toBe(false)
            expect(validators.isByteArray(null)).toBe(false)
            expect(validators.isByteArray([])).toBe(true)
            expect(validators.isByteArray({})).toBe(false)
            expect(validators.isByteArray({ length: 5 })).toBe(false)
            expect(validators.isByteArray([1, 2, 3, 4])).toBe(true)
            expect(validators.isByteArray([1, 2, 3, 4, 665])).toBe(false)
            expect(validators.isByteArray([1, 2, 3, 4, new Number(665)])).toBe(false)
            expect(validators.isByteArray([1, 2, 3, 4, new Number(5)])).toBe(true)
            expect(validators.isByteArray(new Uint8Array([1, 2, 3, 4, 665]))).toBe(true)
        })

        it('Is Array', () => {
            expect(validators.isArray(null)).toBe(false)
            expect(validators.isArray('')).toBe(false)
            expect(validators.isArray('trololo')).toBe(false)
            expect(validators.isArray(new Uint8Array([1, 2, 3]))).toBe(false)
            expect(validators.isArray([])).toBe(true)
            expect(validators.isArray([1, 2, 100, 1000])).toBe(true)
        })

        it('If Else', () => {
            const cond = validators.ifElse(validators.isArray, (value: Array<unknown>) => value[0], () => 'null')
            expect(cond([300])).toBe(300)
            expect(cond(null)).toBe('null')

        })

        it('pipe', () => {

            const process = validators.pipe(
                (value: unknown) => ({ 1: value }),
                (value: unknown) => ({ 2: value }),
                (value: unknown) => ({ 3: value })
            )

            const result = process('test')

            expect(result[3][2][1]).toBe('test')
        })

        it('prop', () => {
            expect(validators.prop('test')(null)).toBeUndefined()
            expect(validators.prop('test')({ test: 1 })).toBe(1)
        })

        it('validate pipe', () => {

            const process = validators.validatePipe(
                validators.isRequired(true),
                validators.isNumber,
                validators.isEq(5)
            )

            expect(process(null)).toBe(false)
            expect(process(0)).toBe(false)
            expect(process('5')).toBe(false)
            expect(process(5)).toBe(true)
            expect(process(Number(5))).toBe(true)
        })

        it('is public key', () => {
            expect(validators.isPublicKey(null)).toBe(false)
            expect(validators.isPublicKey('')).toBe(false)
            expect(validators.isPublicKey('moZHag4WASMh4YgBNzxmb8qSdBf')).toBe(false)
            expect(validators.isPublicKey('3mM3tuGyLKhzZLoqYmoZHag4WASMh4YgBNzxmb8qSdBf')).toBe(true)
            expect(validators.isPublicKey('3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBf')).toBe(true)

        })

        it('Validate attachment', () => {
            expect(validators.isAttachment(null)).toBe(true)
            expect(validators.isAttachment([])).toBe(true)
            expect(validators.isAttachment(undefined)).toBe(true)
            expect(validators.isAttachment('3mM3')).toBe(true)
            expect(validators.isAttachment(':3mM3')).toBe(false)
            expect(validators.isAttachment('3mM3tuGyLKhzZLoqY3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBfmoZHagAWASMh4YgBNzxmb8qSdBf3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBf3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBf3mM3tuGyLKhzZLoqY3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBfmoZHagAWASMh4YgBNzxmb8qSdBf3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBf3mM3tuGyLKhzZLoqYmoZHagAWASMh4YgBNzxmb8qSdBf')).toBe(false)
            expect(validators.isAttachment([{type: 'string', value: 'abs'}])).toBe(true)
            expect(validators.isAttachment([{type: 'string', value: true}])).toBe(false)
        })

        it('Validate assetId', () => {
            expect(validators.isWavesOrAssetId('474jTeYx2r2Va35794tCScAXWJG9hU2HcgxzMowaZUnu')).toBe(true)
            expect(validators.isWavesOrAssetId(null)).toBe(true)
            expect(validators.isWavesOrAssetId('WAVES')).toBe(true)
        })

        it('Validate by schema', () => {

            const schema = {
                recipient: validators.isRecipient,
                amount: validators.isNumberLike,
                bool: validators.orEq([true, false]),
            }

            const getError = (key: string) => key
            const validator = validators.validateByShema(schema, getError)

            expect(validator({
                recipient: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                amount: 10,
                bool: true,
            })).toBe(true)

            expect(() => validator({ recipient: 1 })).toThrow('recipient')

            expect(() => validator({
                recipient: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                amount: undefined,
            })).toThrow('amount')

            expect(() => validator({
                recipient: '3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj',
                amount: '2',
                bool: 1,
            })).toThrow('bool')

            const a: any = null

            expect(() => validator(a)).toThrow('recipient')
        })
    })

    describe('Tx validators', () => {

        it('transfer', () => {
            const transfer = {
                type: TRANSACTION_TYPE.TRANSFER,
                version: 2,
                senderPublicKey: '2M25DqL2W4rGFLCFadgATboS8EPqyWAN3DjH12AH5Kdr',
                assetId: 'WAVES',
                recipient: 'alias:W:test',
                amount: 100000,
                attachment: null,
                fee: 100000,
                feeAssetId: 'WAVES',
                timestamp: Date.now(),
            } as any


            expect(() => validate.transfer(transfer)).not.toThrow()
            expect(() => validate.transfer({ ...transfer, type: 1 })).toThrow()
            expect(() => validate.transfer({ ...transfer, version: 4 })).toThrow()
        })
    })
})

