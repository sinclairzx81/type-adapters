import type { TypeAdapter, Static } from '@type-adapters/adapter'
import type { RpcProceedure } from '@trpc/server'

export type RpcClientFunction<
  Adapter, 
  Input, 
  Output,
  Result = (input: Static<Adapter, Input>) => Promise<Static<Adapter, Output>>
> = Result

export type RpcClient<
  Router extends Record<PropertyKey, unknown>,
  Result = {
    [K in keyof Router]: 
      Router[K] extends RpcProceedure<infer Adapter extends TypeAdapter, infer Input, infer Output> ? RpcClientFunction<Adapter, Input, Output> :
      Router[K] extends Record<PropertyKey, unknown> ? RpcClient<Router[K]> :
      never
  }
> = Result

export declare function createTRPCClient<Router extends Record<PropertyKey, unknown>>(options?: any): RpcClient<Router>