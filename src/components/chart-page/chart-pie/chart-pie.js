import Chart from "react-google-charts";
export default function ChartPage() {
  return (
    <Chart
      width={"45rem"}
      height={"25rem"}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={[
        ["Task", "Hours per Day"],
        ["Khách lẻ", 55],
        ["Khách quen", 15],
        ["Khách thân thiết", 15],
        ["Khách hàng tiềm năng", 15],
      ]}
      options={{
        // title: "My Daily Activities",
        is3D: true,
      }}
      rootProps={{ "data-testid": "1" }}
    />
  );
}
