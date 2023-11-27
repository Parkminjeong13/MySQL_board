import { NextRequest, NextResponse } from "next/server";
import db from '@/db';
import { RowDataPacket } from "mysql2";

interface PostList {
    id : number;
    title : string;
    content: string;
    userid: string;
    username: string;
    date: string;
    count: number
}
export const POST = async (
  req: NextRequest
) : Promise<NextResponse> =>{
  if(req.method === 'POST'){
    try{
      const {id, title, content} : PostList = JSON.parse(await req.text());
      if(!id || !title || !content){
        return NextResponse.json({message: "데이터가 부족합니다."})  
      }else{
        await db.query<RowDataPacket[]>('update test.board set title= ?, content=? where id = ?',[title, content, id])
        const [datas] = await db.query<RowDataPacket[]>('select * from test.board where id = ?',[id]);
        return NextResponse.json({message: "성공", result: datas})
      }
    }catch(error){
      return NextResponse.json({error: error})
    }   
  }else{
    return NextResponse.json({error: "정상적인 데이터가 아닙니다."})
  }  
}

export const GET = async (req:NextRequest) : Promise<NextResponse> =>{
    const pathname = req.nextUrl.pathname;
    const postId = pathname.split('/').pop()
    const [results] = await db.query<RowDataPacket[]>('SELECT * FROM test.board where id = ?',[postId]);  
    return NextResponse.json({data:results})
  }