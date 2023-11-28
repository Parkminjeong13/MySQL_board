import { NextRequest, NextResponse } from "next/server";
import db from '@/db';
import bcrypt from 'bcrypt'
import { RowDataPacket } from "mysql2";

interface formType{
  email : string;
  password: string;
  name: string;
  nickname ?:string;
  level ?:number;
  type ?: string;
  id ?:number;
}

export const POST = async (
  req: NextRequest
) : Promise<NextResponse> =>{
  if(req.method === 'POST'){
    let {email, password, name, nickname, level, type, id}: formType = JSON.parse(await req.text());
    level = level === undefined ? 2 : level;

    if(type === 'edit'){

      const [chkMember] = await db.query<RowDataPacket[]>('select password from test.member where email = ?', [email]);

      if(password === chkMember[0].password){
        await db.query<RowDataPacket[]>('update test.member set email = ?, name = ?, nickname = ?, level =? where id = ?', [email, name, nickname, level, id])
        

      }else{
        const hash = await bcrypt.hash(password, 10);
        await db.query<RowDataPacket[]>('update test.member set email = ?, password = ?, name = ?, nickname = ?, level =? where id = ?', [email, hash, name, nickname, level, id])
      }
      return NextResponse.json({message: "성공", data: name})
    }
    if(!email || !password || !name){
      return NextResponse.json({message: "데이터가 부족합니다."})
    }

    const hash = await bcrypt.hash(password, 10);
    
    const [checkMember] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.member where email = ?', [email]);
    const memberCnt = checkMember[0].cnt;



    if(memberCnt > 0){
      return NextResponse.json({message: "해당 이메일이 존재합니다."})
    }else{
      await db.query('insert into test.member (email, password, name, nickname, level) values(?,?,?,?,?)',[email, hash, name, nickname, level]);
      const data = {
        email : email,
        nickname : nickname,
        password : password
      }

      return NextResponse.json({message: "성공", data: data})
    }   
  }else{
    return NextResponse.json({error: "실패"})
  }
}