import { useEffect, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import Head from 'next/head';
import '../app/globals.css';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const [sessionToken, setSessionToken] = useLocalStorage('session_token', '');
  const [loading, setLoading] = useState(true);

  const generateSession = async () => {
    const response = await fetch('/api/session/generate');
    if (response.ok) {
      const data = await response.json();
      setSessionToken(data.sessionId);
    } else {
      console.error('Session generation failed');
    }
  };

  useEffect(() => {
    const checkOrGenerateSession = async () => {
      if (sessionToken) {
        const response = await fetch('/api/session/check', {
          headers: {
            'session-id': sessionToken,
          },
        });
        if (!response.ok) {
          await generateSession();
          console.error('Session check failed, generating new session');
        }
      } else {
        await generateSession();
      }
      setLoading(false);
    };

    checkOrGenerateSession();
  }, [sessionToken, setSessionToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Fetching your session... o.o</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Todo App by Hafidz Muhammad Rizky</title>
        <meta name="description" content="a basic to-do app, proof of concept" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Todo App by Hafidz Muhammad Rizky" />
        <meta property="og:description" content="A basic to-do app, proof of concept" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://todo.arcanius.id/" />
        {/*<meta property="og:image" content="https://assignment.com/og-image.jpg" />*/}
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;