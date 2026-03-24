import { AuthToken, Status, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";

export interface StatusView {
    addItems: (newItems : Status[]) => void;
    displayErrorMessage: (message: string) => void;
}

export abstract class StatusPresenter {
    private _view: StatusView;
    private userService: UserService;
    private _hasMoreItems = true;
    private _lastItem: Status | null = null;
    protected constructor(view: StatusView) {
        this._view = view;
        this.userService = new UserService();
    }

    protected get view() {
        return this._view;
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
    protected set lastItem(value: Status | null) {
        this._lastItem = value;
    }
    reset() {
        this._hasMoreItems = true;
        this._lastItem = null;
        throw new Error("Method not implemented.");
    }
    
    public async getUser(
                authToken: AuthToken,
                alias: string
              ): Promise<User | null>{
                return this.userService.getUser(authToken, alias);
        };
    public abstract loadMoreItems(authToken: AuthToken, userAlias: string): void;
}