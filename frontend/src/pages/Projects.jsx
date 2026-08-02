import { useEffect, useState } from "react";
import { FolderOpen, Trash2, RefreshCw } from "lucide-react";
import { getProjects } from "../services/projectService";

export default function Projects() {

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {

    try {

      const res = await getProjects();

      setProjects(res.projects);

    } catch (err) {

      console.log(err);

      alert("Unable to load projects");

    }

    setLoading(false);

  };

  useEffect(() => {

    loadProjects();

  }, []);

  return (

<div className="min-h-screen bg-slate-950 text-white">

<div className="flex justify-between items-center p-8 border-b border-slate-800">

<h1 className="text-4xl font-bold text-blue-500">

My Projects

</h1>

<button
onClick={loadProjects}
className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl flex gap-2"
>

<RefreshCw/>

Refresh

</button>

</div>

{loading ? (

<div className="flex justify-center mt-20">

Loading...

</div>

) : (

<div className="grid lg:grid-cols-3 gap-8 p-8">

{projects.length===0 && (

<h2>No Projects Found.</h2>

)}

{projects.map((project)=>(

<div
key={project._id}
className="bg-slate-900 rounded-3xl border border-slate-800 p-8 hover:border-blue-500 transition"
>

<FolderOpen
size={60}
className="text-blue-500"
/>

<h2 className="text-2xl font-bold mt-6">

{project.title}

</h2>

<p className="mt-4 text-gray-400">

{project.prompt}

</p>

<div className="mt-6">

<textarea

readOnly

value={project.code}

className="bg-slate-950 rounded-xl w-full h-44 p-4 text-green-400 outline-none"

/>

</div>

<div className="flex gap-4 mt-6">

<button
onClick={()=>{
navigator.clipboard.writeText(project.code);
alert("Copied");
}}
className="bg-blue-600 px-5 py-2 rounded-lg"
>

Copy

</button>

<button
className="bg-red-600 px-5 py-2 rounded-lg flex gap-2"
>

<Trash2 size={18}/>

Delete

</button>

</div>

</div>

))}

</div>

)}

</div>

  );

}