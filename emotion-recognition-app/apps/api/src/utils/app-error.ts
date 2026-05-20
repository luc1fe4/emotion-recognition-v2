export class AppError extends Error {
  public readonly statusCode: number;
  public readonly publicMessage: string;

  constructor(statusCode: number, publicMessage: string, internalMessage?: string) {
    super(internalMessage ?? publicMessage);
    this.statusCode = statusCode;
    this.publicMessage = publicMessage;
  }
}
