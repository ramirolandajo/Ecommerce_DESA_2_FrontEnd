import '@testing-library/jest-dom';
import { describe, it, expect } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import RequireAuth from "../RequireAuth.jsx";

const Private = () => <div>Private Content</div>;

function renderWithAuth(isLoggedIn) {
  const store = configureStore({
    reducer: { user: () => ({ isLoggedIn }) },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/private"]}>
        <Routes>
          <Route
            path="/private"
            element={
              <RequireAuth>
                <Private />
              </RequireAuth>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe("RequireAuth", () => {
  it("redirects to login when user is not logged in", async () => {
    renderWithAuth(false);
    await waitFor(() => {
      expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
  });

  it("renders children when user is logged in", () => {
    renderWithAuth(true);
    expect(screen.getByText("Private Content")).toBeInTheDocument();
  });
});
