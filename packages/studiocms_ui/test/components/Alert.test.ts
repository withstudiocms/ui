import { describe, expect } from "vitest";
import Alert from "../../src/components/Alert/Alert.astro";
import { test } from "../fixtures/vitest/AstroContainer";

describe("Alert Component", () => {
  test("renders Alert component correctly", async ({ renderComponent }) => {
    const result = await renderComponent(Alert, "Alert", {
      props: { title: "Test Alert" },
      slots: { default: "Test alert content" },
    });
    expect(result).toMatchSnapshot();
  });

  test("renders Alert component with different variants", async ({ renderComponent }) => {
    const variants = ["default", "success", "danger", "info", "warning", "mono"];
    for (const variant of variants) {
      const result = await renderComponent(Alert, `Alert-${variant}`, {
        props: { title: `${variant} Alert`, variant },
        slots: { default: `This is a ${variant} alert message.` },
      });
      expect(result).toMatchSnapshot();
    }
  });

  test("renders Alert with custom title", async ({ renderComponent }) => {
    const titles = ["Important Notice", "Warning!", "Success Message"];
    for (const title of titles) {
      const result = await renderComponent(Alert, `Alert-title-${title.replace(/\s+/g, "-")}`, {
        props: { title },
        slots: { default: "Alert content" },
      });
      expect(result).toMatchSnapshot();
    }
  });

  test("renders Alert with content slot", async ({ renderComponent }) => {
    const result = await renderComponent(Alert, "Alert-with-content", {
      props: { title: "Alert Title" },
      slots: { default: "This is the alert message content with details." },
    });
    expect(result).toMatchSnapshot();
  });

  test("renders Alert with rich HTML content", async ({ renderComponent }) => {
    const richContent =
      "<p>Paragraph text</p><ul><li>Item 1</li><li>Item 2</li></ul><strong>Bold text</strong>";
    const result = await renderComponent(Alert, "Alert-rich-content", {
      props: { title: "Alert with Rich Content", variant: "info" },
      slots: { default: richContent },
    });
    expect(result).toMatchSnapshot();
  });

  test("renders Alert with correct data-variant attribute", async ({ renderComponent }) => {
    const variants = ["default", "success", "danger", "info", "warning", "mono"];
    for (const variant of variants) {
      const result = await renderComponent(Alert, `Alert-data-variant-${variant}`, {
        props: { title: "Test Alert", variant },
        slots: { default: "Test content" },
      });
      expect(result).toContain(`data-variant="${variant}"`);
    }
  });

  test("renders Alert with correct CSS classes", async ({ renderComponent }) => {
    const result = await renderComponent(Alert, "Alert-css-classes", {
      props: { title: "Test Alert" },
      slots: { default: "Test content" },
    });
    expect(result).toContain("sui-alert");
    expect(result).toContain("sui-alert-header");
    expect(result).toContain("sui-alert-icon");
    expect(result).toContain("sui-alert-title");
    expect(result).toContain("sui-alert-content");
  });

  test("renders Alert with default variant when not specified", async ({ renderComponent }) => {
    const result = await renderComponent(Alert, "Alert-default-variant", {
      props: { title: "Test Alert" },
      slots: { default: "Test content" },
    });
    expect(result).toContain('data-variant="default"');
  });
});
