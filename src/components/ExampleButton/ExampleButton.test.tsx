import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExampleButton from "./ExampleButton";

describe("MyButtonComponent", () => {
  test("renders a button and responds to click events", async () => {
    render(<ExampleButton />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();

    await userEvent.click(button);
    expect(button).toHaveTextContent(/clicked/i);
  });
});
