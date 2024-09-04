import { Static, TypeAdapter } from '@type-adapters/adapter'

interface MethodOptions { 
  input: unknown, 
  output: unknown 
}

export type Method<Adapter extends TypeAdapter, Options extends MethodOptions> = 
  (input: Static<Adapter, Options['input']>) => Static<Adapter, Options['output']>

// Creates runtime type safe methods
export class MethodBuilder<Adapter extends TypeAdapter> {
  // Adapter dependency injected on constructor
  constructor(private readonly adapter: Adapter) { }

  // Method return type inferred via Adapter + Input + Output properties.
  public method<Options extends MethodOptions>(options: Options, callback: Method<Adapter, Options>): Method<Adapter, Options> {
    return (input: unknown) => {
      if(!this.adapter.validate(options.input, input)) { throw Error('invalid input') }
      const output = callback(input as never)
      if(!this.adapter.validate(options.output, output)) { throw Error('invalid output') }
      return output
    }
  }
}

// ------------------------------------------------------------------
// Zod Usage
// ------------------------------------------------------------------

import * as z from '@type-adapters/zod'

const add = new MethodBuilder(new z.Adapter()).method({
  input: z.object({ a: z.number(), b: z.number() }),
  output: z.number()
}, ({ a, b }) => a + b)

add({ a: 1, b: 2 }) // 3

// ------------------------------------------------------------------
// TypeBox Usage
// ------------------------------------------------------------------

import * as t from '@type-adapters/typebox'

const sub = new MethodBuilder(new t.Adapter()).method({
  input: t.Object({ a: t.Number(), b: t.Number() }),
  output: t.Number()
}, ({ a, b }) => a + b)

sub({ a: 1, b: 2 }) // -1