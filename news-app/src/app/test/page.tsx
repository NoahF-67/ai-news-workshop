'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface TestResults {
  success: boolean;
  message: string;
  results: {
    mongodb: { connected: boolean; error: string | null };
    newsapi: { connected: boolean; error: string | null };
    gemini: { connected: boolean; error: string | null };
    environment: { loaded: boolean; error: string | null };
  };
}

export default function TestPage() {
  const [results, setResults] = useState<TestResults | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnections = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-connections');
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Test failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (connected: boolean) => {
    return connected ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    );
  };

  const getStatusBadge = (connected: boolean) => {
    return (
      <Badge variant={connected ? "default" : "destructive"}>
        {connected ? 'Connected' : 'Failed'}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Service Connection Test
          </h1>
          <p className="text-gray-600 mb-6">
            Test the connection status of all external services
          </p>
          <Button 
            onClick={testConnections} 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              'Test Connections'
            )}
          </Button>
        </div>

        {results && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Overall Status</span>
                  {getStatusIcon(results.success)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium mb-2">{results.message}</p>
                <div className="flex items-center space-x-2">
                  <span>Status:</span>
                  {getStatusBadge(results.success)}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>MongoDB</span>
                    {getStatusIcon(results.results.mongodb.connected)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(results.results.mongodb.connected)}
                    {results.results.mongodb.error && (
                      <p className="text-sm text-red-600">
                        {results.results.mongodb.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>News API</span>
                    {getStatusIcon(results.results.newsapi.connected)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(results.results.newsapi.connected)}
                    {results.results.newsapi.error && (
                      <p className="text-sm text-red-600">
                        {results.results.newsapi.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Gemini API</span>
                    {getStatusIcon(results.results.gemini.connected)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(results.results.gemini.connected)}
                    {results.results.gemini.error && (
                      <p className="text-sm text-red-600">
                        {results.results.gemini.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Environment Variables</span>
                    {getStatusIcon(results.results.environment.loaded)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getStatusBadge(results.results.environment.loaded)}
                    {results.results.environment.error && (
                      <p className="text-sm text-red-600">
                        {results.results.environment.error}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
