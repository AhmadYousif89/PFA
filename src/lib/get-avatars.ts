import { join } from "path";
import { readdir } from "fs/promises";

export async function getAvatars(): Promise<string[]> {
  try {
    const avatarsPath = join(process.cwd(), "public", "assets", "images", "avatars");
    const files = await readdir(avatarsPath);

    // Filter for image files only
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp"];
    const avatars = files.filter((file) =>
      imageExtensions.some((ext) => file.toLowerCase().endsWith(ext)),
    );

    return avatars;
  } catch (error) {
    console.error("Error reading avatars directory:", error);
    return [];
  }
}
