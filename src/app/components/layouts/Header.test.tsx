import { render, screen } from "@testing-library/react";
import Header from "/Users/naoto/Library/Mobile Documents/com~apple~CloudDocs/Engineering/Application/TaskManager/frontend-ts-14/src/app/components/layouts/Header";
import "@testing-library/jest-dom";

describe("Headerコンポーネント", () => {
  test("クラッシュせずにレンダリングされる", () => {
    render(<Header />);
  });

  test("MdOutlineTaskAltアイコンがレンダリングされる", () => {
    render(<Header />);
    const icon = screen.getByTestId("icon");
    expect(icon).toBeInTheDocument();
  });

  test("タイトル「Task Manager」がレンダリングされる", () => {
    render(<Header />);
    const title = screen.getByText("Task Manager");
    expect(title).toBeInTheDocument();
  });

  test("正しいクラス名を持っている", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    expect(header).toHaveClass(
      "bg-blue-500 text-white py-4 px-5 md:px-20 font-bold"
    );
  });
});
