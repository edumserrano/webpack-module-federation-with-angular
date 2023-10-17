export class GreetEvent {
  constructor(
    public readonly greet: string,
    public readonly time: Date,
  ) { }

  public static fromGreetCustomEvent(event: Event): GreetEvent {
    const greetEventData = (event as CustomEvent<{ greet: string; time: Date }>).detail;
    return new GreetEvent(
      greetEventData.greet,
      greetEventData.time
    );
  }
}


