"use client"

import { useEffect, useRef, useState } from "react"

interface VideoPlayerProps {
  videoId: string
}

export default function VideoPlayer({ videoId }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleLoad = () => {
      setIsLoaded(true)
    }

    const handleError = () => {
      setHasError(true)
    }

    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener("load", handleLoad)
      iframe.addEventListener("error", handleError)
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleLoad)
        iframe.removeEventListener("error", handleError)
      }
    }
  }, [videoId])

  return (
    <div className="relative w-full aspect-video">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center p-4">
            <p className="text-destructive font-medium mb-2">Failed to load video</p>
            <p className="text-sm text-muted-foreground">Please try again later</p>
          </div>
        </div>
      )}

      <iframe
        ref={iframeRef}
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
  )
}
