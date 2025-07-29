import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, SkipBack, SkipForward, Minus, X, Shuffle, Repeat, Search, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface Track {
  id: number;
  title: string;
  artist: string;
  duration: number;
  albumArt: string;
}

const mockPlaylist: Track[] = [
  {
    id: 1,
    title: "Take On Me",
    artist: "a-ha",
    duration: 225,
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 2,
    title: "Sweet Dreams (Are Made of This)",
    artist: "Eurythmics",
    duration: 216,
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
  },
  {
    id: 3,
    title: "Blue Monday",
    artist: "New Order",
    duration: 448,
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 4,
    title: "Don't Stop Believin'",
    artist: "Journey",
    duration: 251,
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
  },
  {
    id: 5,
    title: "Billie Jean",
    artist: "Michael Jackson",
    duration: 294,
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 6,
    title: "Hotel California",
    artist: "Eagles",
    duration: 391,
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
  },
  {
    id: 7,
    title: "Bohemian Rhapsody",
    artist: "Queen",
    duration: 355,
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
  },
  {
    id: 8,
    title: "Stairway to Heaven",
    artist: "Led Zeppelin",
    duration: 482,
    albumArt: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop"
  },
  {
    id: 9,
    title: "Imagine",
    artist: "John Lennon",
    duration: 183,
    albumArt: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300&fit=crop"
  },
  {
    id: 10,
    title: "Like a Rolling Stone",
    artist: "Bob Dylan",
    duration: 370,
    albumArt: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop"
  }
];

export function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState([70]);
  const [balance, setBalance] = useState([50]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playlist, setPlaylist] = useState(mockPlaylist);
  const intervalRef = useRef<NodeJS.Timeout>();
  const scrollRef = useRef<NodeJS.Timeout>();

  const currentTrack = playlist[currentTrackIndex];
  const trackDisplay = `${currentTrack?.artist || ''} - ${currentTrack?.title || ''}`;

  // Spectrum analyzer mock data
  const [spectrum, setSpectrum] = useState<number[]>(new Array(20).fill(0));

  // Filtered playlist for search
  const filteredPlaylist = playlist.filter(track =>
    track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    track.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.duration) {
            if (repeat) {
              return 0;
            } else {
              handleNext();
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);

      // Animate spectrum analyzer
      const spectrumInterval = setInterval(() => {
        setSpectrum(prev => prev.map(() => Math.random() * 100));
      }, 100);

      return () => clearInterval(spectrumInterval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setSpectrum(new Array(20).fill(0));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentTrack?.duration, repeat]);

  // Scrolling text effect
  useEffect(() => {
    const maxLength = window.innerWidth < 640 ? 15 : 25;
    if (trackDisplay.length > maxLength) {
      scrollRef.current = setInterval(() => {
        setScrollPosition(prev => (prev + 1) % (trackDisplay.length + 10));
      }, 200);
    } else {
      setScrollPosition(0);
    }

    return () => {
      if (scrollRef.current) {
        clearInterval(scrollRef.current);
      }
    };
  }, [trackDisplay]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleNext = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    }
    setCurrentTime(0);
  };

  const handlePrevious = () => {
    if (shuffle) {
      const randomIndex = Math.floor(Math.random() * playlist.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    }
    setCurrentTime(0);
  };

  const handleProgressChange = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScrolledText = () => {
    const maxLength = window.innerWidth < 640 ? 15 : 25;
    if (trackDisplay.length <= maxLength) return trackDisplay.padEnd(maxLength);
    const extended = trackDisplay + '    ';
    return (extended + extended).substring(scrollPosition, scrollPosition + maxLength);
  };

  const removeTrack = (trackId: number) => {
    const newPlaylist = playlist.filter(track => track.id !== trackId);
    setPlaylist(newPlaylist);
    
    // Adjust current track index if necessary
    if (currentTrackIndex >= newPlaylist.length) {
      setCurrentTrackIndex(Math.max(0, newPlaylist.length - 1));
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Main container with consistent centering */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4 w-full max-w-fit">
        {/* Main Winamp Window */}
        <div className="w-full max-w-[420px] lg:w-[420px] bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border-2 border-gray-500 shadow-xl">
          {/* Title Bar */}
          <div className="h-6 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-between px-2 border-b border-gray-600">
            <div className="text-white text-xs font-mono">Winamp 2.95</div>
            <div className="flex space-x-1">
              <button className="w-4 h-4 bg-gray-300 border border-gray-500 flex items-center justify-center hover:bg-gray-200">
                <Minus className="w-2 h-2" />
              </button>
              <button className="w-4 h-4 bg-gray-300 border border-gray-500 flex items-center justify-center hover:bg-gray-200">
                <X className="w-2 h-2" />
              </button>
            </div>
          </div>

          <div className="p-3">
            {/* Display Area */}
            <div className="bg-black border-2 border-gray-600 shadow-inner mb-3 p-2">
              <div className="bg-gray-900 border border-gray-700 p-2 mb-2">
                <div className="text-orange-400 font-mono text-sm leading-tight">
                  <div className="flex justify-between">
                    <span className="truncate">{getScrolledText()}</span>
                    <span className="text-orange-300 ml-2">{String(currentTrackIndex + 1).padStart(2, '0')}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>{currentTrack ? formatTime(currentTime) : '0:00'}</span>
                    <span>{currentTrack ? formatTime(currentTrack.duration) : '0:00'}</span>
                  </div>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-2">
                <Slider
                  value={[currentTime]}
                  max={currentTrack?.duration || 100}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="w-full"
                />
              </div>

              {/* Spectrum Analyzer */}
              <div className="flex items-end justify-center space-x-0.5 h-12 bg-black border border-gray-700 p-1">
                {spectrum.map((height, index) => (
                  <div
                    key={index}
                    className="w-2 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 transition-all duration-100"
                    style={{ height: `${Math.max(2, height * 0.4)}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-2 mb-3 justify-center">
              <Button
                onClick={handlePrevious}
                size="sm"
                className="w-8 h-8 bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400 border border-gray-600 shadow"
              >
                <SkipBack className="h-3 w-3 text-black" />
              </Button>
              
              <Button
                onClick={handlePlayPause}
                size="sm"
                className="w-10 h-8 bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400 border border-gray-600 shadow"
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 text-black" />
                ) : (
                  <Play className="h-4 w-4 text-black" />
                )}
              </Button>

              <Button
                onClick={handleStop}
                size="sm"
                className="w-8 h-8 bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400 border border-gray-600 shadow"
              >
                <Square className="h-3 w-3 text-black" />
              </Button>
              
              <Button
                onClick={handleNext}
                size="sm"
                className="w-8 h-8 bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400 border border-gray-600 shadow"
              >
                <SkipForward className="h-3 w-3 text-black" />
              </Button>

              <div className="hidden sm:block flex-1" />

              <Button
                onClick={() => setShuffle(!shuffle)}
                size="sm"
                className={`w-8 h-8 border border-gray-600 shadow ${
                  shuffle 
                    ? 'bg-gradient-to-b from-orange-300 to-orange-500 hover:from-orange-200 hover:to-orange-400' 
                    : 'bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400'
                }`}
              >
                <Shuffle className="h-3 w-3 text-black" />
              </Button>

              <Button
                onClick={() => setRepeat(!repeat)}
                size="sm"
                className={`w-8 h-8 border border-gray-600 shadow ${
                  repeat 
                    ? 'bg-gradient-to-b from-orange-300 to-orange-500 hover:from-orange-200 hover:to-orange-400'
                    : 'bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400'
                }`}
              >
                <Repeat className="h-3 w-3 text-black" />
              </Button>

              <Button
                onClick={() => setShowPlaylist(!showPlaylist)}
                size="sm"
                className="px-3 h-8 bg-gradient-to-b from-gray-300 to-gray-500 hover:from-gray-200 hover:to-gray-400 border border-gray-600 shadow text-xs text-black"
              >
                PL
              </Button>
            </div>

            {/* Volume and Balance */}
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-gray-700 font-mono min-w-[2rem]">VOL</span>
                <div className="flex-1 sm:w-24">
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                    className="w-full"
                  />
                </div>
                <span className="text-xs text-gray-700 font-mono w-8">{volume[0]}</span>
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-gray-700 font-mono min-w-[2rem]">BAL</span>
                <div className="flex-1 sm:w-24">
                  <Slider
                    value={balance}
                    max={100}
                    step={1}
                    onValueChange={setBalance}
                    className="w-full"
                  />
                </div>
                <span className="text-xs text-gray-700 font-mono w-8">{balance[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Playlist Window */}
        {showPlaylist && (
          <Card className="w-full max-w-[420px] lg:w-[420px] bg-gradient-to-b from-gray-200 via-gray-300 to-gray-400 border-2 border-gray-500 shadow-xl">
            <div className="h-6 bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-between px-2 border-b border-gray-600">
              <div className="text-white text-xs font-mono">Winamp Playlist Editor</div>
              <button 
                onClick={() => setShowPlaylist(false)}
                className="w-4 h-4 bg-gray-300 border border-gray-500 flex items-center justify-center hover:bg-gray-200"
              >
                <X className="w-2 h-2" />
              </button>
            </div>
            
            <div className="p-3">
              {/* Search */}
              <div className="mb-3 flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-600" />
                <Input
                  type="text"
                  placeholder="Search tracks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 text-sm bg-white border-gray-400"
                />
              </div>

              {/* Playlist Controls */}
              <div className="mb-3 flex items-center justify-between">
                <div className="flex space-x-1">
                  <Button
                    onClick={() => setShuffle(!shuffle)}
                    size="sm"
                    variant={shuffle ? "default" : "outline"}
                    className="h-6 px-2 text-xs"
                  >
                    <Shuffle className="h-3 w-3 mr-1" />
                    Shuffle
                  </Button>
                  <Button
                    onClick={() => setRepeat(!repeat)}
                    size="sm"
                    variant={repeat ? "default" : "outline"}
                    className="h-6 px-2 text-xs"
                  >
                    <Repeat className="h-3 w-3 mr-1" />
                    Repeat
                  </Button>
                </div>
              </div>

              {/* Playlist */}
              <div className="bg-white border-2 border-gray-600 shadow-inner max-h-80 overflow-y-auto">
                {filteredPlaylist.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm font-mono">
                    No tracks found
                  </div>
                ) : (
                  filteredPlaylist.map((track, index) => {
                    const actualIndex = playlist.findIndex(t => t.id === track.id);
                    return (
                      <div
                        key={track.id}
                        className={`flex items-center group hover:bg-blue-100 transition-colors ${
                          actualIndex === currentTrackIndex 
                            ? 'bg-blue-500 text-white' 
                            : 'text-black'
                        }`}
                      >
                        <button
                          onClick={() => {
                            setCurrentTrackIndex(actualIndex);
                            setCurrentTime(0);
                          }}
                          className="flex-1 text-left p-2 text-sm font-mono"
                        >
                          <div className="flex items-center space-x-2">
                            <img 
                              src={track.albumArt} 
                              alt={track.title}
                              className="w-8 h-8 rounded object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="truncate">
                                {actualIndex + 1}. {track.title}
                              </div>
                              <div className="text-xs opacity-75 truncate">
                                {track.artist} • {formatTime(track.duration)}
                              </div>
                            </div>
                          </div>
                        </button>
                        <button
                          onClick={() => removeTrack(track.id)}
                          className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              
              <div className="mt-2 text-xs font-mono text-gray-700 flex justify-between">
                <span>{playlist.length} files</span>
                <span>{formatTime(playlist.reduce((acc, track) => acc + track.duration, 0))}</span>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}