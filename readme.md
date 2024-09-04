# Type Adapters

Unified Adapter for Runtime Type Inference Libraries

## Overview

This project is a prototype design for a unified type adapter for TypeScript Runtime Type libraries. This project aims to define a common adapter interface that can be used by frameworks for type inference and validation without the framework having to take on explicit library dependencies. The adapter is written in support of type inference dependency injection.

This project provides reference implementations for [arktype](https://github.com/arktypeio/arktype), [effect](https://github.com/Effect-TS/effect), [io-ts](https://github.com/gcanti/io-ts), [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts), [scale-codec](https://www.npmjs.com/package/scale-codec), [superstruct](https://github.com/ianstormtaylor/superstruct), [typebox](https://github.com/sinclairzx81/typebox), [valibot](https://github.com/fabian-hiller/valibot), [yrel](https://github.com/romelperez/yrel), [yup](https://github.com/jquense/yup) and [zod](https://github.com/colinhacks/zod) as well as tRPC client and server declarations to demonstrate a possible integration path for established frameworks.

The project is provided as a complimentary resource for the [standard-schema](https://github.com/standard-schema/standard-schema) working group. It seeks to explore a low impact design that would enable libraries to be integrated into down level frameworks without each library having to adopt a common type level interface.

License MIT

## Contents

- [TypeAdapter and TRPC](./example/trpc.ts)
- [TypeAdapter Interfaces](#TypeAdapter-Interfaces)
- [TypeAdapter for Zod](#TypeAdapter-for-Zod)
- [TypeAdapter for TypeBox](#TypeAdapter-for-TypeBox)
- [TypeAdapter Example](#TypeAdapter-Example)
- [Prior Art](#Prior-Art)


<a name="TypeAdapter-Interfaces"></a>

## TypeAdapter Interfaces

TypeAdapters consist of the following types and interfaces.

```typescript
// Used to specify library static inference
export interface TypeInference {
  input: unknown
  output: unknown
}
// Used to specify runtime validation + hold adapter inference
export abstract class TypeAdapter<Inference extends TypeInference = TypeInference> {
  inference: Inference = {} as never
  abstract validate(schema: unknown, value: unknown): boolean
}
// Used to infer types on the adapter
export type Static<A, Type> = (
  A extends TypeAdapter<infer I extends TypeInference> 
    ? (I & { input: Type })['output']
    : unknown
)
```

<a name="TypeAdapter-for-Zod"></a>

## TypeAdapter for Zod

The following implements a type adapter for Zod.

```typescript
import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import * as z from 'zod'

export interface Inference extends TypeInference {
  output: this['input'] extends z.ZodSchema ? z.infer<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: z.ZodSchema, value: unknown): boolean {
    return schema.safeParse(value).success
  }
}
```

<a name="TypeAdapter-for-TypeBox"></a>

## TypeAdapter for TypeBox

The following implements a type adapter for TypeBox.

```typescript
import { TypeAdapter, TypeInference } from '@type-adapters/adapter'
import { TSchema, StaticDecode } from '@sinclair/typebox'
import { Value } from '@sinclair/typebox/value'

export interface Inference extends TypeInference {
  output: this['input'] extends TSchema ? StaticDecode<this['input']> : unknown
}
export class Adapter extends TypeAdapter<Inference> {
  validate(schema: TSchema, value: unknown): boolean {
    return Value.Check(schema, value)
  }
}
```

<a name="TypeAdapter-Example"></a>

## TypeAdapter Example

The following defines a MethodBuilder that creates runtime type safe methods. The MethodBuilder accepts an abstract TypeAdapter interface via constructor argument which is used to infer method parameter and return type types. The example also shows Zod and TypeBox usage with the MethodBuilder. 

The following aims to highlight `framework` and `type library` decoupling where only abstract TypeAdapter interfaces are known either side.

```typescript
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
  input: z.object({ 
    a: z.number(), 
    b: z.number() 
  }),
  output: z.number()
}, ({ a, b }) => a + b)

add({ a: 1, b: 2 }) // 3

// ------------------------------------------------------------------
// TypeBox Usage
// ------------------------------------------------------------------

import * as t from '@type-adapters/typebox'

const sub = new MethodBuilder(new t.Adapter()).method({
  input: t.Object({ 
    a: t.Number(), 
    b: t.Number() 
  }),
  output: t.Number()
}, ({ a, b }) => a + b)

sub({ a: 1, b: 2 }) // -1
```

<a name="Prior-Art"></a>

## Prior Art

Fastify Type Providers

https://fastify.dev/docs/latest/Reference/Type-Providers/

TypeSchema

https://github.com/decs/typeschema