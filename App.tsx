import { MusicPlayer } from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-600 p-4 sm:p-8 flex items-center justify-center relative overflow-hidden">
      {/* Windows 98 style desktop pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
            linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%), 
            linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%), 
            linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
          `,
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
        }}></div>
      </div>
      
      {/* Main content - simplified centering */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-4 text-white drop-shadow-lg" 
              style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            Winamp Classic
          </h1>
          <p className="text-cyan-100 text-base sm:text-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            It really whips the llama's ass! 🦙
          </p>
        </div>
        
        {/* Player container with perfect centering */}
        <div className="w-full flex justify-center">
          <MusicPlayer />
        </div>
        
        <div className="mt-4 sm:mt-8 text-center">
          <p className="text-cyan-200 text-xs sm:text-sm px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            Relive the golden age of digital music • Nullsoft Winamp v2.95
          </p>
          <p className="text-cyan-300 text-xs mt-2 px-4" style={{ fontFamily: 'Arial, sans-serif' }}>
            Tap PL to open playlist • Shuffle and Repeat available
          </p>
        </div>
      </div>

      {/* Decorative elements - hidden on mobile for cleaner look */}
      <div className="hidden sm:block absolute top-10 left-10 w-8 h-8 bg-white opacity-20 rotate-45"></div>
      <div className="hidden sm:block absolute bottom-10 right-10 w-6 h-6 bg-white opacity-20 rotate-12"></div>
      <div className="hidden sm:block absolute top-1/2 left-20 w-4 h-4 bg-yellow-300 opacity-30 rounded-full"></div>
      <div className="hidden sm:block absolute top-1/4 right-32 w-5 h-5 bg-pink-300 opacity-30 rounded-full"></div>
    </div>
  );
}