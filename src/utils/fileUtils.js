import { FileText, Image as ImageIcon, File } from 'lucide-react';
import JSZip from 'jszip';
import { toast } from 'sonner';
import pbclient from '@/lib/db';

/**
 * Determines the file type based on file extension
 * @param {string} filename - The filename to analyze
 * @returns {string} - 'image', 'document', or 'other'
 */
export const getFileType = (filename) => {
  const extension = filename.split('.').pop()?.toLowerCase();
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
  const documentExtensions = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx'];

  if (imageExtensions.includes(extension)) return 'image';
  if (documentExtensions.includes(extension)) return 'document';
  return 'other';
};

/**
 * Returns the appropriate icon component for a file based on its type
 * @param {string} filename - The filename to analyze
 * @returns {React.Component} - Lucide icon component
 */
export const getFileIcon = (filename) => {
  const fileType = getFileType(filename);

  switch (fileType) {
    case 'image':
      return ImageIcon;
    case 'document':
      return FileText;
    default:
      return File;
  }
};

/**
 * Downloads a single file
 * @param {string} filename - The filename to download
 * @param {Object} order - The order object containing file data
 */
export const downloadFile = (filename, order) => {
  if (!order) {
    toast.error('Order data not available');
    return;
  }

  try {
    const url = pbclient.files.getURL(order, filename);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${filename}`);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error(`Failed to download ${filename}`);
  }
};

/**
 * Downloads all files as a ZIP archive
 * @param {Array} files - Array of file objects with url and filename properties
 * @param {Object} order - The order object for naming the ZIP file
 * @param {Function} setIsDownloadingZip - State setter for loading state
 */
export const downloadAllFilesAsZip = async (files, order, setIsDownloadingZip) => {
  if (!order || !files || files.length === 0) {
    toast.error('No files available to download');
    return;
  }

  try {
    setIsDownloadingZip(true);
    toast.info('Creating ZIP file... Please wait');

    const zip = new JSZip();
    let successCount = 0;
    let failCount = 0;

    // Fetch all files and add them to the zip
    const filePromises = files.map(async (file) => {
      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        zip.file(file.filename, blob);
        successCount++;
      } catch (error) {
        console.error(`Error fetching file ${file.filename}:`, error);
        failCount++;
      }
    });

    await Promise.all(filePromises);

    if (successCount === 0) {
      toast.error('Failed to download any files. Please try again.');
      return;
    }

    if (failCount > 0) {
      toast.warning(`${failCount} file(s) could not be included in the ZIP`);
    }

    // Generate the zip file
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 }
    });

    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(zipBlob);
    link.download = `${order.id}-files.zip`;
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the object URL
    URL.revokeObjectURL(link.href);

    toast.success(`ZIP file downloaded successfully! (${successCount} files included)`);
  } catch (error) {
    console.error('Error creating zip file:', error);
    toast.error('Failed to create ZIP file. Please try again.');
  } finally {
    setIsDownloadingZip(false);
  }
};

/**
 * Processes files array to include type information
 * @param {Array} fileList - Array of filenames
 * @param {Object} order - Order object for generating URLs
 * @returns {Array} - Array of file objects with url, filename, and type properties
 */
export const processFiles = (fileList, order) => {
  if (!Array.isArray(fileList) || !order) return [];

  return fileList.map(filename => ({
    filename,
    url: pbclient.files.getURL(order, filename),
    type: getFileType(filename)
  }));
};
