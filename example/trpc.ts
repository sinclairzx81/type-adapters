import * as AT from '@type-adapters/arktype'
import * as EF from '@type-adapters/effect'
import * as IO from '@type-adapters/io-ts'
import * as JS from '@type-adapters/json-schema-to-ts'
import * as SC from '@type-adapters/scale-codec'
import * as SS from '@type-adapters/superstruct'
import * as VB from '@type-adapters/valibot'
import * as TB from '@type-adapters/typebox'
import * as YR from '@type-adapters/yrel'
import * as YP from '@type-adapters/yup'
import * as ZD from '@type-adapters/zod'

import { initTRPC } from '@trpc/server'

const t = initTRPC.create(new ZD.Adapter()) // default inference

// ------------------------------------------------------------------
// AppRouter
// ------------------------------------------------------------------
const AppRouter = t.router({
  adapters: {
  // --------------------------------------------------------------
  // ArkType
  // --------------------------------------------------------------
  AT: t.proceedure
    .adapter(new AT.Adapter()) // override inference
    .input(AT.type({ 
      a: 'number',
      b: 'number'
    }))
    .output(AT.type('number'))
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // Effect
  // --------------------------------------------------------------
  EF: t.proceedure
    .adapter(new EF.Adapter()) // override inference
    .input(EF.Schema.Struct({ 
      a: EF.Schema.Number,
      b: EF.Schema.Number,
    }))
    .output(EF.Schema.Number)
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // IO-TS
  // --------------------------------------------------------------
  IO: t.proceedure
    .adapter(new IO.Adapter()) // override inference
    .input(IO.type({ 
      a: IO.number,
      b: IO.number,
    }))
    .output(IO.number)
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // Json-Schema-ToTs
  // --------------------------------------------------------------
  JS: t.proceedure
    .adapter(new JS.Adapter('2020-12')) // override inference
    .input({
      type: 'object',
      additionalProperties: false,
      required: ['a', 'b'],
      properties: {
        a: { type: 'number' },
        b: { type: 'number' },
      }
    } as const)
    .output({ type: 'number' } as const)
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // ScaleCodec
  // --------------------------------------------------------------
  SC: t.proceedure
    .adapter(new SC.Adapter()) // override inference
    .input(SC.object(
      SC.field('a', SC.f64), 
      SC.field('b', SC.f64)
    ))
    .output(SC.f64)
    .query(({ input }) => input.a + input.b),

  // --------------------------------------------------------------
  // SuperStruct
  // --------------------------------------------------------------
  SS: t.proceedure
    .adapter(new SS.Adapter()) // override inference
    .input( SS.object({
      a: SS.number(),
      b: SS.number()
    }))
    .output(SS.number())
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // Valibot
  // --------------------------------------------------------------
  VB: t.proceedure
    .adapter(new VB.Adapter()) // override inference
    .input( VB.object({
      a: VB.number(),
      b: VB.number()
    }))
    .output(VB.number())
    .query(({ input }) => input.a + input.b),

  // --------------------------------------------------------------
  // TypeBox
  // --------------------------------------------------------------
  TB: t.proceedure
    .adapter(new TB.Adapter()) // override inference
    .input( TB.Object({
      a: TB.Number(),
      b: TB.Number()
    }))
    .output(TB.Number())
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // Yrel
  // --------------------------------------------------------------
  YR: t.proceedure
    .adapter(new YR.Adapter()) // override inference
    .input(YR.y.object({
      a: YR.y.number(),
      b: YR.y.number(),
    }))
    .output(YR.y.number())
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // Yup
  // --------------------------------------------------------------
  YP: t.proceedure
    .adapter(new YP.Adapter()) // override inference
    .input(YP.object({
      a: YP.number().required(),
      b: YP.number().required(),
    }))
    .output(YP.number())
    .query(({ input }) => input.a + input.b),
  // --------------------------------------------------------------
  // Zod
  // --------------------------------------------------------------
  ZD: t.proceedure
    .adapter(new ZD.Adapter()) // override inference
    .input(ZD.object({ 
      a: ZD.number(), 
      b: ZD.number() 
    }))
    .output(ZD.number())
    .query(({ input }) => input.a + input.b)
  }
})

// ------------------------------------------------------------------
// Client
// ------------------------------------------------------------------
import { createTRPCClient } from '@trpc/client'
const client = createTRPCClient<typeof AppRouter>({})
client.adapters.AT({ a: 1, b: 2 })
client.adapters.EF({ a: 1, b: 2 })
client.adapters.IO({ a: 1, b: 2 })
client.adapters.JS({ a: 1, b: 2 })
client.adapters.SC({ a: 1, b: 2 })
client.adapters.SS({ a: 1, b: 2 })
client.adapters.VB({ a: 1, b: 2 })
client.adapters.TB({ a: 1, b: 2 })
client.adapters.YR({ a: 1, b: 2 })
client.adapters.YP({ a: 1, b: 2 })
client.adapters.ZD({ a: 1, b: 2 })
