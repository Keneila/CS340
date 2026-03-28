import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../model.service/UserService";
import { Buffer } from "buffer";
export interface RegisterView {
    setImageUrl: (url: string) => void;
    setImageBytes: (bytes: Uint8Array) => void;
    setImageFileExtension: (extension: string) => void;
    navigate: (url: string) => void;
    displayErrorMessage: (message: string) => void;
    setIsLoading: (isLoading: boolean) => void;
    updateUserInfo: (currentUser: User,
      displayedUser: User | null,
      authToken: AuthToken,
      remember: boolean)    => void;
}


export class RegisterPresenter {
    private view: RegisterView;
    private userService: UserService;
    constructor(view: RegisterView) {
        this.view = view;
        this.userService = new UserService();
    }

    public checkSubmitButtonStatus (firstName: string, lastName: string, alias: string, password: string, imageUrl: string, imageFileExtension: string): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  };

  public handleImageFile (file: File | undefined): void {
      if (file) {
        this.view.setImageUrl(URL.createObjectURL(file));
  
        const reader = new FileReader();
        reader.onload = (event: ProgressEvent<FileReader>) => {
          const imageStringBase64 = event.target?.result as string;
  
          // Remove unnecessary file metadata from the start of the string.
          const imageStringBase64BufferContents =
            imageStringBase64.split("base64,")[1];
  
          const bytes: Uint8Array = Buffer.from(
            imageStringBase64BufferContents,
            "base64"
          );
  
          this.view.setImageBytes(bytes);
        };
        reader.readAsDataURL(file);
  
        // Set image file extension (and move to a separate method)
        const fileExtension = this.getFileExtension(file);
        if (fileExtension) {
          this.view.setImageFileExtension(fileExtension);
        }
      } else {
        this.view.setImageUrl("");
        this.view.setImageBytes(new Uint8Array());
      }
    };

    public getFileExtension (file: File): string | undefined {
    return file.name.split(".").pop();
    };


    public async doRegister (firstName: string, lastName: string, alias: string, password: string, imageBytes: Uint8Array, imageFileExtension: string, rememberMe: boolean): Promise<void> {
    try {
      this.view.setIsLoading(true);

      const [user, authToken] = await this.register(
        firstName,
        lastName,
        alias,
        password,
        imageBytes,
        imageFileExtension
      );

      this.view.updateUserInfo(user, user, authToken, rememberMe);
      this.view.navigate(`/feed/${user.alias}`);
    } catch (error) {
      this.view.displayErrorMessage(`Failed to register user because of exception: ${error}`);
    } finally {
      this.view.setIsLoading(false);
    }
  };

  public async register(
        firstName: string,
        lastName: string,
        alias: string,
        password: string,
        userImageBytes: Uint8Array,
        imageFileExtension: string
      ): Promise<[User, AuthToken]> {
        // Not neded now, but will be needed when you make the request to the server in milestone 3
    
        return await this.userService.register(
          firstName,
          lastName,
          alias,
          password,
          userImageBytes,
          imageFileExtension
        );
      };
}
    