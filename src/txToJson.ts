import { schemaTypeMap } from './schemas'
import { TTx } from './transactions'

const isLongType = (type:any) => {
  if (typeof type !== 'object' || type.length !== 2) return false
  return type[0]==='string' && type[1]==='number'
}

const resolveProp = (fullPath: string[], fullSchema:any): any => {

  function go(path: string[], schema:any):any{
    if (!schema) return
    if (schema.$ref){
      const refArr = schema.$ref.split('/')
      const definition = refArr[refArr.length - 1]
      return go(path, fullSchema.definitions[definition])
    }

    if (path.length === 0) return schema

    if (typeof schema !== 'object' || (!schema.type && !schema.$ref) ) return undefined

    if (schema.type === 'object') return go(path.slice(1), schema.properties[path[0]])

    if (schema.type === 'array') {
      return go(path.slice(1), schema.items)
    }

  }
  return go(fullPath, fullSchema)
}


export function txToJson(value: TTx): string | undefined {
  const path: string[] = []
  const stack: any[] = []
  const type: number = value.type

  function stringifyValue(value: any): string | undefined {

    if (typeof value === 'string') {
      const prop = resolveProp(path, schemaTypeMap[type] && schemaTypeMap[type].schema)
      if (prop && isLongType(prop.type)) {
        return value
      }
    }

    if (typeof value === 'boolean' || value instanceof Boolean ||
      value === null ||
      typeof value === 'number' || value instanceof Number ||
      typeof value === 'string' || value instanceof String ||
      value instanceof Date) {
      return JSON.stringify(value)
    }

    if (Array.isArray(value)) {
      return stringifyArray(value)
    }

    if (value && typeof value === 'object') {
      return stringifyObject(value)
    }

    return undefined
  }

  function stringifyArray(array: any[]): string {
    let str = '['

    const stackIndex = stack.length
    stack[stackIndex] = array

    for (let i = 0; i < array.length; i++) {
      let key = i + ''
      let item = array[i]

      if (typeof item !== 'undefined' && typeof item !== 'function') {
        path[stackIndex] = key
        str += stringifyValue(item)
      }
      else {
        str += 'null'
      }

      if (i < array.length - 1) {
        str += ','
      }
    }

    stack.length = stackIndex
    path.length = stackIndex

    str += ']'
    return str
  }

  function stringifyObject(object: any): string {
    let first = true
    let str = '{'

    const stackIndex = stack.length
    stack[stackIndex] = object

    for (let key in object) {
      if (object.hasOwnProperty(key)) {
        let value = object[key]

        if (includeProperty(value)) {
          if (first) {
            first = false
          }
          else {
            str += ','
          }

          str += ('"' + key + '":')

          path[stackIndex] = key
          str += stringifyValue(value)
        }
      }
    }

    stack.length = stackIndex
    path.length = stackIndex

    str += '}'
    return str
  }

  function includeProperty(value: any) {
    return typeof value !== 'undefined'
      && typeof value !== 'function'
  }

  return stringifyValue(value)
}
