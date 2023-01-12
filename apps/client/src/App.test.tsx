import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

const user = userEvent.setup();

test("loads the application", async () => {
  render(<App />);

  const text = "hello world";

  expect(screen.queryByDisplayValue(text)).toBeNull();

  await user.click(screen.getByRole("textbox"));
  await user.keyboard(text);
  await user.click(screen.getByRole("button"));

  expect(screen.getByText("IoT Application")).toBeInTheDocument();
  expect(screen.getByDisplayValue(text)).toBeInTheDocument();
});
