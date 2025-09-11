import { useState } from "react";
import './App.css'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import Girlfriend from './components/Girlfriend';
import GfList from './components/GfList';
import { useEffect } from "react";
import DotGrid from "./components/DotGrid";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);

  // Persist selectedImage in localStorage
  // Load from localStorage on mount

  useEffect(() => {
    const savedImage = localStorage.getItem("selectedImage");
    if (savedImage) {
      setSelectedImage(savedImage);
    }
  }, []);

  useEffect(() => {
    if (selectedImage) {
      localStorage.setItem("selectedImage", selectedImage);
    } else {
      localStorage.removeItem("selectedImage");
    }
  }, [selectedImage]);

  return (
    <header>
      <SignedOut>
        <div style={{ width: '100%', height: '100vh', position: 'relative' }}>
          <DotGrid
            dotSize={5}
            gap={20}
            baseColor="#271E37"
            activeColor="#5227FF"
            proximity={120}
            shockRadius={250}
            shockStrength={5}
            resistance={750}
            returnDuration={1.5}
          />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="container">
          <div className="gf-navbar">
            <UserButton />
            <button
              style={{ marginTop: "16px", padding: "8px 16px", cursor: "pointer" }}
              onClick={() => setSelectedImage(null)}
            >
              Change
            </button>
          </div>
          <div>
            {!selectedImage ? (
              <div className="gf-list">
                <GfList
                  radius={300}
                  damping={0.45}
                  fadeOut={0.6}
                  ease="power3.out"
                  onSelectImage={setSelectedImage}
                />
              </div>
            ) : (
              <>
                <Girlfriend image={selectedImage} />
              </>
            )}
          </div>
        </div>
      </SignedIn>
    </header>
  )
}


export default App
