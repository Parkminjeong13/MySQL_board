import { NextRequest, NextResponse } from "next/server";
import db from '@/db'
interface PostData {
  userid: string;
  username: string;
  title: string;
  content: string;
}

export const POST = async (
  req: NextRequest  
) : Promise<NextResponse> =>{

  if(req.method === 'POST'){
    try{
      const {userid, username , title, content}: PostData = JSON.parse(await req.text());
      if(!userid || !username || !title || !content){
        return NextResponse.json({message: "데이터가 부족합니다."});
      }else{
        const [results] = await db.query('insert into test.board (userid, username, title, content) VALUES (?, ?, ?, ?)', [userid, username, title, content]);
        return NextResponse.json({message: "성공", result: results});
      }    

    }catch(error){
      return NextResponse.json({error: "에러"});
    }
  }else{
    return NextResponse.json({error: "정상적인 데이터가 아닙니다."});
  }


}