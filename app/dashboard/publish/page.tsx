"use client";

import { useState,} from "react";
import RichTextEditor from "../../../components/RichTextEditor";
import { Share2 } from "lucide-react";
import getReadMinutes from "../../../components/utils/funcs";
import { savePost } from "../../../lib/postService";
import { toast } from "react-toastify";
import TagMultiSelect from "../../../components/inputs/TagMultiSelect";
import BlogPreview from "../../../components/Preview";


export interface Post_inputable {
  heading: string;
  coverImage: File | null;
  content: string;
  date: string;
  tags:string[];
}



export default function AddPost() {

  const [cover_previewUrl, setcover_PreviewUrl] = useState<string | null>(null);
  const [post, setPost] = useState<Post_inputable>({
    heading: "",
    coverImage: null,
    content: `<h1>The Future of Remote Work</h1><p>Remote work is no longer a <strong>temporary trend</strong>. Companies like <a href="https://www.microsoft.com" rel="noopener noreferrer" target="_blank">Microsoft</a> and <a href="https://www.google.com" rel="noopener noreferrer" target="_blank">Google</a> have already embraced hybrid work models.</p><h2>Key Benefits</h2><ul><li>Increased flexibility</li><li>Access to global talent</li><li><em>Better work-life balance</em></li></ul><p>But challenges remain: <u>communication</u>, <s>team isolation</s>, and <strong>security risks</strong>.</p><blockquote>“The best way to predict the future is to create it.” – Peter Drucker</blockquote><p><br></p><h3><img src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&amp;fit=crop&amp;w=1200&amp;q=80">Tools for Success</h3><ol><li>Zoom &amp; Teams</li><li>Notion &amp; Confluence</li><li>Slack &amp; Discord</li></ol><pre class="ql-syntax" spellcheck="false">const remoteWork = true;
console.log('Work from anywhere:', remoteWork);
</pre>`,
date : new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
  tags:[]

  });

  const [showPreview, setShowPreview] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(1024); // default desktop width
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState("");




const handleSave = async () => {
    setLoading(true);

    if(post.coverImage == null) {
      toast.error("❌ Cover Image is required");
      return;
    }

    const result = await savePost({ ...post });

    if (result.success) {
      toast("✅ Post saved!");
      setSaved(post.heading)

    } else {

      // console.log(JSON.parse(result.error));
      if(result.error){
        // @ts-ignore
        toast.error("❌ Error: " + JSON.parse(result.error)[0].message);
      }else{
        toast.error("❌ Error Uploading Blog");
      }
    }

    setLoading(false);

  };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPost({ ...post,coverImage: file }); // store the File object
      setcover_PreviewUrl(URL.createObjectURL(file)); // preview only
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Page Header with Preview Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Publish Post</h1>
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
  saving post...do not close this tab.  </div>  : 
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save Post
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
                    <BlogPreview post={post} previewWidth={previewWidth} getReadMinutes={getReadMinutes}/>
        </div>
      )}
    </div>
  );
}
