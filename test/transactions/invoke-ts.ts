import { publicKey } from '@waves/ts-lib-crypto'
import { burn, invokeExpression } from '../../src'
import { burnMinimalParams, invokeExpressionMinimalParams } from '../minimalParams'
import { validateTxSignature } from '../utils'

describe('invoke expression', () => {

    const stringSeed = 'df3dd6d884714288a39af0bd973a1771c9f00f168cf040d6abb6a50dd5e055d8'

    it('should build invoke expression from minimal set of params', () => {
        const tx = invokeExpression({...invokeExpressionMinimalParams}, stringSeed)
        expect(tx).toMatchObject({ ...invokeExpressionMinimalParams })
        expect(tx.fee).toBe(500000)

    })
})