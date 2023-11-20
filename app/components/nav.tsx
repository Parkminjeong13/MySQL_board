'use client';

import Link from 'next/link';
import { useCustomSession } from '../sessions';
import Logout from './logout';
import Login from './login';

interface userInfo {
    name: string;
    email: string;
    image: string;
}

export default function Nav(){
    const {data: session, status} = useCustomSession();
    return (
        <>
            {
                session && session.user.level === 10 ?
                '관리자' : session && session.user !== null && '일반회원'
            }
            {
                status !== 'loading' && session && session.user?.email ?
                <>
                    <p>{session && session.user?.name}님 반갑습니다.</p>
                    <Logout />
                </>
                :<>
                    <Link href="/register">회원가입</Link>
                    <Login />
                </>
            }     
        </>
    )
}