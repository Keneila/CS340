import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { View, Presenter } from "./Presenter";
import { Service } from "../model.service/Service";
export const PAGE_SIZE = 10;
export interface PagedItemView<T> extends View {
  addItems: (newItems: T[]) => void;
}

export abstract class PagedItemPresenter<
  T,
  U extends Service,
> extends Presenter<PagedItemView<T>> {
  private userService: UserService = new UserService();
  private _hasMoreItems = true;
  private _lastItem: T | null = null;
  private _service: U;
  constructor(view: PagedItemView<T>) {
    super(view);
    this._service = this.serviceFactory();
  }
  protected abstract serviceFactory(): U;

  public get service() {
    return this._service;
  }
  public get hasMoreItems() {
    return this._hasMoreItems;
  }
  protected get lastItem() {
    return this._lastItem;
  }
  protected set hasMoreItems(value: boolean) {
    this._hasMoreItems = value;
  }
  protected set lastItem(value: T | null) {
    this._lastItem = value;
  }

  reset() {
    this._hasMoreItems = true;
    this._lastItem = null;
    throw new Error("Method not implemented.");
  }

  public async getUser(
    authToken: AuthToken,
    alias: string,
  ): Promise<User | null> {
    return await this.userService.getUser(authToken, alias);
  }

  protected abstract itemDescription(): string;
  protected abstract getMoreItems(
    authToken: AuthToken,
    userAlias: string,
  ): Promise<[T[], boolean]>;

  public async loadMoreItems(authToken: AuthToken, userAlias: string) {
    await this.doFailureReportingOperation(async () => {
      const [newItems, hasMore] = await this.getMoreItems(authToken, userAlias);

      this.hasMoreItems = hasMore;
      this.lastItem =
        newItems.length > 0 ? newItems[newItems.length - 1] : null;
      this.view.addItems(newItems);
      return [""];
    }, this.itemDescription());
  }
}
