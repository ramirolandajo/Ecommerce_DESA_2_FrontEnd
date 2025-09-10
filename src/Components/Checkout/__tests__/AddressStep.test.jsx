import React from "react";
import { describe, it, expect, vi } from "vitest";
import { act } from "react";

globalThis.IS_REACT_ACT_ENVIRONMENT = true;
import { createRoot } from "react-dom/client";
import AddressStep from "../AddressStep.jsx";

vi.mock("../../../api/address.js", () => ({
  getAddresses: vi.fn(),
  addAddress: vi.fn(),
  updateAddress: vi.fn(),
  deleteAddress: vi.fn(),
}));

import {
  getAddresses,
  addAddress,
  deleteAddress,
} from "../../../api/address.js";

function render(ui) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  act(() => {
    root.render(ui);
  });
  return { container, root };
}

describe("AddressStep", () => {
  it("selects, adds and removes addresses", async () => {
    const initial = [
      {
        id: "home",
        tag: "HOME",
        description: [
          "2118 Thornridge Cir, Syracuse, Connecticut 35624",
          "(209) 555-0104",
        ],
      },
      {
        id: "office",
        tag: "OFFICE",
        description: "2715 Ash Dr. San Jose, South Dakota 83475",
      },
    ];
    getAddresses.mockResolvedValue(initial);
    addAddress.mockImplementation(async (addr) => ({ id: "new", ...addr }));
    deleteAddress.mockResolvedValue({});

    function Wrapper() {
      const [address, setAddress] = React.useState("");
      return <AddressStep address={address} setAddress={setAddress} />;
    }

    const { container } = render(<Wrapper />);
    await act(async () => {});

    const getButtonByText = (text) =>
      Array.from(container.querySelectorAll("button")).find((b) =>
        b.textContent.includes(text)
      );

    const radios = container.querySelectorAll('input[name="address"]');
    act(() => {
      radios[0].click();
    });
    expect(radios[0].checked).toBe(true);

    const addBtn = getButtonByText("Agregar Nueva Dirección");
    await act(async () => {
      addBtn.click();
    });

    const provincia = container.querySelector('select[name="provincia"]');
    const ciudad = container.querySelector('input[name="ciudad"]');
    const cp = container.querySelector('input[name="cp"]');
    const calle = container.querySelector('input[name="calle"]');
    const numero = container.querySelector('input[name="numero"]');

    await act(async () => {
      provincia.value = "Buenos Aires";
      provincia.dispatchEvent(new Event("change", { bubbles: true }));
      ciudad.value = "Ciudad";
      ciudad.dispatchEvent(new Event("input", { bubbles: true }));
      cp.value = "1234";
      cp.dispatchEvent(new Event("input", { bubbles: true }));
      calle.value = "Calle";
      calle.dispatchEvent(new Event("input", { bubbles: true }));
      numero.value = "123";
      numero.dispatchEvent(new Event("input", { bubbles: true }));
    });

    const saveBtn = getButtonByText("Guardar dirección");
    await act(async () => {
      saveBtn.click();
    });
    await act(async () => {});

    expect(addAddress).toHaveBeenCalledTimes(1);
    const calledWith = addAddress.mock.calls[0][0];
    expect(typeof calledWith.description).toBe("string");

    const radiosAfter = container.querySelectorAll('input[name="address"]');
    expect(radiosAfter.length).toBe(initial.length + 1);
    expect(radiosAfter[radiosAfter.length - 1].checked).toBe(true);

    const labelsAfter = container.querySelectorAll("label");
    const newLabel = labelsAfter[labelsAfter.length - 1];
    const removeBtn = newLabel.querySelector('button[title="Eliminar"]');
    await act(async () => {
      removeBtn.click();
    });

    const radiosFinal = container.querySelectorAll('input[name="address"]');
    expect(radiosFinal.length).toBe(initial.length);
  });
});

