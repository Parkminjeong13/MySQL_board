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
    // console.log(formData)
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
        window.location.href = '/';
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
  // console.log(session)
  return (
    <>
      <form method="post" onSubmit={submitEvent}>
        <div className="flex flex-col items-start min-h-screen p-10 bg-gray-100">
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <input type="text" name="name" defaultValue={session && session.user.name} onChange={changeEvent} className="shadow text-gray-700 text-sm mb-4 border w-full p-2 rounded" placeholder="이름을 입력하세요." />
            <input type="text" name="title" defaultValue={formData.title} onChange={changeEvent} className="shadow text-gray-700 text-sm mb-4 border w-full p-2 rounded" placeholder="제목을 입력하세요." />
            <textarea name="content" defaultValue={formData.content} onChange={changeEvent} className="shadow text-gray-700 text-sm mb-4 border w-full p-2 h-32 rounded" placeholder="내용을 입력하세요."></textarea>
            <div className="flex justify-between">
              <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none inline-block">취소</Link>
              <button className="bg-teal-500 text-white px-4 py-2 rounded shadow-md hover:bg-teal-600 focus:outline-none">등록</button>
            </div>
          </div>
        </div>
      </form>
    </>
  )
}