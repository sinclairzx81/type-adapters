// ------------------------------------------------------------------
//
// The following is a MethodBuilder type that creates runtime type 
// safe methods. This builder exclusively uses the Static and 
// TypeAdapter types. 
// 
// ------------------------------------------------------------------
import { Static, TypeAdapter } from '@type-adapters/adapter'

interface MethodOptions {
  parameter: unknown
  returnType: unknown
}
export type Method<
  Adapter extends TypeAdapter, 
  Options extends MethodOptions, 
  Result = (input: Static<Adapter, Options['parameter']>) => 
    Static<Adapter, Options['returnType']>
> = Result

export class MethodBuilder<Adapter extends TypeAdapter> {
  constructor(private readonly adapter: Adapter) { }
  public method<Options extends MethodOptions>(
    options: Options, 
    callback: Method<Adapter, Options>
  ): Method<Adapter, Options>  { 
    return (input: unknown) => {
      if(!this.adapter.validate(options.parameter, input)) throw Error('invalid parameter')
      const output = callback(input as never)
      if(!this.adapter.validate(options.returnType, output)) throw Error('invalid returnType')
      return output
    }
  }
}

// ------------------------------------------------------------------
//
// The following creates a new MethodBuilder instances using Zod 
// and TypeBox respectively. Note the instance is able to correctly 
// derive type information through the adapter.
// 
// ------------------------------------------------------------------

import * as z from '@type-adapters/zod'
import * as t from '@type-adapters/typebox'

// Zod

const add = new MethodBuilder(new z.Adapter()).method({
  parameter: z.object({ 
    a: z.number(), 
    b: z.number() 
  }),
  returnType: z.number()
}, ({ a, b }) => a + b)

const z_result = add({ a: 1, b: 2 }) // 3

// TypeBox

const echo = new MethodBuilder(new t.Adapter()).method({
  parameter: t.TemplateLiteral('${0|1}${0|1}'),
  returnType: t.String()
}, (input) => input)

const t_result = echo('00') // '00'






