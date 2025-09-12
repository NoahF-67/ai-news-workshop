'use client';

import { useState, useEffect } from 'react';
import { ApiService } from '@/lib/api';

export default function TestApiPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testApi = async () => {
      try {
        setLoading(true);
        const response = await ApiService.getArticles({ limit: 5 });
        setData(response);
        setError(null);
      } catch (err) {
        console.error('API Test Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testApi();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Testing API connection...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">API Test Failed</h1>
          <p className="text-gray-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Results</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Response Status</h2>
          <p className="text-green-600">✅ API call successful!</p>
          <p>Success: {data?.success ? 'true' : 'false'}</p>
          <p>Articles count: {data?.data?.length || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Sample Articles</h2>
          {data?.data?.slice(0, 3).map((article: any, index: number) => (
            <div key={index} className="border-b pb-4 mb-4 last:border-b-0">
              <h3 className="font-semibold text-lg">{article.title}</h3>
              <p className="text-gray-600 text-sm">Publisher: {article.publisherName}</p>
              <p className="text-gray-600 text-sm">Category: {article.category}</p>
              <p className="text-gray-600 text-sm">ID: {article._id}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
