"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import posts from "../../../../components/data/posts.json";
import RichTextEditor from "../../../../components/RichTextEditor";
import {  Share2, ThumbsUp } from "lucide-react";
import getReadMinutes, { getCurrentFormattedDate } from "../../../../components/utils/funcs";
import { fetchPostById } from "../../../../lib/fetchPostById";
import TagMultiSelect from "../../../../components/inputs/TagMultiSelect";
import { Post } from "../../../../schema/postSchema";
import { toast } from "react-toastify";
import { updatePost } from "../../../../lib/updatePost";

export default function EditPost() {
    const { id } = useParams();

  const [post, setPost] = useState<Post | null>(null);
  const [cover_previewUrl, setcover_PreviewUrl] = useState<string | null>(null);

  const [showPreview, setShowPreview] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(1024); // default desktop width
  const [saved, setSaved] = useState("");
const [loading, setLoading] = useState(false);


useEffect(() => {
  if (!id) return;
  
  const loadPost = async () => {
    try {
      const data = await fetchPostById(id as string);
      if (data) {
        setPost(data as Post);
        setcover_PreviewUrl(data.coverImage);
      }
    } catch (err) {
      console.error("Failed to fetch post:", err);
    }
  };

  loadPost();
}, [id]);


  const handleSave = async () => {
    setLoading(true);

    if(post && post.coverImage == null && cover_previewUrl  == null) {
      toast.error("❌ Cover Image is required");
      return;
    }

    if(post){


    const result = await updatePost(id as string,{ ...post });
    
    if (result.success) {
      toast("✅ Post saved!");
      setSaved(post.heading)
    } else {
      
      // console.log(JSON.parse(result.error));
      if (result.error) {
        toast.error("❌ Error: " + result.error);
      } else {
        toast.error("❌ Error updating post");
      }
      setLoading(false);
          }

        }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // @ts-ignore
      setPost({ ...post,coverImage: file }); // store the File object
      setcover_PreviewUrl(URL.createObjectURL(file)); // preview only
    }
  };

  if(post == null) return <span> Loading </span>  
    
    
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Page Header with Preview Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Edit Post</h1>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800"
        >
          {showPreview ? "Back to Edit" : "Preview"}
        </button>
      </div>

      {!showPreview ? (
        <>
          {/* Heading */}
          <div>
            <label className="block text-sm font-medium mb-1">Heading</label>
            <input
              type="text"
              value={post.heading}
              onChange={(e) => setPost({ ...post, heading: e.target.value })}
              className="w-full border p-2 rounded"
            />
          </div>

          {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium mb-1">Tags</label>
                      <TagMultiSelect value={post.tags} onChange={(t) => setPost({ ...post, tags: t }) } />
                    </div>

{/* Cover Image */}
          <div>
      <label className="block text-sm font-medium mb-1">Cover Image</label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border p-2 rounded"
      />

      {cover_previewUrl && (
        <img
          src={cover_previewUrl}
          alt="Cover preview"
          className="w-full mt-2 rounded shadow"
        />
      )}


    </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <RichTextEditor
              value={post.content}
              onChange={(val) => setPost({ ...post, content: val })}
            />
          </div>

          {/* Save Button */}
{
            saved != "" ?  <a href={saved}> {saved} </a> :
          

            <div>
          {loading ? <div className="flex items-center gap-6"> <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
  updating post...do not close this tab.  </div>  : 
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Update Post
            </button>}
          </div>
          }
        </>
      ) : (
        /* Preview Mode */
        <div className="space-y-4">
          {/* Width Controller */}
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Preview Width:</label>
            <input
              type="range"
              min="320"
              max="1400"
              step="10"
              value={previewWidth}
              onChange={(e) => setPreviewWidth(Number(e.target.value))}
              className="w-64"
            />
            <span className="text-sm">{previewWidth}px</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewWidth(375)}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              >
                Mobile
              </button>
              <button
                onClick={() => setPreviewWidth(768)}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              >
                Tablet
              </button>
              <button
                onClick={() => setPreviewWidth(1024)}
                className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
              >
                Desktop
              </button>
            </div>
          </div>

          {/* Preview Frame */}
          <div
            className="mx-auto border rounded shadow bg-white p-4"
            style={{ width: `${previewWidth}px` }}
          >
            <h2 className="text-3xl font-bold">{post.heading}</h2>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt="cover preview"
                className="w-full rounded shadow my-4"
              />
            )}
            <div className="border-t border-b border-gray-200 py-2 flex justify-between" >

              <div className="text-sm flex gap-4 items-center">
                <div className="flex items-center gap-0 cursor-pointer">
                  <span className="text-xl">
                👍 
                  </span>
                <span className="text-sm">100</span>
                </div>
                <Share2 className="cursor-pointer"/>
              </div>
              <div className="text-sm flex gap-4">
                <span>{getReadMinutes(post.content)} min read</span>
                <span> {getCurrentFormattedDate()} </span>
              </div>
            </div>
            <div
              className="prose max-w-none leading-relaxed [&_p]:my-2 [&_h1]:my-3 [&_h2]:my-2 [&_ul]:my-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
                      {/* bottom interaction */}
                      <div className="border-t border-b border-gray-200 py-2 flex justify-between mt-6" >

              <div className="text-sm flex gap-4 items-center">
                <div className="flex items-center gap-0 cursor-pointer">
                  <span className="text-xl">
                👍 
                  </span>
                <span className="text-sm">100</span>
                </div>
                <Share2 className="cursor-pointer"/>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
