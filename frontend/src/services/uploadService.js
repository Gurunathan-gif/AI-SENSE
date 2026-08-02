import api from "../api/api";

export const detectBoard=async()=>{

const res=await api.get("/upload/board");

return res.data;

}

export const compileCode=async(code)=>{

const res=await api.post("/upload/compile",{

code

});

return res.data;

}

export const uploadCode=async(code,port)=>{

const res=await api.post("/upload",{

code,

port

});

return res.data;

}