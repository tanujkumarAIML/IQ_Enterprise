import React from "react";

const StatCard=({

title,

value

})=>{

return(

<div className="bg-white p-6 rounded-xl shadow">

<h3 className="text-slate-500">

{title}

</h3>

<h1 className="text-3xl font-bold">

{value}

</h1>

</div>

);

};

export default StatCard;