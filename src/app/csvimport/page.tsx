'use client';
import { CSVBoxButton } from '@csvbox/react'
import { useState } from 'react';
export default function CsvImport() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [responseClass, setResponseClass] = useState<string>('text-green-600');
  const csvboxKey = process.env.NEXT_PUBLIC_CSV_BOX_LICENSE_KEY as string;
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {/* <h1>CSV Importer</h1> */}
      <div className="mt-6 flex max-w-md gap-x-4">
          <CSVBoxButton
            licenseKey={csvboxKey}
            user={{
              user_id: process.env.CSV_BOX_USER_ID
            }}
            options={{
              max_rows: 5000,
            }}
            onImport={(result: boolean, data: any) => 
            {
              if (result) {
                console.log("success");
                setResponseClass('text-green-600');
                setApiResponse(data.row_success + " rows uploaded");
                console.log(data.row_success + " rows uploaded");
              } 
              else 
              {
                setResponseClass('text-red-600');
                setApiResponse("Failed to Import" );
                console.log("fail");
              }
            }}
            render={(launch: any, isLoading: boolean) => {
              return <button  className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500" 
              onClick={launch}> {isLoading ? 'loading...' : 'Upload Product CSV'}</button>;
            }}
          >
            Import
          </CSVBoxButton>
      </div>
      {apiResponse && <p className={responseClass}>{apiResponse}</p>}
    </main>
  );
}
