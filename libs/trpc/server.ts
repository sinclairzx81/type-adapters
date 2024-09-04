import { TypeAdapter, Static } from '@type-adapters/adapter'
// ------------------------------------------------------------------
// Proceedure
// ------------------------------------------------------------------
export interface RpcRouterFunction {
  <Options extends Record<PropertyKey, unknown>>(options: Options): Options
}
// ------------------------------------------------------------------
// Proceedure
// ------------------------------------------------------------------
export type RpcProceedureCallback<
  Adapter extends TypeAdapter,
  Input extends unknown = unknown,
  Output extends unknown = unknown,
  Result = (options: { input: Static<Adapter, Input> }) => Static<Adapter, Output>
> = Result

export declare class RpcProceedure<
  Adapter extends TypeAdapter = TypeAdapter,
  Input extends unknown = unknown,
  Output extends unknown = unknown
> {
  constructor(adapter: Adapter) // use adapter to validate
  /** Override the adapter for this proceedure */
  public adapter<A extends TypeAdapter>(adapter: A): RpcProceedure<A, Input, Output>
  /** Specifies the proceedure input type */
  public input<Type>(type: Type): RpcProceedure<Adapter, Type, Output>
  /** Specifies the proceedure output type */
  public output<Type>(type: Type): RpcProceedure<Adapter, Input, Type>
  /** Defines this proceedures query callback */
  public query(callback: RpcProceedureCallback<Adapter, Input, Output>): RpcProceedure<Adapter, Input, Output>
  /** Defines this proceedures mutation callback */
  public mutation(callback: RpcProceedureCallback<Adapter, Input, Output>): RpcProceedure<Adapter, Input, Output>
}
// ------------------------------------------------------------------
// Context
// ------------------------------------------------------------------
export declare class RpcContext<Adapter extends TypeAdapter> {
  constructor(adapter: Adapter)
  public get router(): RpcRouterFunction
  public get proceedure(): RpcProceedure<Adapter>
}
// ------------------------------------------------------------------
// Init
// ------------------------------------------------------------------
export declare namespace initTRPC {
  export function create<Adapter extends TypeAdapter>(adapter: Adapter): RpcContext<Adapter>
}