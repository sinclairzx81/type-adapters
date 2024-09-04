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

import { Rpc } from '@framework/rpc'

// ------------------------------------------------------------------
// AT: ArkType
// ------------------------------------------------------------------
{
  const types = AT.scope({
    Vector: {
      x: 'number',
      y: 'number',
      z: 'number'
    }
  }).export()

  new Rpc(new AT.Adapter()).method('echo', {
    input: types.Vector,
    output: types.Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// EF: Effect
// ------------------------------------------------------------------
{
  const Vector = EF.Schema.Struct({
    x: EF.Schema.Number,
    y: EF.Schema.Number,
    z: EF.Schema.Number,
  })
  
  new Rpc(new EF.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// IO: IO-TS
// ------------------------------------------------------------------
{
  const Vector = IO.type({
    x: IO.number,
    y: IO.number,
    z: IO.number
  })

  new Rpc(new IO.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// JS: Json Schema to Ts
// ------------------------------------------------------------------
{
  const Vector = {
    type: 'object',
    additionalProperties: false,
    required: ['x', 'y', 'z'],
    properties: {
      x: { type: 'number' },
      y: { type: 'number' },
      z: { type: 'number' }
    }
  } as const

  new Rpc(new JS.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// SC: Scale Codec
// ------------------------------------------------------------------
{
  const Vector = SC.object(
    SC.field('x', SC.f64), 
    SC.field('y', SC.f64), 
    SC.field('z', SC.f64)
  )

  new Rpc(new SC.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// SS: SuperStruct
// ------------------------------------------------------------------
{
  const Vector = SS.object({
    x: SS.number(),
    y: SS.number(),
    z: SS.number(),
  })

  new Rpc(new SS.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// VB: Valibot
// ------------------------------------------------------------------
{
  const Vector = VB.object({
    x: VB.number(),
    y: VB.number(),
    z: VB.number()
  })

  new Rpc(new VB.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// TB: TypeBox
// ------------------------------------------------------------------
{
  const Vector = TB.Object({
    x: TB.Number(),
    y: TB.Number(),
    z: TB.Number()
  })

  new Rpc(new TB.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// YR: Yrel
// ------------------------------------------------------------------
{
  const Vector = YR.y.object({
    x: YR.y.number(),
    y: YR.y.number(),
    z: YR.y.number() 
  })

  new Rpc(new YR.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// YP: Yup
// ------------------------------------------------------------------
{
  const Vector = YP.object({
    x: YP.number().required(),
    y: YP.number().required(),
    z: YP.number().required(),
  })

  new Rpc(new YP.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}
// ------------------------------------------------------------------
// ZD: Zod
// ------------------------------------------------------------------
{
  const Vector = ZD.object({
    x: ZD.number(),
    y: ZD.number(),
    z: ZD.number()
  })

  new Rpc(new ZD.Adapter()).method('echo', {
    input: Vector,
    output: Vector
  }, (input) => input)
}