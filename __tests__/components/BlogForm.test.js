import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogForm from "@/components/BlogForm";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("BlogForm", () => {
  const mockBlog = {
    _id: "123",
    title: "Test Blog",
    content: "Test Content",
    tags: ["test", "blog"],
    images: ["image1.jpg", "image2.jpg"],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form with existing blog data", () => {
    render(<BlogForm {...mockBlog} />);

    expect(screen.getByPlaceholderText("Enter blog title")).toHaveValue(
      mockBlog.title
    );
    expect(
      screen.getByPlaceholderText("Write your blog content here")
    ).toHaveValue(mockBlog.content);
    mockBlog.tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeInTheDocument();
    });
  });

  it("renders empty form when no blog data provided", () => {
    render(<BlogForm />);

    expect(screen.getByPlaceholderText("Enter blog title")).toHaveValue("");
    expect(
      screen.getByPlaceholderText("Write your blog content here")
    ).toHaveValue("");
    expect(
      screen.getByPlaceholderText("Press Enter to add a tag")
    ).toBeInTheDocument();
  });

  it("updates form fields when user types", async () => {
    render(<BlogForm />);

    const titleInput = screen.getByPlaceholderText("Enter blog title");
    const contentInput = screen.getByPlaceholderText(
      "Write your blog content here"
    );

    await userEvent.type(titleInput, "New Blog Title");
    await userEvent.type(contentInput, "New Blog Content");

    expect(titleInput).toHaveValue("New Blog Title");
    expect(contentInput).toHaveValue("New Blog Content");
  });

  it("adds and removes tags correctly", async () => {
    render(<BlogForm />);

    const tagInput = screen.getByPlaceholderText("Press Enter to add a tag");

    // Add a tag
    await userEvent.type(tagInput, "newtag");
    await userEvent.keyboard("{Enter}");

    expect(screen.getByText("newtag")).toBeInTheDocument();

    // Remove the tag
    const removeButton = screen.getByText("×");
    await userEvent.click(removeButton);

    expect(screen.queryByText("newtag")).not.toBeInTheDocument();
  });

  it("submits form with correct data", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<BlogForm />);

    const titleInput = screen.getByPlaceholderText("Enter blog title");
    const contentInput = screen.getByPlaceholderText(
      "Write your blog content here"
    );
    const submitButton = screen.getByText("Save");

    await userEvent.type(titleInput, "New Blog Title");
    await userEvent.type(contentInput, "New Blog Content");

    await userEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledWith("/api/blog", {
      title: "New Blog Title",
      content: "New Blog Content",
      tags: [],
      images: [],
    });
  });

  it("handles image upload", async () => {
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    axios.post.mockResolvedValueOnce({
      data: {
        links: ["uploaded-image.jpg"],
      },
    });

    render(<BlogForm />);

    const fileInput = screen.getByLabelText(/Add image/i);

    await userEvent.upload(fileInput, mockFile);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });

  it("updates existing blog when _id is provided", async () => {
    axios.put.mockResolvedValueOnce({ data: {} });

    render(<BlogForm {...mockBlog} />);

    const submitButton = screen.getByText("Save");
    await userEvent.click(submitButton);

    expect(axios.put).toHaveBeenCalledWith("/api/blog", {
      ...mockBlog,
      _id: mockBlog._id,
    });
  });
});
