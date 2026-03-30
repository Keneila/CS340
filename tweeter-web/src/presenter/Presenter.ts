export interface View {
  displayErrorMessage: (message: string) => void;
}

export interface MessageView extends View {
  displayInfoMessage: (message: string, duration: number) => string;
  deleteMessage: (messageId: string) => void;
}
export abstract class Presenter<V extends View> {
  private _view: V;
  constructor(view: V) {
    this._view = view;
  }
  protected get view() {
    return this._view;
  }

  public async doFailureReportingOperation(
    operation: (userToast: string) => Promise<[userToast: string]>,
    operationDescription: string,
    finallyOperation?: (userToast: string) => void,
  ) {
    var userToast = "";
    try {
      const theToast = await operation("");
      userToast = theToast[0];
    } catch (error) {
      this.view.displayErrorMessage(
        `Failed to ${operationDescription} because of exception: ${error}`,
      );
    } finally {
      if (finallyOperation) {
        finallyOperation(userToast);
      }
    }
  }
}
