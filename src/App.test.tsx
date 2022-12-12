import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import App from "./App";

test("loads to application", async () => {
  render(<App />);

  await userEvent.click(screen.getByRole("button"));

  expect(screen.getByText("IoT Application")).toBeInTheDocument();
});
