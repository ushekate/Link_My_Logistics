'use client';

import React, { useEffect, useState } from 'react';
import { Download, Archive } from 'lucide-react';
import { useCollection } from '@/hooks/useCollection';
import {
  getFileIcon,
  downloadFile,
  downloadAllFilesAsZip,
  processFiles
} from '@/utils/fileUtils';
import Button from '@/components/ui/Button';

export default function CustomWarehouseServiceRequestView({ requestId }) {
  const { data: requests, isLoading } = useCollection('custom_warehouse_service_requests', {
    expand: 'order,order.provider,serviceType,merchantVerifiedBy,golVerifiedBy,user',
    filter: `id="${requestId}"`,
  });
  const [files, setFiles] = useState([]);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Wrapper function for downloadFile utility
  const handleDownloadFile = (filename) => {
    downloadFile(filename, request);
  };

  // Wrapper function for downloadAllFilesAsZip utility
  const handleDownloadAllFiles = () => {
    downloadAllFilesAsZip(files, request, setIsDownloadingZip);
  };

  useEffect(() => {
    // confirming the Orders Array and setting up files Array
    if (requests && Array.isArray(requests) && requests.length > 0) {
      const request = requests?.[0];
      if (request.files && request.files.length > 0) {
        const fileObjects = processFiles(request.files, request);
        setFiles(fileObjects);
      }
    } else {
      console.log('Error getting files from server');
    }
  }, [requests]);

  // Once again verifing The Orders Array is comming with single index
  const request = requests?.[0];

  // Loading State
  if (isLoading)
    return <div className="p-8 text-[color:var(--secondary)] text-center">Loading request details...</div>;
  if (!request)
    return <div className="p-8 text-red-600 text-center">Request not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header with Gradient */}
        <div className="bg-primary rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Request Details</h1>
              <p className="text-blue-100 text-lg">
                Request ID: <span className="font-mono bg-white/20 px-3 py-1 rounded-lg">{request.id}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {request.status}
              </div>
              {/* Download All Files Button */}
              {Array.isArray(files) && files.length > 0 && (
                <Button
                  onClick={handleDownloadAllFiles}
                  disabled={isDownloadingZip}
                  variant={'outline-invert'}
                  title={isDownloadingZip ? 'Creating ZIP...' : `Download Zip (${files.length})`}
                  icon={
                    isDownloadingZip ? (
                      <p className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></p>
                    ) : (
                      <Archive size={18} />
                    )
                  }
                  className='rounded-lg'
                />
              )}
            </div>
          </div>
        </div>

        {/* Modern Order Summary Cards */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-4"></div>
            Request Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-blue-600 mb-1">Service Type</div>
              <div className="text-lg font-bold text-gray-900">{request.expand?.serviceType?.title || 'N/A'}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-purple-600 mb-1">Submitted By</div>
              <div className="text-lg font-bold text-gray-900">{request.expand?.user?.name || 'N/A'}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-green-600 mb-1">Client Verified</div>
              <div className="text-lg font-bold text-gray-900">{request?.merchantVerified ? 'Yes' : 'No'}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-orange-600 mb-1">Submitted On</div>
              <div className="text-lg font-bold text-gray-900">{new Date(request.created).toLocaleString() || 'N/A'}</div>
            </div>
          </div>
          {request?.customerRemarks && (
            <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2">Customer Remarks</div>
              <div className="text-gray-900 leading-relaxed">{request.customerRemarks}</div>
            </div>
          )}
          {request.clientReason && (
            <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2">Rejection Reason</div>
              <div className="text-gray-900 leading-relaxed">{order.clientReason}</div>
            </div>
          )}
        </div>

        {/* Modern Order Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full mr-4"></div>
            Order Summary
          </h2>
          {request.expand?.order ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-blue-600 mb-1">IGM No</div>
                <div className="text-lg font-bold text-gray-900">{request.expand?.order?.igmNo || 'N/A'}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-purple-600 mb-1">Item No.</div>
                <div className="text-lg font-bold text-gray-900">{request.expand?.order?.itemNo || 'N/A'}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-green-600 mb-1">BL No</div>
                <div className="text-lg font-bold text-gray-900">{request.expand?.order?.blNo || 'N/A'}</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-orange-600 mb-1">Consignee Name</div>
                <div className="text-lg font-bold text-gray-900">{request.expand?.order?.consigneeName || 'N/A'}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-indigo-600 mb-1">CHA Name</div>
                <div className="text-lg font-bold text-gray-900">{request.expand?.order?.chaName || 'N/A'}</div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="text-gray-400 text-lg">No Order information available</div>
            </div>
          )}
        </div>


        {/* Modern Files Section */}
        {Array.isArray(files) && files.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full mr-4"></div>
              Attached Files
              <span className="ml-3 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file, index) => {
                const IconComponent = getFileIcon(file.filename);
                const fileExtension = file.filename.split('.').pop()?.toLowerCase();

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden rounded-2xl shadow-md border border-gray-200 bg-white hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    {file.type === 'image' ? (
                      // Modern image display
                      <div className="relative">
                        <div className="aspect-square overflow-hidden">
                          <img
                            src={file.url}
                            alt={file.filename}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <p className="text-sm font-medium truncate" title={file.filename}>
                            {file.filename}
                          </p>
                          <p className="text-xs text-gray-300 uppercase">{fileExtension}</p>
                        </div>
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={() => handleDownloadFile(file.filename)}
                            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
                          >
                            <Download size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Modern document display
                      <div className="aspect-square flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent size={32} className="text-white" />
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1 truncate w-full" title={file.filename}>
                          {file.filename.length > 20 ? `${file.filename.substring(0, 20)}...` : file.filename}
                        </p>
                        <p className="text-xs text-gray-500 uppercase mb-4 font-medium">{fileExtension}</p>
                        <button
                          onClick={() => handleDownloadFile(file.filename)}
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl"
                        >
                          <Download size={16} />
                          Download
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
