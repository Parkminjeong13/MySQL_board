import db from '@/db';
import { NextRequest, NextResponse } from 'next/server';
import { RowDataPacket } from 'mysql2/promise';

interface PostType{
    pathUrl ?: string;
    id? : number;
}
interface MainType{
    totalCnt : number;
    todayCnt : number;
    writeCnt : number;
    commentCnt : number;
    visitCnt : number;
    visitTotalCnt : number;
}
export const POST = async(req:NextRequest) : Promise<NextResponse> =>{  
    const {pathUrl, id}: PostType = JSON.parse(await req.text());
    if(req.method === 'POST'){
        switch(pathUrl){
            case 'member' : 
                const [memberResult] = await db.query<RowDataPacket[]>('select * from test.member order by date DESC')
                return NextResponse.json({message: "성공", data:memberResult})
            case 'edit' : 
                const [editResult] = await db.query<RowDataPacket[]>('select * from test.member where id = ?', [id])
                return NextResponse.json({message: "성공", data:editResult})
            case 'mainCnt' :
                const [totalCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.member')
                const [todayCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.member where date >= now() - interval 1 day')
                const [writeCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.board where date >= now() - interval 1 day')
                const [commentCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.comment where date >= now() - interval 1 day')
                const [visitCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.visits where visit_time >= now() - interval 1 day')
                const [visitTotalCnt] = await db.query<RowDataPacket[]>('select count(*) as cnt from test.visits')
                const totalData : MainType = {
                    totalCnt : totalCnt[0].cnt ?? 0,
                    todayCnt : todayCnt[0].cnt ?? 0,
                    writeCnt : writeCnt[0].cnt ?? 0,
                    commentCnt : commentCnt[0].cnt ?? 0,
                    visitCnt : visitCnt[0].cnt ?? 0,
                    visitTotalCnt : visitTotalCnt[0].cnt ?? 0
                }
                return NextResponse.json({message: "성공", data:totalData})
            case 'mainNewMember' :
                const [todayMember] = await db.query<RowDataPacket[]>('select * from test.member where date >= now() - interval 1 day')
                return NextResponse.json({message: "성공", data:todayMember})
            case 'mainPost' :
                const [newPost] = await db.query<RowDataPacket[]>('select * from test.board where date >= now() - interval 1 day')
                const [newComment] = await db.query<RowDataPacket[]>('select * from test.comment where date >= now() - interval 1 day')
                const postData = {
                    newPost : newPost,
                    newComment : newComment
                }
                return NextResponse.json({message: "성공", data:postData})
            default : 
                return NextResponse.json({error: "알 수 없는 에러가 발생하였습니다."})
        }
    }else{
        return NextResponse.json({error: "알 수 없는 에러가 발생하였습니다."})
    }
}