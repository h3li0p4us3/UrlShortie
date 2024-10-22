"use client"
import { useState, useEffect } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  interface UrlData {
    full: string;
    short: string;
  }

  const [recentUrls, setRecentUrls] = useState<UrlData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchRecentUrls = async () => {
      try {
        const response = await fetch("http://localhost:3301/api/recent-urls");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        setRecentUrls(data as UrlData[]);
      } catch (error) {
        console.error('Error fetching recent URLs:', error);
      }
    };

    fetchRecentUrls();
  }, []);

  const handleShorten = async () => {
    if (!url) {
      return;
    }
    console.log(url);
    const response = await fetch("http://localhost:3301/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: url }),
    });

    const data = await response.json();
    setShortUrl(data.short as string);

    // Fetch the updated list of recent URLs
    const recentResponse = await fetch("http://localhost:3301/api/recent-urls");
    const recentData = await recentResponse.json();
    setRecentUrls(recentData as UrlData[]);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUrls = recentUrls.slice(startIndex, endIndex);
  const totalPages = Math.ceil(recentUrls.length / itemsPerPage);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
      <h1 className="text-4xl font-bold mb-8 text-primary">UrlShortie</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          className="w-full p-3 border border-border rounded mb-4 text-input"
          placeholder="Enter your URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{ color: 'black' }}
        />
        <button
          className="w-full p-3 bg-button text-buttonText rounded"
          onClick={handleShorten}
        >
          Shorten URL
        </button>
      </div>
      {shortUrl && (
        <div className="mt-4 p-3 bg-card border border-border rounded">
            <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(`${process.env.ADDRESS || 'http://localhost:3301/'}${shortUrl}`);
              alert('The Short URL is copied to your clipboard!');
            }}
            className="text-link"
            >
            {`${process.env.ADDRESS || 'http://localhost:3301/'}${shortUrl}`}
            </a>
        </div>
      )}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-primary">Recent Shortened URLs</h2>
        <ul>
          {currentUrls.map((item, index) => (
            <li key={index} className="mb-2 p-3 bg-card border border-border rounded">
              <p className="text-sm text-secondary">Full URL: {item.full}</p>
                <a
                  href="/"
                  onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(`${process.env.ADDRESS || 'http://localhost:3301/'}${item.short}`);
                  alert('The Short URL is copied to your clipboard!');
                  }}
                  className="text-sm text-link"
                >
                  {`${process.env.ADDRESS || 'http://localhost:3301/'}${item.short}`}
                </a>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-primary text-white' : 'bg-button text-buttonText'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
