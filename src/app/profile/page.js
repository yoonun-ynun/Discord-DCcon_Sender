'use client';
import Header from '@/app/Header';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import IframeOverlay from '@/app/components/IframeOveray';
import { useDcconSync } from '@/store/queryList.js';

export default function Page() {
    const { reset } = useDcconSync();
    const router = useRouter();
    const { data: session, status } = useSession();
    const [menu, setMenu] = useState('profile');

    useEffect(() => {
        if (status === 'unauthenticated') {
            reset();
            router.replace('/');
        }
    }, [status, router]);

    if (status !== 'authenticated') return null;
    return (
        <div>
            <Header />
            <main className="main">
                <span id="profile_menu" className={'menu'}>
                    <hr />
                    <button
                        id={'info_bt'}
                        className={'pf_menu_bt'}
                        onClick={() => setMenu('profile')}
                    >
                        프로필
                    </button>
                    <hr />
                    <button
                        id={'info_list'}
                        className={'pf_menu_bt'}
                        onClick={() => setMenu('list')}
                    >
                        나의 디시콘
                    </button>
                    <hr />
                </span>
                {menu === 'profile' &&
                    profile(session.user.discordId, session.user.image, session.user.name)}
                {menu === 'list' && <ListUp />}
            </main>
            <span
                className={'button'}
                style={{ marginRight: '5%', display: 'flex', justifyContent: 'right' }}
            >
                <button
                    id={'Discord_logout'}
                    onClick={() => {
                        reset();
                        signOut();
                    }}
                >
                    Sign Out
                </button>
            </span>
        </div>
    );
}

function ListUp() {
    const { isFetching, refetch, List, data, remove } = useDcconSync();
    const [url, setUrl] = useState(null);

    function Delete(event) {
        const el = event.target.closest('[dccon_idx]');
        if (!el) return;
        const idx = el.getAttribute('dccon_idx');
        fetch('api/controller', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idx: idx }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert('삭제에 성공하였습니다');
                    remove(idx);
                } else alert(data.message);
            })
            .catch((err) => {
                alert('삭제 중 오류가 발생하였습니다.');
                console.error(err);
            });
    }
    function iframe_clicker(event) {
        const el = event.target.closest('[dccon-idx]');
        if (!el) return;
        setUrl(`/components/info?idx=${el.getAttribute('dccon-idx')}`);
    }

    return (
        <div className={'profile_list'}>
            {isFetching && <button>refreshing...</button>}

            {!isFetching && <button onClick={() => refetch()}>refresh</button>}
            <hr />
            <div>
                <div className={'dccon_listing'}>
                    <p>이미지</p>
                    <p className={'dccon_listing_title'}>이름</p>
                    <p>삭제</p>
                </div>
                <hr />
            </div>
            {List !== null &&
                List.map((item, i) => {
                    return (
                        <div key={`dccon${i}`}>
                            <div className={'dccon_listing'}>
                                <img
                                    src={`/api/img?u=${encodeURIComponent(data[item].url)}`}
                                    alt={'dccon_img'}
                                />
                                <div
                                    className={'dccon_listing_title'}
                                    dccon-idx={item}
                                    onClick={iframe_clicker}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {data[item].name}
                                </div>
                                <button
                                    className={'delete_dccon'}
                                    dccon_idx={item}
                                    onClick={Delete}
                                >
                                    X
                                </button>
                            </div>
                            <hr />
                        </div>
                    );
                })}
            {url && <IframeOverlay url={url} onClose={() => setUrl(null)} />}
        </div>
    );
}

function profile(discordId, img, name) {
    return (
        <div className={'profile_list'}>
            <img src={img} alt={'profile image'} />
            <br />
            name: {name}
            <br /> ID: {discordId}
        </div>
    );
}
