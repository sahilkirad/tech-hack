import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import { ReactSortable } from "react-sortablejs";

export default function BlogForm({
  _id,
  title: existingTitle,
  content: existingContent,
  tags: existingTags,
  images: existingImages,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [content, setContent] = useState(existingContent || "");
  const [tags, setTags] = useState(existingTags || []);
  const [images, setImages] = useState(existingImages || []);
  const [isUploading, setIsUploading] = useState(false);
  const [goToBlogs, setGoToBlogs] = useState(false);
  const router = useRouter();

  async function saveBlog(ev) {
    ev.preventDefault();
    const data = {
      title,
      content,
      tags,
      images,
    };
    if (_id) {
      // Update blog
      await axios.put("/api/blog", { ...data, _id });
    } else {
      // Create blog
      await axios.post("/api/blog", data);
    }
    setGoToBlogs(true);
  }

  if (goToBlogs) {
    router.push("/blog");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    if (files?.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);

      // Check response format
      if (Array.isArray(res.data.links)) {
        setImages((oldImages) => [...oldImages, ...res.data.links]);
      } else {
        console.error("Unexpected response format:", res.data);
      }

      setIsUploading(false);
    }
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function handleTagInput(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      const newTag = event.target.value.trim();
      if (newTag && !tags.includes(newTag)) {
        setTags((prevTags) => [...prevTags, newTag]);
        event.target.value = ""; // Clear input
      }
    }
  }

  function removeTag(tagToRemove) {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  }

  return (
    <form onSubmit={saveBlog}>
      <label>Blog Title</label>
      <input
        type="text"
        placeholder="Enter blog title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />

      <label>Content</label>
      <textarea
        placeholder="Write your blog content here"
        value={content}
        onChange={(ev) => setContent(ev.target.value)}
      />

      <label>Tags</label>
      <div className="tags-input">
        <input
          type="text"
          placeholder="Press Enter to add a tag"
          onKeyDown={handleTagInput}
        />
        <div className="tags-list">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <button
                type="button"
                className="remove-tag"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      <label>Images</label>
      <div className="mb-2 flex flex-wrap gap-1">
        <ReactSortable
          list={images}
          className="flex flex-wrap gap-1"
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                key={link}
                className="h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200"
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>
        {isUploading && (
          <div className="h-24 flex items-center">
            <Spinner />
          </div>
        )}
        <label className="w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <div>Add image</div>
          <input type="file" onChange={uploadImages} className="hidden" />
        </label>
      </div>

      <button type="submit" className="btn-primary">
        Save
      </button>
    </form>
  );
}
