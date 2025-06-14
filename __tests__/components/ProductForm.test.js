import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductForm from "@/components/ProductForm";
import axios from "axios";

// Mock axios
jest.mock("axios");

// Mock next/router
jest.mock("next/router", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe("ProductForm", () => {
  const mockProduct = {
    _id: "123",
    title: "Test Product",
    description: "Test Description",
    price: "99.99",
    images: ["image1.jpg", "image2.jpg"],
    properties: {
      color: "red",
      size: "medium",
    },
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it("renders form with existing product data", () => {
    render(<ProductForm {...mockProduct} />);

    expect(screen.getByPlaceholderText("product name")).toHaveValue(
      mockProduct.title
    );
    expect(screen.getByPlaceholderText("description")).toHaveValue(
      mockProduct.description
    );
    expect(screen.getByPlaceholderText("price")).toHaveValue(mockProduct.price);
  });

  it("renders empty form when no product data provided", () => {
    render(<ProductForm />);

    expect(screen.getByPlaceholderText("product name")).toHaveValue("");
    expect(screen.getByPlaceholderText("description")).toHaveValue("");
    expect(screen.getByPlaceholderText("price")).toHaveValue("");
  });

  it("updates form fields when user types", async () => {
    render(<ProductForm />);

    const titleInput = screen.getByPlaceholderText("product name");
    const descriptionInput = screen.getByPlaceholderText("description");
    const priceInput = screen.getByPlaceholderText("price");

    await userEvent.type(titleInput, "New Product");
    await userEvent.type(descriptionInput, "New Description");
    await userEvent.type(priceInput, "149.99");

    expect(titleInput).toHaveValue("New Product");
    expect(descriptionInput).toHaveValue("New Description");
    expect(priceInput).toHaveValue("149.99");
  });

  it("submits form with correct data", async () => {
    axios.post.mockResolvedValueOnce({ data: {} });

    render(<ProductForm />);

    const titleInput = screen.getByPlaceholderText("product name");
    const descriptionInput = screen.getByPlaceholderText("description");
    const priceInput = screen.getByPlaceholderText("price");
    const submitButton = screen.getByText("Save");

    await userEvent.type(titleInput, "New Product");
    await userEvent.type(descriptionInput, "New Description");
    await userEvent.type(priceInput, "149.99");

    await userEvent.click(submitButton);

    expect(axios.post).toHaveBeenCalledWith("/api/products", {
      title: "New Product",
      description: "New Description",
      price: "149.99",
      images: [],
      properties: {},
    });
  });

  it("handles image upload", async () => {
    const mockFile = new File(["test"], "test.png", { type: "image/png" });
    axios.post.mockResolvedValueOnce({
      data: {
        links: ["uploaded-image.jpg"],
      },
    });

    render(<ProductForm />);

    const fileInput = screen.getByLabelText(/Add image/i);

    await userEvent.upload(fileInput, mockFile);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalled();
    });
  });
});
