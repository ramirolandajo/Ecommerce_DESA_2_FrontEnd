import React from "react";
import { describe, it, expect } from "vitest";
import { act } from "react-dom/test-utils";
import { createRoot } from "react-dom/client";
import ShippingStep from "../ShippingStep.jsx";

function render(ui) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  return { container, root };
}

describe("ShippingStep", () => {
  it("updates shipping selection", () => {
    function Wrapper() {
      const [shipping, setShipping] = React.useState("");
      return <ShippingStep shipping={shipping} setShipping={setShipping} />;
    }

    const { container } = render(<Wrapper />);

    const radios = container.querySelectorAll('input[name="shipping"]');

    act(() => {
      radios[1].click(); // express
    });
    expect(radios[1].checked).toBe(true);

    act(() => {
      radios[2].click(); // scheduled
    });
    expect(radios[2].checked).toBe(true);
  });
});

