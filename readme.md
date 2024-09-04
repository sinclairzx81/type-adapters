# Type Adapters

Unified Adapters for Runtime Type and Inference Libraries

### Overview

This project is a prototype design for a unified type adapter for all major TypeScript runtime type libraries. It seeks to define a common interface specifically for framework integration; enabling frameworks to leverage a multitude runtime and static inference packages without having to pull those packages in as dependencies. 

The project provides reference implementations for [arktype](https://github.com/arktypeio/arktype), [effect](https://github.com/Effect-TS/effect), [io-ts](https://github.com/gcanti/io-ts), [json-schema-to-ts](https://github.com/ThomasAribart/json-schema-to-ts), [scale-codec](https://www.npmjs.com/package/scale-codec), [superstruct](https://github.com/ianstormtaylor/superstruct), [typebox](https://github.com/sinclairzx81/typebox), [valibot](https://github.com/fabian-hiller/valibot), [yrel](https://github.com/romelperez/yrel), [yup](https://github.com/jquense/yup) and [zod](https://github.com/colinhacks/zod) as well as a reference rpc framework to demonstrate how adapters could apply to tRpc. The project itself is provided as a complimentary resource for the [standard-schema](https://github.com/standard-schema/standard-schema) working group. It seeks to explore an alternative low impact design that enables all libraries to be integrated without each library conforming to common interfaces.

MIT

### Contents

- [TypeAdapter Example](#TypeAdapter-Example)
- [TypeAdapter for Zod](#TypeAdapter-for-Zod)
- [TypeAdapter for TypeBox](#TypeAdapter-for-TypeBox)
- [TypeAdapter Interfaces](#TypeAdapter-Interfaces)
- [Prior Art](#Prior-Art)

<a name="TypeAdapter-for-Example"></a>

### TypeAdapter Example

The following demonstrates high level usage, both for the framework integrator (MethodBuilder) and end user. The example shows Zod and TypeBox integration with the MethodBuilder. The only requirement is that method builder receive a TypeAdapter as a dependency.

```typescript
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

// ------------------------------------------------------------------
// Zod
// ------------------------------------------------------------------
const add = new MethodBuilder(new z.Adapter()).method({
  parameter: z.object({ 
    a: z.number(), 
    b: z.number() 
  }),
  returnType: z.number()
}, ({ a, b }) => a + b)

const z_result = add({ a: 1, b: 2 }) // 3

// ------------------------------------------------------------------
// TypeBox
// ------------------------------------------------------------------

const echo = new MethodBuilder(new t.Adapter()).method({
  parameter: t.TemplateLiteral('${0|1}${0|1}'),
  returnType: t.String()
}, (input) => input)

const t_result = echo('00') // '00'
```

<a name="TypeAdapter-for-Zod"></a>

### TypeAdapter for Zod

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

### TypeAdapter for TypeBox

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

<a name="TypeAdapter-Interfaces"></a>

### TypeAdapter Interfaces

TypeAdapters consist of the following types. 

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

<a name="Prior-Art"></a>

### Prior Art

Fastify: Type Providers

https://fastify.dev/docs/latest/Reference/Type-Providers/

TypeSchema: Universal adapter for schema validation

https://github.com/decs/typeschema