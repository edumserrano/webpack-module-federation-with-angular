export class GreetEvent2 {
  constructor(
    public readonly greet: string,
    public readonly time: Date,
  ) { }

  public static fromGreetCustomEvent(event: Event): GreetEvent2 {
    const greetEventData = (event as CustomEvent<{ greet: string; time: Date }>).detail;
    return new GreetEvent2(
      greetEventData.greet,
      greetEventData.time
    );
  }
}


