import { render, screen } from "@testing-library/react";
import CrosshairLoading from "@/app/components/shared/crosshair-loading";

describe("CrosshairLoading Component", () => {
  it("renders loading spinner and text", () => {
    render(<CrosshairLoading />);

    // Check if loading text is present
    expect(screen.getByText("Loading crosshairs...")).toBeInTheDocument();

    // Check if the component has the correct container classes
    const container = screen.getByText("Loading crosshairs...").closest("div");
    expect(container).toHaveClass("text-center");
  });

  it("displays animated spinner", () => {
    const { container } = render(<CrosshairLoading />);

    // Check if spinner div exists with animation class
    const spinner = container.querySelector(".animate-spin");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("border-4", "border-accent", "rounded-full");
  });

  it("has proper accessibility structure", () => {
    render(<CrosshairLoading />);

    // The loading text should be visible to screen readers
    const loadingText = screen.getByText("Loading crosshairs...");
    expect(loadingText).toBeVisible();
  });
});
