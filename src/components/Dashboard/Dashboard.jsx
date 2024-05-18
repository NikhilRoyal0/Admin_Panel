import React from "react";
import MiniCalendar from "./Items/Calendar";
import BarChart from "./Items/Medium/Chart";
import Small1 from "./Items/Small/Small1";
import Small2 from "./Items/Small/Small2";
import Small3 from "./Items/Small/Small3";
import Small4 from "./Items/Small/Small4";
import Small5 from "./Items/Small/Small5";
import Small6 from "./Items/Small/Small6";
import CheckList from "./Items/Medium/CheckList";
import Large1 from "./Items/Large/Large1";
import Large2 from "./Items/Large/Large2";
import Large3 from "./Items/Large/Large3";
import Large4 from "./Items/Large/Large4";

export default function Dashboard() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px", margin: "20px" }}>
      {/* Row 1 */}
      <GridContainer>
        <BoxCard title={<Small1 totalBranches={23} />} height="80px" />
        <BoxCard title={<Small2 totalStudents={890} />} height="80px" />
        <BoxCard title={<Small3 totalCourses={19} />} height="80px" />
        <BoxCard title={<Small4 totalCertificates={9194} />} height="80px" />
        <BoxCard title={<Small5 totalStudents={80} />} height="80px" />
        <BoxCard title={<Small6 totalStudents={89} />} height="80px" />
      </GridContainer>

      {/* Row 2 */}
      <GridContainer>
        <BoxCard title={<BarChart />} height="400px" />
        <BoxCard title={<CheckList />} height="400px" />
      </GridContainer>

      {/* Row 3 */}
      <GridContainer>
        <BoxCard title={<Large1 />} height="400px" />
        <BoxCard title={<Large2 />} height="400px" />
        <BoxCard title={<Large3 />} height="400px" />
      </GridContainer>

      {/* Row 4 */}
      <GridContainer>
        <BoxCard title={<Large4 />} height="400px" />
        <BoxCard title={<MiniCalendar />} height="400px" />
        <BoxCard title={<MiniCalendar />} height="400px" />
      </GridContainer>
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

const GridContainer = ({ children }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "20px",
    }}
  >
    {children}
  </div>
);
