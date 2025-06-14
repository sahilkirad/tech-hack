import { render } from "@testing-library/react";
import Spinner from "@/components/Spinner";

describe("Spinner", () => {
  it("renders without crashing", () => {
    const { container } = render(<Spinner />);
    expect(container).toBeTruthy();
  });

  it("renders with correct class name", () => {
    const { container } = render(<Spinner />);
    const spinnerElement = container.firstChild;
    expect(spinnerElement).toHaveClass("spinner");
  });
});
