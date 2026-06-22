import React from "react";

import {

LineChart,

Line,

XAxis,

YAxis,

Tooltip,

ResponsiveContainer

}

from "recharts";

const AnalyticsChart=({

data

})=>{

return(

<ResponsiveContainer

width="100%"

height={350}

>

<LineChart data={data}>

<XAxis dataKey="month"/>

<YAxis/>

<Tooltip/>

<Line

dataKey="avgScore"

/>

</LineChart>

</ResponsiveContainer>

);

};

export default AnalyticsChart;