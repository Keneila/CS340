import { AuthToken, User } from "tweeter-shared";
import { Buffer } from "buffer";
import { UserSignInPresenter, UserSignInView } from "./UserSignInPresenter";
export interface RegisterView extends UserSignInView {
  setImageUrl: (url: string) => void;
  setImageBytes: (bytes: Uint8Array) => void;
  setImageFileExtension: (extension: string) => void;
}

export class RegisterPresenter extends UserSignInPresenter<RegisterView> {
  public checkSubmitButtonStatus(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageUrl?: string,
    imageFileExtension?: string,
  ): boolean {
    return (
      !firstName ||
      !lastName ||
      !alias ||
      !password ||
      !imageUrl ||
      !imageFileExtension
    );
  }

  protected signInDescription(): string {
    return "register user";
  }
  protected async signIn(
    alias: string,
    password: string,
    firstName?: string,
    lastName?: string,
    imageBytes?: Uint8Array,
    imageFileExtension?: string,
  ): Promise<[User, AuthToken]> {
    return await this.userService.register(
      firstName!,
      lastName!,
      alias,
      password,
      imageBytes!,
      imageFileExtension!,
    );
  }

  public handleImageFile(file: File | undefined): void {
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
          "base64",
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
  }

  public getFileExtension(file: File): string | undefined {
    return file.name.split(".").pop();
  }
}
