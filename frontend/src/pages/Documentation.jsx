export default function Documentation(){

return(

<div className="min-h-screen bg-slate-950 text-white p-10">

<h1 className="text-5xl font-bold text-blue-500">

Documentation

</h1>

<p className="mt-8 text-gray-300 text-xl">

Welcome to AI SENSE Documentation.

</p>

<div className="grid lg:grid-cols-2 gap-8 mt-12">

<div className="bg-slate-900 rounded-3xl p-8">

<h2 className="text-3xl font-bold">

Arduino Basics

</h2>

<ul className="mt-6 space-y-4 text-gray-400">

<li>• Variables</li>

<li>• Functions</li>

<li>• Digital Pins</li>

<li>• Analog Pins</li>

<li>• PWM</li>

<li>• Serial Monitor</li>

</ul>

</div>

<div className="bg-slate-900 rounded-3xl p-8">

<h2 className="text-3xl font-bold">

AI SENSE Guide

</h2>

<ul className="mt-6 space-y-4 text-gray-400">

<li>• Generate Code</li>

<li>• Module Library</li>

<li>• RUN Studio</li>

<li>• Upload Sketch</li>

<li>• Save Project</li>

<li>• AI Chat</li>

</ul>

</div>

</div>

</div>

);

}