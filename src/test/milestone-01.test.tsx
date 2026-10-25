/**
 * Milestone 1 — Props, State, and the useState Hook
 *
 * These tests verify the Session 2 learning objectives:
 *   1. Components render data received via props
 *   2. useState produces visible UI changes (favourite toggle)
 *   3. Controlled inputs delegate state ownership to the parent
 *   4. App composes components and filters the movie list reactively
 *
 * Run locally: npm run test:run
 * Run with detail: npm run test:run:verbose
 *
 * NOTE: If an import below fails, the file does not exist yet.
 * Create the missing component and re-run the tests.
 *
 * SESSION BOUNDARY: These tests are graded after Session 2.
 * After Session 5, MovieCard reads from AppContext and the MovieCard isolation
 * tests below will fail when run together with the other milestones.
 * Use `npm run test:m1` to run this file in isolation.
 */

import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";

// These imports will produce clear errors if the files are missing —
// that error message tells you exactly which component to create next.
import App from "../App";
import type { Movie } from "../types";

// ── App — integration ─────────────────────────────────────────────────────────

describe("App — integration (search and filter)", () => {
  it("renders a top-level heading", () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("renders a search input", () => {
    render(<App />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders at least one movie card on initial load", () => {
    render(<App />);
    const movieTitles = screen.getAllByRole("heading", { level: 2 });
    expect(movieTitles.length).toBeGreaterThanOrEqual(1);
  });

  it('shows "Avatar: The Way of Water" from the sample data', () => {
    render(<App />);
    expect(screen.getByText(/Avatar: The Way of Water/i)).toBeInTheDocument();
  });

  it('shows "John Wick: Chapter 4" from the sample data', () => {
    render(<App />);
    expect(screen.getByText(/John Wick/i)).toBeInTheDocument();
  });

  it("reduces the visible movie count when a search query is entered", () => {
    render(<App />);
    const totalBefore = screen.getAllByRole("heading", { level: 2 }).length;

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Avatar" },
    });

    const totalAfter = screen.getAllByRole("heading", { level: 2 }).length;
    expect(totalAfter).toBeLessThan(totalBefore);
  });

  it("only shows movies matching the search query", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "John Wick" },
    });
    expect(screen.getByText(/John Wick/i)).toBeInTheDocument();
    expect(screen.queryByText(/Ant-Man/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Avatar/i)).not.toBeInTheDocument();
  });

  it("search is case-insensitive", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "AVATAR" },
    });
    expect(screen.getByText(/Avatar: The Way of Water/i)).toBeInTheDocument();
  });

  it("restores all movies when the search query is cleared", () => {
    render(<App />);
    const initialCount = screen.getAllByRole("heading", { level: 2 }).length;

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Avatar" },
    });
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });

    const restoredCount = screen.getAllByRole("heading", { level: 2 }).length;
    expect(restoredCount).toBe(initialCount);
  });

  it("shows the empty state when no movies match the query", () => {
    render(<App />);
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "xyzxyz_no_possible_match" },
    });
    expect(screen.queryAllByRole("heading", { level: 2 })).toHaveLength(0);
    expect(screen.getByText(/no movies/i)).toBeInTheDocument();
  });
});
