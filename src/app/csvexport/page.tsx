'use client';
import { useState, useCallback, ChangeEvent } from "react";

export default function CsvExport() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [responseClass, setResponseClass] = useState<string>('text-green-600');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL as string;

  const fetchData = useCallback(async () => {
    if (!email || emailError) return;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        const data: string = await response.text();
        setResponseClass('text-green-600');
        setApiResponse(data);
      } else {
        setResponseClass('text-red-600');
        setApiResponse('An error occurred during export.');
      }
    } catch (error) {
      console.error(error);
      setResponseClass('text-red-600');
      setApiResponse('An error occurred during export.');
    }
  }, [email, emailError, apiUrl]);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const newEmail = event.target.value;
    setEmail(newEmail);
    if (newEmail && !validateEmail(newEmail)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError(null);
    }
  };

  const validateEmail = (email: string): boolean => {
    const AT_INDEX = email.indexOf('@');
    const DOT_INDEX = email.lastIndexOf('.');

    return (
      email.length >= 3 &&
      email.charCodeAt(0) <= 127 &&
      email.charCodeAt(email.length - 1) !== 64 &&
      AT_INDEX > 0 &&
      AT_INDEX !== email.length - 1 &&
      DOT_INDEX > AT_INDEX &&
      DOT_INDEX < email.length - 1
    );
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="mt-6 flex max-w-md gap-x-4">
        <label htmlFor="email-address" className="sr-only">
          Email address
        </label>
        <input
          id="email-address"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-80 min-w-4 flex-auto rounded-md border-2 border-slate-900 bg-white/5 px-3.5 py-2 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
          placeholder="Enter your email"
          value={email}
          onChange={handleEmailChange}
        />
        <button
          type="button"
          onClick={fetchData}
          className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Export Products
        </button>
      </div>
      {emailError && <p className="text-red-600">{emailError}</p>}
      {apiResponse && <p className={responseClass}>{apiResponse}</p>}
    </main>
  );
}
