export default function Testimonials() {

const users=[

{
name:"ECE Student",
text:"AI SENSE reduced my project development time dramatically."
},

{
name:"Faculty",
text:"Excellent platform for teaching Arduino programming."
},

{
name:"Project Team",
text:"One-click compile and upload makes development much easier."
}

]

return(

<section className="py-24 bg-white">

<div className="max-w-7xl mx-auto px-8">

<h2 className="text-5xl font-bold text-center mb-16">

What Users Say

</h2>

<div className="grid lg:grid-cols-3 gap-8">

{users.map((user,index)=>(

<div
key={index}
className="shadow-xl rounded-3xl p-8 hover:-translate-y-2 transition"
>

<div className="text-yellow-500 text-2xl">

★★★★★

</div>

<p className="mt-5 text-gray-600">

{user.text}

</p>

<h3 className="mt-8 font-bold">

{user.name}

</h3>

</div>

))}

</div>

</div>

</section>

)

}