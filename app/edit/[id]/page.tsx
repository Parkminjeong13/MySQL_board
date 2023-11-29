'use client'
import db from '@/db';
import { RowDataPacket } from 'mysql2/promise';
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import { useParams } from "next/navigation";
interface PostList {
  id : number;
  title : string;
  content: string;
  username: string;
  date: string;
  count: number
}
interface editProps{
  params : {
    id: string;
  }
}
export default function Edit(props:editProps){
  // console.log(props.params.id)
  // const [post] = await db.query<RowDataPacket[]>('select * from test.board where id = ?', [props.params.id]);
  // console.log(post[0].username)
  const params = useParams();
  const [post, setPost] = useState<PostList[]>([])
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // 'update 테이블명 set 필드=변경값, 필드=변경값, 필드=변경값 where id = 변경할아이디'
  // ('update test.board set title= ? , content=? where id = ?',[title, content, id])
  useEffect(() => {
    fetch(`/api/edit/${params.id}`)
      .then(res => {
        console.log("Response:", res); 
        return res.json();
      })
      .then(data => {
        console.log("Data:", data);
        setPost(data.data);
        setTitle(data.data[0].title);
        setContent(data.data[0].content);
      })
      .catch(error => {
        console.error("An error occurred:", error);
      });
  }, [params.id])
  const changeEvent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const { name, value } = e.target;    
    if (name === "title") {
      setTitle(value);
    } else if (name === "content") {
      setContent(value);
    }
  }
  const updatePost = (e: React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();

    fetch(`/api/edit/${params.id}`,{
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json'
      },
      body: JSON.stringify({
        id : params.id,
        title,
        content
      }),
    })
    .then(res => {
      if(res.ok){
        return res.json();
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .then(data => {
      console.log(data);
      window.location.href = '/';
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <>
      {
      title.length > 0 && content.length > 0  
      ?  
      <form method="post" onSubmit={updatePost}>
        <div className="flex flex-col items-start min-h-screen p-10 bg-gray-100">
          <div className="w-full max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <input type="text" name="name" className="shadow text-gray-700 text-sm mb-4 border w-full p-2 rounded" placeholder={post[0].username} />
            <input type="text" name="title" className="shadow text-gray-700 text-sm mb-4 border w-full p-2 rounded" placeholder={post[0].title} onChange={changeEvent}/>
            <textarea name="content" className="shadow text-gray-700 text-sm mb-4 border w-full p-2 h-32 rounded" placeholder={post[0].content} onChange={changeEvent}></textarea>
            <div className="flex justify-between">
              <Link href="/" className="bg-gray-500 text-white px-4 py-2 rounded shadow-md hover:bg-gray-600 focus:outline-none inline-block">취소</Link>
              <button className="bg-teal-500 text-white px-4 py-2 rounded shadow-md hover:bg-teal-600 focus:outline-none">등록</button>
            </div>
          </div>
        </div>
      </form>
      : 
      <NotData/>
      }
    </>
  )
}

function NotData(){
  return(
    <>
      <p>데이터가 존재하지 않습니다.</p>
      <Link href="/">목록</Link>
    </>
  )
}