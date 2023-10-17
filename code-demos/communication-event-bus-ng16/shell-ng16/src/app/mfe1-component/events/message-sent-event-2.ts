export class MessageSentEvent2 {
  constructor(public readonly message: string) { }

  public static fromMessageSentCustomEvent(event: Event): MessageSentEvent2 {
    const messageSent = (event as CustomEvent<string>).detail;
    return new MessageSentEvent2(messageSent);
  }
}
