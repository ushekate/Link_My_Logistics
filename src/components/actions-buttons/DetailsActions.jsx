import React, { useEffect, useState } from 'react'
import { Popover } from '../ui/Popover'
import { Download, EllipsisVertical, Eye, Trash } from 'lucide-react'
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { downloadAllFilesAsZip, processFiles } from '@/utils/fileUtils';

export default function DetailsActions({
  row,
  redirectLink = '',
  EditForm,
  deleteItem,
  showEye = true,
  allowCustomers = false,
}) {
  const { user } = useAuth();
  const [files, setFiles] = useState([]);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // Wrapper function for downloadAllFilesAsZip utility
  const handleDownloadAllFiles = () => {
    downloadAllFilesAsZip(files, row.original, setIsDownloadingZip);
  };

  useEffect(() => {
    if (row.original.files && row.original.files.length > 0) {
      const fileObjects = processFiles(row.original.files, row.original);
      setFiles(fileObjects);
    }
  }, [row]);

  return (
    <Popover
      trigger={<EllipsisVertical className="w-4 h-4" />}
      className='w-[250px] p-6'
    >
      <h1 className='font-semibold text-lg p-2 text-left border-b border-foreground/30'>Actions</h1>
      {
        showEye && (
          <>
            <Link href={redirectLink}>
              <button
                className='flex items-center justify-between gap-2 p-4 w-full cursor-pointer'
              >
                <p>View Details</p>
                <Eye
                  size={18}
                  className="cursor-pointer"
                />
              </button>
            </Link>

            <button
              className='flex items-center justify-between gap-2 p-4 w-full cursor-pointer'
              onClick={handleDownloadAllFiles}
              disabled={isDownloadingZip}
            >
              {isDownloadingZip ? (
                <>
                  <p>Creating ZIP...</p>
                  <p className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></p>
                </>
              ) : (
                <>
                  <p>Download Zip ({files.length})</p>
                  <Download
                    size={18}
                    className="cursor-pointer"
                  />
                </>
              )}
            </button>
          </>
        )
      }

      {
        (user?.role === 'Root' || user?.role === 'Merchant' || allowCustomers) && (
          <>
            {EditForm && <EditForm info={row.original} />}

            <button
              className='flex items-center justify-between gap-2 p-4 w-full cursor-pointer'
              onClick={async () => {
                console.log('Delete details for', row.original.id);
                const confirmation = confirm('Are you sure you want to delete this entry?');
                if (confirmation) {
                  await deleteItem(row.original.id);
                }
              }}
            >
              <p>Delete Entry</p>
              <Trash
                size={18}
                className="cursor-pointer"
              />
            </button>
          </>
        )
      }
    </Popover>
  )
};
