import React from 'react'
import CustomToolTip from './CustomToolTip';
import CustomLegend from './CustomLegend'
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const CustomPieChart = ({ data, label, totalAmount,colors, showTextAnchor }) => {
    //console.log("📊 Chart Data", data);
    console.log("Total amount prop:", totalAmount);
  return ( <ResponsiveContainer width='100%' height={380}>
    <PieChart>
        <Pie
        data={data}
        dataKey = "amount"
        nameKey = "name"
        cx = "50%"
        cy = "50%"
        outerRadius={130}
        innerRadius={100}
        labelLine={false}
        >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
        </Pie>
        <Tooltip content={CustomToolTip}/>
        <Legend content={CustomLegend}/>

        {showTextAnchor && (
  <g>
    <text
      x="50%"
      y="50%"
      dy={-30}
      textAnchor="middle"
      fill="#666"
      fontSize="14px"
    >
      {label}
    </text>
    <text
      x="50%"
      y="45%"
      dy={15}
      textAnchor="middle"
      fill="#333"
      fontSize="24px"
      fontWeight="600"
    >
      {totalAmount}
    </text>
  </g>
)}
    </PieChart>
  </ResponsiveContainer>
  );
}

export default CustomPieChart
