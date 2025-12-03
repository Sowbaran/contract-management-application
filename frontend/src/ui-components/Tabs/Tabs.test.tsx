import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "./Tabs";
import { TabProp } from "./types";
import "@testing-library/jest-dom";
import { describe, expect, it } from "vitest";

const tabList = [
  {
    id: "tab1",
    name: "Tab 1",
  },
  {
    id: "tab2",
    name: "Tab 2",
  },
];

let tabId = "";

function handleChange(item: TabProp) {
  tabId = item.id;
}

describe("<Tabs />", () => {
  it("switches content correctly when different tabs are clicked", async () => {
    render(
      <Tabs className="" tabList={tabList} onTabChange={handleChange}>
        {tabId === "tab1" && <div>Content1</div>}
        {tabId === "tab2" && <div>Content2</div>}
      </Tabs>,
    );

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.queryByText("Tab 2")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Tab 1"));
    expect(screen.queryByText("Content2")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Tab 2"));
    expect(screen.queryByText("Content1")).not.toBeInTheDocument();
  });
});
