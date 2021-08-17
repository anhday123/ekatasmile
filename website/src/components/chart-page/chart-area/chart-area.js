import Chart from "react-google-charts";
export default function ChartPage() {
  return (
    <Chart
      width={"500px"}
      height={"300px"}
      chartType="AreaChart"
      loader={<div>Loading Chart</div>}
      data={[
        ["Year", "Sales", "Expenses"],
        ["2013", 1000, 400],
        ["2014", 1170, 460],
        ["2015", 660, 1120],
        ["2016", 1030, 540],
      ]}
      options={{
        title: "Company Performance",
        hAxis: { title: "Year", titleTextStyle: { color: "#333" } },
        vAxis: { minValue: 0 },
        // For the legend to fit, we make the chart area smaller
        chartArea: { width: "50%", height: "70%" },
        // lineWidth: 25
      }}
      // For tests
      rootProps={{ "data-testid": "1" }}
    />
  );
}
