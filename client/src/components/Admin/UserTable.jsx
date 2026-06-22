import React from "react";

const UserTable=({

users

})=>{

return(

<table className="w-full">

<thead>

<tr>

<th>Name</th>

<th>Email</th>

<th>Role</th>

</tr>

</thead>

<tbody>

{

users.map(user=>(

<tr key={user._id}>

<td>{user.name}</td>

<td>{user.email}</td>

<td>{user.role}</td>

</tr>

))

}

</tbody>

</table>

);

};

export default UserTable;