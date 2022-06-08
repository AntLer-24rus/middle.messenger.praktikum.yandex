import type { Callback, EventBusInterface } from './EventBus'
import { getType } from './getType'

function isEventBusInterface(arg: unknown): arg is EventBusInterface {
  return arg instanceof Object && 'emit' in arg && 'on' in arg && 'off' in arg
}

function isCallback(arg: unknown): arg is Callback {
  return getType(arg) === 'function'
}

function isString(arg: unknown): arg is string {
  return getType(arg) === 'string'
}
export function disconnect(
  from: EventBusInterface,
  eventNameFrom: string,
  to: Callback
): void
export function disconnect(
  from: EventBusInterface,
  eventNameFrom: string,
  to: EventBusInterface,
  eventNameTo: string | Callback
): void

export function disconnect(
  from: EventBusInterface,
  eventNameFrom: string,
  to: EventBusInterface | Callback,
  eventNameTo?: string | Callback
): void {
  if (typeof to === 'function') {
    from.off(eventNameFrom, to)
  } else if (isEventBusInterface(to) && isCallback(eventNameTo)) {
    from.off(eventNameFrom, eventNameTo.bind(to))
  } else if (isEventBusInterface(to) && isString(eventNameTo)) {
    from.off(eventNameFrom, to.emit.bind(to, eventNameTo))
  }
}
