// AI-assisted: see AI-ATTRIBUTION.md
import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { ImageDAO } from "../ImageDAO";

const BUCKET = "cs-340-krh-images";
// Lambda sets AWS_REGION automatically; the fallback matches samconfig.toml.
const REGION = process.env.AWS_REGION ?? "us-east-2";
// All profile images are stored under this folder in the bucket.
const IMAGE_FOLDER = "image/";

// One S3 client per Lambda container, reused across warm invocations.
const s3Client = new S3Client({ region: REGION });

// Stores profile images in S3 as public objects.
export class S3ImageDAO implements ImageDAO {
  public async putImage(
    fileName: string,
    imageStringBase64Encoded: string,
  ): Promise<string> {
    const key = IMAGE_FOLDER + fileName;

    try {
      await s3Client.send(
        new PutObjectCommand({
          Bucket: BUCKET,
          Key: key,
          Body: Buffer.from(imageStringBase64Encoded, "base64"),
          ContentType: this.getContentType(fileName),
          // Public so the browser can load the image straight from its URL.
          // Needs the bucket's Block Public Access off and ACLs enabled.
          ACL: ObjectCannedACL.public_read,
        }),
      );
    } catch (error) {
      // Tagged so API Gateway returns a 500 with this message.
      throw new Error(
        `[internal-server-error] s3 put image failed with: ${(error as Error).message}`,
      );
    }

    return `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
  }

  // Picks the Content-Type from the file extension so browsers display the
  // image instead of downloading it. Falls back to image/png.
  private getContentType(fileName: string): string {
    const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
    switch (extension) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "gif":
        return "image/gif";
      case "webp":
        return "image/webp";
      case "svg":
        return "image/svg+xml";
      default:
        return "image/png";
    }
  }
}
