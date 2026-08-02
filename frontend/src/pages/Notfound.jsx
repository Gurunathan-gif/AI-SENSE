import { Link } from "react-router-dom";

export default function NotFound(){

return(

<div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center">

<h1 className="text-9xl font-bold text-blue-500">

404

</h1>

<p className="mt-6 text-2xl">

Page Not Found

</p>

<Link to="/">

<button className="mt-8 bg-blue-600 px-8 py-4 rounded-xl">

Go Home

</button>

</Link>

</div>

);

}