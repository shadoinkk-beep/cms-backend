import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebaseconfig";
import { PostSchema, PostType } from "../schema/postSchema";
import { uploadImage } from "./uploadImage";
import { uploadEmbeddedImages } from "./uploadEmbeddedImages";
import { Post_inputable } from "../app/dashboard/publish/page";




export async function savePost(postData: Post_inputable) {
  try {

    const cover_url = await uploadImage(postData.coverImage as File);
    const uploaded_content =await uploadEmbeddedImages(postData.content)
    // ✅ Validate input with schema
    const post:PostType = {...postData,content:uploaded_content,coverImage:cover_url,}
    const parsed = PostSchema.parse(post);

    const docRef = await addDoc(collection(db, "posts"), {
      ...parsed,
      createdAt: serverTimestamp(), // override with Firestore timestamp

    });

    return { success: true, id: docRef.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }
}
