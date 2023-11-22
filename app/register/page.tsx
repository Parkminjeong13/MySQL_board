'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

interface formType{
  email : string;
  password: string;
  name: string;
  nickname : string;
}

export default  function Register(){
  const [formData, setFormData] = useState<formType>({
    email : '',
    password: '',
    name: '',
    nickname : ''
  })
  const [message, setMessage] = useState<string>("");
  const changeEvent = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFormData({
      ...formData, [e.target.name] : e.target.value
    })
  }
  const submitEvent = async (e: React.FormEvent<HTMLFormElement>) =>{
    e.preventDefault();
    try{
      const res = await fetch('/api/auth/signup',{
        method : 'POST',
        headers : {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if(res.ok){
        const data = await res.json();
        const result = data.data;
        if(data.message === '성공'){
          alert("회원가입이 완료 되었습니다.");
          signIn('credentials', {
            email : result.email,
            password: result.password,
            callbackUrl : '/'
          })
        }
        setMessage(data.message);
      }
    }catch(error){
      console.log(error)
    }
  }

  return(
    <>
      <p>{message}</p>
      <div className="flex items-center justify-center h-screen bg-gray-200 p-10">
        <form onSubmit={submitEvent} method="POST" className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <input onChange={changeEvent} type="text" placeholder="이메일" name="email" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <input onChange={changeEvent} type="password" placeholder="비밀번호" name="password" required className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <input onChange={changeEvent} type="text" placeholder="이름" name="name" required className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <input onChange={changeEvent} type="text" placeholder="닉네임" name="nickname" required className="mt-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <button type="submit" className="w-full mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">가입</button>
        </form>
      </div>
    </>
  )
}