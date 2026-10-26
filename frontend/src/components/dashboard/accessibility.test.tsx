import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "@/App";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { IncomeOutcomeChart } from "@/components/dashboard/income-outcome-chart";
import { ProfitPercentChart } from "@/components/dashboard/profit-percent-chart";
import type { MonthlyDataPoint } from "@/lib/financial-types";

// ResponsiveContainer and LineChart need real layout measurement that jsdom
// cannot provide, so recharts renders nothing in tests. We stub them to spread
// props so the test asserts that OUR source forwards role/aria-label.
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div>{children}</div>
    ),
    LineChart: (props: {
      role?: string;
      "aria-label"?: string;
    }) => <div data-testid="line-chart" role={props.role} aria-label={props["aria-label"]} />,
  };
});

const sampleData: MonthlyDataPoint[] = [
  { month: "Jan", income: 1000, outcome: 250, profitPercent: 75 },
];

describe("accessibility", () => {
  it("renders skeletons as decorative (hidden from the accessibility tree)", () => {
    const { container } = render(<Skeleton className="h-8 w-36" />);
    const skeleton = container.querySelector('[data-slot="skeleton"]');
    expect(skeleton).toHaveAttribute("aria-hidden", "true");
  });

  it("card titles are real headings for a proper document outline", () => {
    render(
      <Card>
        <CardTitle>Income vs. Outcome</CardTitle>
        <CardContent>Body</CardContent>
      </Card>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Income vs. Outcome",
    );
  });

  it("income chart is exposed as an accessible image with a descriptive label", () => {
    render(<IncomeOutcomeChart data={sampleData} />);
    const chart = screen.getByRole("img", {
      name: "Income vs Outcome line chart showing monthly revenue and expenditure",
    });
    expect(chart).toBeInTheDocument();
  });

  it("profit chart is exposed as an accessible image with a descriptive label", () => {
    render(<ProfitPercentChart data={sampleData} />);
    const chart = screen.getByRole("img", {
      name: "Profit margin percentage line chart by month",
    });
    expect(chart).toBeInTheDocument();
  });

  it("announces async loading state via a polite live region", () => {
    render(<App />);
    const liveRegion = screen.getByRole("status");
    expect(liveRegion).toHaveAttribute("aria-live", "polite");
    expect(liveRegion).toHaveTextContent("Loading financial dashboard data");
  });

  it("surfaces fetch errors with role=alert so screen readers announce them", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new Error("network"));
    render(<App />);
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/No se pudo cargar la informacion/i);
  });
});