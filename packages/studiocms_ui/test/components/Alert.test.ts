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

  test.for([
    { variant: "default" },
    { variant: "success" },
    { variant: "danger" },
    { variant: "info" },
    { variant: "warning" },
    { variant: "mono" },
  ])("renders Alert with variant", async (props, { renderComponent }) => {
    const result = await renderComponent(Alert, "Alert", {
      props: { title: "Test Alert", ...props },
      slots: { default: "Test alert content" },
    });
    expect(result).toMatchSnapshot();
  });

  test("renders Alert with default variant when not specified", async ({ renderComponent }) => {
    const result = await renderComponent(Alert, "Alert", {
      props: { title: "Test Alert" },
      slots: { default: "Test alert content" },
    });
    expect(result).toContain('data-variant="default"');
  });

  test("renders Alert with custom title", async ({ renderComponent }) => {
    const customTitle = "Important Notification";
    const result = await renderComponent(Alert, "Alert", {
      props: { title: customTitle },
      slots: { default: "Test alert content" },
    });
    expect(result).toContain(customTitle);
  });

  test("renders Alert with content slot", async ({ renderComponent }) => {
    const contentText = "This is the alert message content";
    const result = await renderComponent(Alert, "Alert", {
      props: { title: "Test Alert" },
      slots: { default: contentText },
    });
    expect(result).toContain(contentText);
  });

  test("includes correct icon based on variant", async ({ renderComponent }) => {
    const variants = [
      { variant: "default", icon: "heroicons:information-circle" },
      { variant: "success", icon: "heroicons:check-circle" },
      { variant: "danger", icon: "heroicons:exclamation-circle" },
      { variant: "info", icon: "heroicons:information-circle" },
      { variant: "warning", icon: "heroicons:exclamation-triangle" },
      { variant: "mono", icon: "heroicons:information-circle" },
    ];

    for (const { variant, icon } of variants) {
      const result = await renderComponent(Alert, "Alert", {
        props: { title: "Test Alert", variant: variant as any },
        slots: { default: "Test content" },
      });
      expect(result).toContain("sui-alert-icon");
    }
  });

  test("has proper CSS classes", async ({ renderComponent }) => {
    const result = await renderComponent(Alert, "Alert", {
      props: { title: "Test Alert" },
      slots: { default: "Test content" },
    });
    expect(result).toContain("sui-alert");
    expect(result).toContain("sui-alert-header");
    expect(result).toContain("sui-alert-icon");
    expect(result).toContain("sui-alert-title");
    expect(result).toContain("sui-alert-content");
  });
});
