import { User, Mail, Cpu } from "lucide-react";

export default function Profile(){

return(

<div className="min-h-screen bg-slate-950 text-white p-10">

<div className="bg-slate-900 rounded-3xl max-w-4xl mx-auto p-10">

<div className="flex flex-col items-center">

<User size={100} className="text-blue-500"/>

<h1 className="text-4xl font-bold mt-6">

Gurunathan

</h1>

<p className="text-gray-400 mt-2">

ECE Student

</p>

</div>

<div className="grid grid-cols-2 gap-8 mt-12">

<div>

<h3 className="text-gray-400">

Email

</h3>

<p className="mt-2">

user@email.com

</p>

</div>

<div>

<h3 className="text-gray-400">

Projects

</h3>

<p className="mt-2">

12

</p>

</div>

<div>

<h3 className="text-gray-400">

Arduino Board

</h3>

<p className="mt-2">

Arduino UNO

</p>

</div>

<div>

<h3 className="text-gray-400">

AI Chats

</h3>

<p className="mt-2">

38

</p>

</div>

</div>

</div>

</div>

);

}