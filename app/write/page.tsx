'use client';

interface formType {
  userid: string;
  username: string;
  title: string;
  content: string;
}
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCustomSession } from "../sessions";

export default function Write(){
  const {data: session } = useCustomSession();
  const [formData, setFormData] = useState<formType>({
    userid: session?.user.email ?? '',
    username: session?.user.name ?? '',
    title: '',
    content: ''
  })
  useEffect(()=>{
    setFormData({
      userid: session?.user.email ?? '',
    username: session?.user.name ?? '',
    title: '',
    content: ''
    })
  },[session?.user.name, session?.user.email])

  const changeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    setFormData({...formData, [e.target.name] : e.target.value});
  }
  const submitEvent = async (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    try{
      const res = await fetch('/api/write',{
        method: 'POST',
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if(res.ok){
        const data = await res.json();
        console.log(data.message);
        // alert('정상적으로 등록 하였습니다.');
        // window.location.href = '/';
      }else{
        const errorData = await res.json();
        console.log(errorData.error);
      }

    }catch(error){
      console.log(error);
    }
  }
  if(!session){
    return <p>로그인안함</p>
  }
  return (
    <>
      <form method="post" onSubmit={submitEvent}>
        <input type="text" name="name" defaultValue={session && session.user.name} onChange={changeEvent} className="shadow text-gray-700 text-sm mb-2 border" />
        <input type="text" className="shadow text-gray-700 text-sm mb-2 border" name="title" onChange={changeEvent} defaultValue={formData.title} />
        <textarea name="content" className="shadow text-gray-700 text-sm mb-2 border" onChange={changeEvent} defaultValue={formData.content}></textarea>
        <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none">취소</Link>
        <button className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600 focus:outline-none">등록</button>
      </form>
    </>
  )
}