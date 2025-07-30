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

export default function CFSOrderView({ orderId }) {
  const { data: orders, isLoading } = useCollection('cfs_orders', {
    expand: 'containers,cfs',
    filter: `id="${orderId}"`,
  });
  const [files, setFiles] = useState([]);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Wrapper function for downloadFile utility
  const handleDownloadFile = (filename) => {
    downloadFile(filename, order);
  };

  // Wrapper function for downloadAllFilesAsZip utility
  const handleDownloadAllFiles = () => {
    downloadAllFilesAsZip(files, order, setIsDownloadingZip);
  };

  useEffect(() => {
    // confirming the Orders Array and setting up files Array
    if (orders && Array.isArray(orders) && orders.length > 0) {
      const order = orders?.[0];
      if (order.files && order.files.length > 0) {
        const fileObjects = processFiles(order.files, order);
        setFiles(fileObjects);
      }
    } else {
      console.log('Error getting files from server');
    }
  }, [orders]);

  // Once again verifing The Orders Array is comming with single index
  const order = orders?.[0];

  // Loading State
  if (isLoading)
    return <div className="p-8 text-[color:var(--secondary)] text-center">Loading order details...</div>;
  if (!order)
    return <div className="p-8 text-red-600 text-center">Order not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Modern Header with Gradient */}
        <div className="bg-primary rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Order Details</h1>
              <p className="text-blue-100 text-lg">
                Order ID: <span className="font-mono bg-white/20 px-3 py-1 rounded-lg">{order.id}</span>
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center gap-4">
              <div className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                {order.status}
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
            Order Summary
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-blue-600 mb-1">IGM No</div>
              <div className="text-lg font-bold text-gray-900">{order.igmNo || 'N/A'}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-purple-600 mb-1">Item No.</div>
              <div className="text-lg font-bold text-gray-900">{order.itemNo || 'N/A'}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-green-600 mb-1">BL No</div>
              <div className="text-lg font-bold text-gray-900">{order.blNo || 'N/A'}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border border-orange-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-orange-600 mb-1">Consignee Name</div>
              <div className="text-lg font-bold text-gray-900">{order.consigneeName || 'N/A'}</div>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-300">
              <div className="text-sm font-medium text-indigo-600 mb-1">CHA Name</div>
              <div className="text-lg font-bold text-gray-900">{order.chaName || 'N/A'}</div>
            </div>
          </div>
          {order.orderDescription && (
            <div className="mt-6 bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
              <div className="text-sm font-medium text-gray-600 mb-2">Description</div>
              <div className="text-gray-900 leading-relaxed">{order.orderDescription}</div>
            </div>
          )}
        </div>

        {/* Modern CFS Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-teal-500 rounded-full mr-4"></div>
            CFS Information
          </h2>
          {order.expand?.cfs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-emerald-600 mb-1">Title</div>
                <div className="text-lg font-bold text-gray-900">{order.expand.cfs.title}</div>
              </div>
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl border border-teal-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-teal-600 mb-1">Location</div>
                <div className="text-lg font-bold text-gray-900">{order.expand.cfs.location}</div>
              </div>
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 p-6 rounded-xl border border-cyan-200 hover:shadow-md transition-all duration-300">
                <div className="text-sm font-medium text-cyan-600 mb-1">Contact</div>
                <div className="text-lg font-bold text-gray-900">{order.expand.cfs.contact}</div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="text-gray-400 text-lg">No CFS information available</div>
            </div>
          )}
        </div>

        {/* Modern Containers Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-red-500 rounded-full mr-4"></div>
            Containers
          </h2>
          {Array.isArray(order.expand?.containers) && order.expand.containers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {order.expand.containers.map((container, index) => (
                <div
                  key={container.id}
                  className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-6 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                    <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      {container.status}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Container No</div>
                      <div className="text-lg font-bold text-gray-900 font-mono">{container.containerNo}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Size</div>
                        <div className="text-sm font-semibold text-gray-700">{container.size}</div>
                      </div>
                      <div>
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Cargo Type</div>
                        <div className="text-sm font-semibold text-gray-700">{container.cargoType}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
              <div className="text-gray-400 text-lg">No container data found</div>
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
