export class MessageSentEvent {
  constructor(public readonly message: string) { }

  public static fromMessageSentCustomEvent(event: Event): MessageSentEvent {
    const messageSent = (event as CustomEvent<string>).detail;
    return new MessageSentEvent(messageSent);
  }
}
