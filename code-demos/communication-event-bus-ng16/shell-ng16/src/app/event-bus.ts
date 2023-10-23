import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter } from 'rxjs';

@Injectable({providedIn: 'root'})
// https://martinfowler.com/eaaDev/EventAggregator.html
// The purpose of this event bus/event aggregator is to allow communicating events
// between the view components. Example:
//
// View one has a button that when clicked should cause an effect on view two.
// The event bus could be used by view one to publish an event that the
// view two subscribes and reacts to.
export class EventBus {
  // Without a BehaviorSubject the order in which events are published and
  // subscribed matters. With just a Subject if a publish occurs before a
  // getEvent subscription then that event is missed.
  private _subject = new BehaviorSubject<any>({});

  public publish<T>(event: T) {
    this._subject.next(event);
  }

  // TODO add this info to the README as well
  // The input param `t: new (...args: any[]) => T` is a construct signature
  // It allows the following syntax:
  // eventBus.GetEvent(PaymentEvent).Subscribe(...)
  //
  // It restricts the input parameter to something that is of a certain type, in the
  // example given of the type PaymentEvent, and it must have a constructor with zero
  // or more arguments of any type. Meaning PaymentEvent can't be a type or interface,
  // it must be a class
  //
  // For more info see:
  //
  // - Typescript docs on Construct Signatures -> https://www.typescriptlang.org/docs/handbook/2/functions.html#construct-signatures
  // - FAQs on microsoft/TypeScript repo: "Why can't I write typeof T, new T, or instanceof T in my generic function?"" -> https://github.com/microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
  // - Issue on microsoft/TypeScript repo: "Suggestion: typeof of generic type" -> https://github.com/microsoft/TypeScript/issues/204
  public getEvent$<T>(t: new (...args: any[]) => T): Observable<T> {
    return this._subject.pipe(
      filter((e): e is T => e instanceof t)
    );
  }
}
