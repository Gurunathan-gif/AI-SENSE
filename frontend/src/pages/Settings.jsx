import { Settings, Moon, Bell, Shield } from "lucide-react";

export default function SettingsPage(){

return(

<div className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-bold text-blue-500">

Settings

</h1>

<div className="grid lg:grid-cols-2 gap-8 mt-10">

<div className="bg-slate-900 rounded-3xl p-8">

<Moon size={45}/>

<h2 className="text-2xl font-bold mt-5">

Dark Theme

</h2>

<button className="mt-6 bg-blue-600 px-6 py-3 rounded-xl">

Enabled

</button>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

<Bell size={45}/>

<h2 className="text-2xl font-bold mt-5">

Notifications

</h2>

<button className="mt-6 bg-blue-600 px-6 py-3 rounded-xl">

Enabled

</button>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

<Shield size={45}/>

<h2 className="text-2xl font-bold mt-5">

Privacy

</h2>

<p className="mt-5 text-gray-400">

Your projects are securely stored.

</p>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

<Settings size={45}/>

<h2 className="text-2xl font-bold mt-5">

Version

</h2>

<p className="mt-5 text-gray-400">

AI SENSE v1.0

</p>

</div>

</div>

</div>

);

}