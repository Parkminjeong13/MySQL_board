'use client';

import { signIn } from "next-auth/react";
import { useState } from "react";

interface formType{
  email : string;
  password: string;
  name: string
}

export default  function Register(){
  const [formData, setFormData] = useState<formType>({
    email : '',
    password: '',
    name: ''
  })
  const [message, setMessage] = useState<string>("");
  const changeEvent = (e: React.ChangeEvent<HTMLInputElement>) =>{
    setFormData({
      ...formData, [e.target.name] : e.target.value
    })
    // console.log(formData)
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
        // console.log(result)
        if(data.message === '성공'){
          alert("회원가입이 완료 되었습니다.");
          // window.location.href='/';
          signIn('credentials', {
            email : result.email,
            password: result.password,
            callbackUrl : '/'
          })
        }
        // console.log(data)
        setMessage(data.message);
      }
    }catch(error){
      console.log(error)
    }
  }

  return(
    <>
      <p>{message}</p>
      <div className="flex items-center justify-center h-screen bg-gray-200">
      <form onSubmit={submitEvent} method="POST">
        <input onChange={changeEvent} type="text" placeholder="이메일" name="email" required className="w-full px-3 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"/>
        <input onChange={changeEvent} type="password" placeholder="비밀번호" name="password" required className="w-full px-3 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"/>
        <input onChange={changeEvent} type="text" placeholder="이름" name="name" required className="w-full px-3 py-2 mb-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"/>
        <button type="submit">가입</button>


      </form>
      </div>
    </>
  )
}