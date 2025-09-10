import React from "react";
import { describe, it, expect, vi } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PaymentStep from "../PaymentStep.jsx";

function renderPaymentStep() {
  const store = configureStore({
    reducer: { products: () => ({ items: [], status: "succeeded" }) },
  });
  const card = { number: "", name: "", expiry: "", cvv: "" };
  const setCard = vi.fn();
  return render(
    <Provider store={store}>
      <PaymentStep
        items={[]}
        address="home"
        shipping="regular"
        money={(n) => `$${n}`}
        card={card}
        setCard={setCard}
      />
    </Provider>
  );
}

describe("PaymentStep", () => {
  it("advances through card fields and validates", async () => {
    renderPaymentStep();
    const number = screen.getByPlaceholderText("•••• •••• •••• ••••");
    await userEvent.type(number, "4111 1111 1111 1111");

    const name = screen.getByPlaceholderText("NOMBRE APELLIDO");
    await userEvent.type(name, "JOHN DOE");

    const expiry = screen.getByPlaceholderText("MM/YY");
    await userEvent.type(expiry, "12/30");

    const cvv = screen.getByPlaceholderText("123");
    await userEvent.type(cvv, "123");

    // hidden input with value "ok" when card is valid
    const hiddenOk = await screen.findByDisplayValue("ok");
    expect(hiddenOk).toBeInTheDocument();
  });
});
