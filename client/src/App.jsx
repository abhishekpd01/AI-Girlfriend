import { useState } from "react";
import './App.css'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Girlfriend from './components/Girlfriend';
import GfList from './components/GfList';
import { useEffect } from "react";

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
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <div style={{ maxHeight: "100vh", maxWidth: "-webkit-fill-available", display: "grid", justifyContent: "space-evenly" }} >
          <div style={{ margin: "5px", marginTop: "-10px", padding: "5px", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }} >
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
              <div style={{ height: "100vh", position: "relative", maxWidth: "100vw", transition: "all 0.3s ease-in-out" }} >
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
