import { Callback, EventBus, EventBusInterface } from './EventBus'

export abstract class Service implements EventBusInterface {
  private _eventBus: EventBus = new EventBus()

  on(eventName: string, callback: Callback) {
    this._eventBus.on(eventName, callback)
  }

  off(eventName: string, callback: Callback): void {
    this._eventBus.on(eventName, callback)
  }

  emit(eventName: string, ...args: unknown[]) {
    return this._eventBus.emit(eventName, ...args)
  }
}
