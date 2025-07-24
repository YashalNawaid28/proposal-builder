"use client";
import React, { useState } from "react";
import { useUser } from "@stackframe/stack";

const endpoints = [
  { name: "Get Brands", url: "/api/brands", method: "GET" },
  { name: "Get Signs", url: "/api/signs", method: "GET" },
  { name: "Get Options", url: "/api/options", method: "GET" },
];

export default function ApiTester() {
  const [results, setResults] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [signId, setSignId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [pricingSignId, setPricingSignId] = useState('');
  const user = useUser();

  const callApi = async (
    endpoint: (typeof endpoints)[0],
    extraQuery: string = ""
  ) => {
    const url = extraQuery ? `${endpoint.url}?${extraQuery}` : endpoint.url;
    setLoading((prev) => ({ ...prev, [endpoint.name]: true }));
    try {
      const res = await fetch(url, {
        method: endpoint.method,
        headers: {
          "request.user.id": user?.id || "",
        },
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [endpoint.name]: data }));
    } catch (e) {
      setResults((prev) => ({
        ...prev,
        [endpoint.name]: { error: String(e) },
      }));
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint.name]: false }));
    }
  };

  const callGetBySignId = async () => {
    const name = "Get Options by SignId";
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const res = await fetch(`/api/options/get-by-signId?sign_id=${signId}`, {
        headers: {
          "request.user.id": user?.id || "",
        },
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [name]: data }));
    } catch (e) {
      setResults((prev) => ({ ...prev, [name]: { error: String(e) } }));
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  const callGetByBrandId = async () => {
    const name = "Get Signs by BrandId";
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const res = await fetch(`/api/signs/get-by-brandId?brand_id=${brandId}`, {
        headers: {
          "request.user.id": user?.id || "",
        },
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [name]: data }));
    } catch (e) {
      setResults((prev) => ({ ...prev, [name]: { error: String(e) } }));
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

 

  const callGetPricingBySignId = async () => {
    const name = 'Get Sign Pricing by SignId';
    setLoading((prev) => ({ ...prev, [name]: true }));
    try {
      const res = await fetch(`/api/sign-pricing/get-by-signId?sign_id=${pricingSignId}`, {
        headers: {
          'request.user.id': user?.id || '',
        },
      });
      const data = await res.json();
      setResults((prev) => ({ ...prev, [name]: data }));
    } catch (e) {
      setResults((prev) => ({ ...prev, [name]: { error: String(e) } }));
    } finally {
      setLoading((prev) => ({ ...prev, [name]: false }));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>API Tester (Stack Auth)</h1>

      <ul>
        {endpoints.map((ep) => (
          <li key={ep.name} style={{ marginBottom: 16 }}>
            <button onClick={() => callApi(ep)} disabled={loading[ep.name]}>
              {loading[ep.name] ? "Loading..." : ep.name}
            </button>
            <pre style={{ background: "#f4f4f4", padding: 8, marginTop: 8 }}>
              {results[ep.name]
                ? JSON.stringify(results[ep.name], null, 2)
                : ""}
            </pre>
          </li>
        ))}

        {/* GET SIGNS BY BRAND ID */}
        <li style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Enter brand_id"
              value={brandId}
              onChange={(e) => setBrandId(e.target.value)}
              style={{ padding: 6, flex: 1 }}
            />
            <button
              onClick={callGetByBrandId}
              disabled={loading["Get Signs by BrandId"]}
            >
              {loading["Get Signs by BrandId"]
                ? "Loading..."
                : "Get Signs by BrandId"}
            </button>
          </div>
          <pre style={{ background: "#f4f4f4", padding: 8, marginTop: 8 }}>
            {results["Get Signs by BrandId"]
              ? JSON.stringify(results["Get Signs by BrandId"], null, 2)
              : ""}
          </pre>
        </li>

        {/* GET OPTIONS BY SIGN ID */}
        <li style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Enter sign_id"
              value={signId}
              onChange={(e) => setSignId(e.target.value)}
              style={{ padding: 6, flex: 1 }}
            />
            <button
              onClick={callGetBySignId}
              disabled={loading["Get Options by SignId"]}
            >
              {loading["Get Options by SignId"]
                ? "Loading..."
                : "Get Options by SignId"}
            </button>
          </div>
          <pre style={{ background: "#f4f4f4", padding: 8, marginTop: 8 }}>
            {results["Get Options by SignId"]
              ? JSON.stringify(results["Get Options by SignId"], null, 2)
              : ""}
          </pre>
        </li>

        {/* GET SIGN PRICING BY SIGN ID */}
        <li style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter sign_id for pricing"
              value={pricingSignId}
              onChange={(e) => setPricingSignId(e.target.value)}
              style={{ padding: 6, flex: 1 }}
            />
            <button onClick={callGetPricingBySignId} disabled={loading['Get Sign Pricing by SignId']}>
              {loading['Get Sign Pricing by SignId'] ? 'Loading...' : 'Get Sign Pricing by SignId'}
            </button>
          </div>
          <pre style={{ background: '#f4f4f4', padding: 8, marginTop: 8 }}>
            {results['Get Sign Pricing by SignId']
              ? JSON.stringify(results['Get Sign Pricing by SignId'], null, 2)
              : ''}
          </pre>
        </li>

        {/* GET SIGN PRICING BY SIGN ID */}
        <li style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Enter sign_id for pricing"
              value={pricingSignId}
              onChange={(e) => setPricingSignId(e.target.value)}
              style={{ padding: 6, flex: 1 }}
            />
            <button onClick={callGetPricingBySignId} disabled={loading['Get Sign Pricing by SignId']}>
              {loading['Get Sign Pricing by SignId'] ? 'Loading...' : 'Get Sign Pricing by SignId'}
            </button>
          </div>
          <pre style={{ background: '#f4f4f4', padding: 8, marginTop: 8 }}>
            {results['Get Sign Pricing by SignId']
              ? JSON.stringify(results['Get Sign Pricing by SignId'], null, 2)
              : ''}
          </pre>
        </li>
      </ul>
    </div>
  );
}
