import React from "react";
import { Box } from "@chakra-ui/react";
import MiniCalendar from "./Calendar";

export default function Dashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", margin: "20px" }}>
      {/* Row 1 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
        <BoxCard title="Small Card 1" height="80px" />
        <BoxCard title="Small Card 2" height="80px" />
        <BoxCard title="Small Card 3" height="80px" />
        <BoxCard title="Small Card 4" height="80px" />
        <BoxCard title="Small Card 5" height="80px" />
        <BoxCard title="Small Card 6" height="80px" />
      </div>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "20px" }}>
        <BoxCard title="Medium Card 1" height="400px" />
        <BoxCard title="Medium Card 2" height="400px" />
      </div>

      {/* Row 3 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
        <BoxCard title="Large Card 1" height="400px" />
        <BoxCard title="Small Card 7" height="400px" />
        <BoxCard title="Small Card 8" height="400px" />
      </div>
      
      {/* Row 4 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "20px" }}>
        <BoxCard title="Large Card 1" height="400px" />
        <BoxCard title={<MiniCalendar />} height="400px" />
        <BoxCard title={<MiniCalendar />} height="400px" />
      </div>
    </div>
  );
}

const BoxCard = ({ title, height }) => (
  <div
    style={{
      backgroundColor: "white",
      padding: "15px",
      borderRadius: "15px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      width: "100%", 
      height: height,
    }}
  >
    {title}
  </div>
);
