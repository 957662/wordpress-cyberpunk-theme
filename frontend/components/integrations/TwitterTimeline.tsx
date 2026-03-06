'use client';

import React, { useEffect, useState } from 'react';
import { Twitter, MessageCircle, Heart, Repeat } from 'lucide-react';

interface Tweet {
  id: string;
  text: string;
  created_at: string;
  public_metrics: {
    like_count: number;
    retweet_count: number;
    reply_count: number;
  };
}

interface TwitterTimelineProps {
  username: string;
  maxTweets?: number;
  className?: string;
}

export default function TwitterTimeline({
  username,
  maxTweets = 5,
  className = '',
}: TwitterTimelineProps) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await fetch(`/api/integrations/twitter/${username}`);
        if (!response.ok) throw new Error('Failed to fetch tweets');
        const data = await response.json();
        setTweets(data.tweets.slice(0, maxTweets));
      } catch (err) {
        setError('Failed to load tweets');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [username, maxTweets]);

  if (loading) {
    return (
      <div className={`twitter-timeline ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Twitter className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Latest Tweets</h3>
        </div>
        <div className="space-y-3">
          {[...Array(maxTweets)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-900/50 rounded-lg p-4 h-32" />
          ))}
        </div>
      </div>
    );
  }

  if (error || tweets.length === 0) {
    return (
      <div className={`twitter-timeline ${className}`}>
        <div className="flex items-center gap-2 mb-4">
          <Twitter className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Latest Tweets</h3>
        </div>
        <div className="text-center py-8">
          <Twitter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">{error || 'No tweets found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`twitter-timeline ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Twitter className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Latest Tweets</h3>
      </div>

      <div className="space-y-3">
        {tweets.map((tweet) => (
          <a
            key={tweet.id}
            href={`https://twitter.com/${username}/status/${tweet.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-gray-900/50 border border-gray-700 rounded-lg hover:border-blue-400/50 transition-colors"
          >
            <p className="text-white text-sm mb-3">{tweet.text}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <MessageCircle className="w-3 h-3" />
                <span>{tweet.public_metrics.reply_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Repeat className="w-3 h-3" />
                <span>{tweet.public_metrics.retweet_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                <span>{tweet.public_metrics.like_count}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
