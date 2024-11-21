import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ButtonClick from "@/components/element/ButtonClick";

import "@testing-library/jest-dom";

describe("ButtonClick Component", () => {
  it("renders the button with the given title", () => {
    render(<ButtonClick title="Submit" />);
    const button = screen.getByRole("button", { name: /submit/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("Submit");
  });

  it("does not display the title when loading is true", () => {
    render(<ButtonClick title="Submit" loading={true} />);
    const button = screen.getByRole("button");
    expect(button).not.toHaveTextContent("Submit");
  });

  it("is disabled when loading is true", () => {
    render(<ButtonClick title="Submit" loading={true} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("calls the onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<ButtonClick title="Submit" onClick={handleClick} />);
    const button = screen.getByRole("button", { name: /submit/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call the onClick handler when loading is true", () => {
    const handleClick = jest.fn();
    render(<ButtonClick title="Submit" loading={true} onClick={handleClick} />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
