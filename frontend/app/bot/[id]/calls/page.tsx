"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Call {
  call_id: string;
  duration_ms: number;
  call_status: string;
  from_number?: string;
  to_number?: string;
  call_analysis: {
    summary: string;
  };
}

interface CallsResponse {
  calls: Call[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
}

interface Transcript {
    role: string;
    log: string;
}

export default function BotCallsPage() {
  const params = useParams();
  const router = useRouter();
  const botId = params!.id as string;

  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCall, setSelectedCall] = useState<string | null>(null);
  const [callDetails, setCallDetails] = useState<Transcript[] | null>([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  const fetchCalls = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/call/logs/${botId}?page=${page}`);
      const data: CallsResponse = await response.json();
      setCalls(data.calls || []);
      
      if (data.pagination) {
        const totalPages = Math.ceil(data.pagination.total / 10);
        setTotalPages(totalPages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Failed to fetch calls:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCallDetails = async (callId: string) => {
    setLoadingDetails(true);
    try {
      const response = await fetch(`${API_URL}/api/call/history/${callId}`);
      const data = await response.json();
      console.log("Call details:", data);
      const parsedArray: Transcript[] = [];
      const parsedTranscripts = data.transcript;

      if ( parsedTranscripts ) {
      parsedTranscripts.map((item: Array<string>) => {
        const role = item[0];
        const log = item[1];
        if ( role == "assistant" || role == "user" ) {
          parsedArray.push({role: role, log: log})
        }
      })
    }

      setCallDetails(parsedArray);
    } catch (error) {
      console.error("Failed to fetch call details:", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCallClick = (callId: string) => {
    if (selectedCall === callId) {
      setSelectedCall(null);
      setCallDetails(null);
    } else {
      setSelectedCall(callId);
      fetchCallDetails(callId);
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchCalls(page);
    }
  };

  const formatDuration = (seconds: number) => {
    const finalSeconds = Math.floor(seconds/1000);
    const minutes = Math.floor(finalSeconds / 60);
    const remainingSeconds = finalSeconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} Minutes`;
  };

  useEffect(() => {
    if (botId) {
      fetchCalls();
    }
  }, [botId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Bot Calls</h1>
            <p className="text-black">Bot ID: {botId}</p>
          </div>
          <button
            onClick={() => router.back()}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold"
          >
            Back to Bots
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-black">Call History</h2>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-black">Loading calls...</div>
          ) : calls.length === 0 ? (
            <div className="p-6 text-center text-black">No calls found for this bot</div>
          ) : (
            <>
              <div className="divide-y">
                {calls.map((call) => (
                  <div key={call.call_id} className="p-6">
                    <div 
                      className="cursor-pointer hover:bg-gray-50 p-4 rounded-lg"
                      onClick={() => handleCallClick(call.call_id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="font-semibold text-lg text-black">Call ID: {call.call_id}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              call.call_status === 'ended' ? 'bg-green-100 text-green-800' :
                              call.call_status === 'failed' ? 'bg-red-100 text-red-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {call.call_status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p><span className="font-medium">Duration:</span> {formatDuration(call.duration_ms)}</p>
                            {call.from_number && (
                              <p><span className="font-medium">From:</span> {call.from_number}</p>
                            )}
                            {call.to_number && (
                              <p><span className="font-medium">To:</span> {call.to_number}</p>
                            )}
                          </div>
                          {call.call_analysis && (
                            <p className="text-sm text-gray-700 mt-2">
                              <span className="font-medium">Summary:</span> {call.call_analysis.summary}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedCall === call.call_id && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        {loadingDetails ? (
                          <div className="text-center text-gray-600">Loading call details...</div>
                        ) : callDetails ? (
                          <div className="space-y-3">
                            <h4 className="font-semibold text-black">Call Transcript</h4>
                            {callDetails.length > 0 ? (
                              <div className="max-h-96 overflow-y-auto space-y-3 border rounded-lg p-4 bg-white">
                                {callDetails.map((message, index) => (
                                  <div
                                    key={index}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                  >
                                    <div
                                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                        message.role === 'user'
                                          ? 'bg-blue-500 text-white'
                                          : 'bg-gray-200 text-black'
                                      }`}
                                    >
                                      <div className="text-xs font-semibold mb-1 opacity-75">
                                        {message.role === 'user' ? 'User' : 'Assistant'}
                                      </div>
                                      <div className="text-sm whitespace-pre-wrap">
                                        {message.log}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-500 italic">No transcript available</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center text-gray-600">Failed to load call details</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="p-6 border-t flex justify-center items-center space-x-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                  >
                    Previous
                  </button>
                  
                  <div className="flex space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-2 rounded-lg ${
                          page === currentPage
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
