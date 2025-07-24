import React, { useState } from 'react';
import { useUser } from '@stackframe/stack';

const endpoints = [
  { name: 'Get Brands', url: '/api/brands', method: 'GET' },
  { name: 'Get Signs', url: '/api/signs', method: 'GET' },
  { name: 'Get Options', url: '/api/options', method: 'GET' },
];

export default function ApiTester() {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const user = useUser();

  const callApi = async (endpoint: typeof endpoints[0]) => {
    setLoading((prev) => ({ ...prev, [endpoint.name]: true }));
    try {
      const res = await fetch(endpoint.url, {
        method: endpoint.method,
        headers: {
  'request.user.id': user?.id || '',
}
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [endpoint.name]: data }));
    } catch (e) {
      setResults((prev) => ({ ...prev, [endpoint.name]: { error: String(e) } }));
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint.name]: false }));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>API Tester (Stack Auth)</h1>
      <ul>
        {endpoints.map((ep) => (
          <li key={ep.name} style={{ marginBottom: 16 }}>
            <button onClick={() => callApi(ep)} disabled={loading[ep.name]}>
              {loading[ep.name] ? 'Loading...' : ep.name}
            </button>
            <pre style={{ background: '#f4f4f4', padding: 8, marginTop: 8 }}>
              {results[ep.name] ? JSON.stringify(results[ep.name], null, 2) : ''}
            </pre>
          </li>
        ))}
      </ul>
    </div>
  );
} 