'use client';
import { useEffect, useRef, useState } from 'react';
import './iframe.css';

export default function Image({ src, alt, key }) {
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        const img = imgRef.current;
        if (!img) return;

        function handleLoad() {
            setLoaded(true);
        }

        function handleError() {
            setLoaded(true);
        }

        if (img.complete) {
            handleLoad();
        }

        img.addEventListener('load', handleLoad);
        img.addEventListener('error', handleError);

        return () => {
            img.removeEventListener('load', handleLoad);
            img.removeEventListener('error', handleError);
        };
    }, [src]);

    return (
        <div className="dccon-wrapper" key={key}>
            <div className="dccon-bg" style={{ opacity: loaded ? 0 : 1 }} />
            <img ref={imgRef} src={src} alt={alt} className="dccon-real" />
        </div>
    );
}
