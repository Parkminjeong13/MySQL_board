import db from '@/db';
import { RowDataPacket } from 'mysql2/promise';
import Link from 'next/link';
interface PostList {
  id : number;
  title : string;
  content: string;
  author: string;
  date: string;
  count: number
}
interface editProps{
  params : {
    id: string;
  }
}
export default async function Edit(props:editProps){
  const [results] = await db.query<RowDataPacket[]>('select * from test.board where id = ?', [props.params.id]);

  // 'update 테이블명 set 필드=변경값, 필드=변경값, 필드=변경값 where id = 변경할아이디'
  // ('update test.board set title= ? , content=? where id = ?',[title, content, id])
  return (
    <>
      {
      results.length > 0  
      ?  
      <form method="post">
        <input type="text" name="name" className="shadow text-gray-700 text-sm mb-2 border" />
        <input type="text" className="shadow text-gray-700 text-sm mb-2 border" name="title" />
        <textarea name="content" className="shadow text-gray-700 text-sm mb-2 border"></textarea>
        <Link href="/" className="bg-green-500 text-white px-4 py-2 rounded shadow-md hover:bg-green-600 focus:outline-none">취소</Link>
        <button className="bg-orange-500 text-white px-4 py-2 rounded shadow-md hover:bg-orange-600 focus:outline-none">등록</button>
      </form>
      : 
      <NotData/>
      }
    </>
  )
}

// function Data(props){
//   console.log(props.result)
//   return(
//     <p>sdgjhsdkjghkjsadghkjshg</p>
//   )
// }

function NotData(){
  return(
    <>
      <p>데이터가 존재하지 않습니다.</p>
      <Link href="/">목록</Link>
    </>
  )
}