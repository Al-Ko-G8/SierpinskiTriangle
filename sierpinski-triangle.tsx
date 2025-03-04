"use client"

import { useState, useRef } from "react"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

export default function SierpinskiTriangle() {
  const [depth, setDepth] = useState(5)
  const [zoomHistory, setZoomHistory] = useState<TriangleProps[]>([])
  const [zoomLevel, setZoomLevel] = useState(1)
  const [currentView, setCurrentView] = useState<TriangleProps>({
    x1: 0,
    y1: 1000,
    x2: 500,
    y2: 0,
    x3: 1000,
    y3: 1000,
    depth: 0,
  })

  const size = 600
  const height = (Math.sqrt(3) / 2) * size
  const svgRef = useRef<SVGSVGElement>(null)
  const MAX_ZOOM = 10
  const MIN_ZOOM = 1
  const ZOOM_FACTOR = 1.5

  const handleZoomIn = (triangle: TriangleProps) => {
    setZoomHistory([...zoomHistory, currentView])
    setCurrentView(triangle)
  }

  const handleZoomOut = () => {
    if (zoomHistory.length > 0) {
      const previousView = zoomHistory[zoomHistory.length - 1]
      setCurrentView(previousView)
      setZoomHistory(zoomHistory.slice(0, -1))
    }
  }

  const resetZoom = () => {
    setZoomHistory([])
    setZoomLevel(1)
    setCurrentView({
      x1: 0,
      y1: 1000,
      x2: 500,
      y2: 0,
      x3: 1000,
      y3: 1000,
      depth: 0,
    })
  }

  const handleManualZoomIn = () => {
    if (zoomLevel < MAX_ZOOM) {
      setZoomLevel((prev) => prev * ZOOM_FACTOR)
    }
  }

  const handleManualZoomOut = () => {
    if (zoomLevel > MIN_ZOOM) {
      setZoomLevel((prev) => prev / ZOOM_FACTOR)
    }
  }

  // Calculate center point of current view
  const centerX = (currentView.x1 + currentView.x2 + currentView.x3) / 3
  const centerY = (currentView.y1 + currentView.y2 + currentView.y3) / 3

  // Calculate the viewBox based on the current view and zoom level
  const width = (currentView.x3 - currentView.x1) / zoomLevel
  const height = (currentView.y1 - currentView.y2) / zoomLevel
  const viewBoxX = centerX - width / 2
  const viewBoxY = centerY - height / 2
  const viewBox = `${viewBoxX} ${viewBoxY} ${width} ${height}`

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-8">
      <h1 className="text-3xl font-bold">Sierpiński Triangle</h1>

      <div className="w-full max-w-md">
        <div className="flex justify-between mb-2">
          <span>Recursion Depth: {depth}</span>
        </div>
        <Slider value={[depth]} min={0} max={8} step={1} onValueChange={(value) => setDepth(value[0])} />
      </div>

      <div className="border rounded-lg p-4 bg-white relative">
        <svg ref={svgRef} width={size} height={size * 0.866} viewBox={viewBox} preserveAspectRatio="xMidYMid meet">
          <SierpinskiRecursive
            x1={0}
            y1={1000}
            x2={500}
            y2={0}
            x3={1000}
            y3={1000}
            depth={depth}
            currentDepth={0}
            onZoomIn={handleZoomIn}
            isZoomable={true}
          />
        </svg>

        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleManualZoomIn}
            disabled={zoomLevel >= MAX_ZOOM}
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleManualZoomOut}
            disabled={zoomLevel <= MIN_ZOOM}
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          {(zoomLevel > 1 || zoomHistory.length > 0) && (
            <Button variant="outline" size="icon" onClick={resetZoom} title="Reset View">
              <RotateCcw className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="absolute bottom-4 right-4 text-sm text-muted-foreground">Zoom: {zoomLevel.toFixed(1)}x</div>
      </div>

      <div className="max-w-lg text-center text-sm text-muted-foreground">
        <p className="mb-2">
          <strong>
            Click on any triangle to focus on it, or use the zoom buttons to explore the fractal. The reset button will
            return to the original view.
          </strong>
        </p>
        <p>
          The Sierpiński triangle is a fractal with the shape of an equilateral triangle, subdivided recursively into
          smaller equilateral triangles. It was named after Polish mathematician Wacław Sierpiński.
        </p>
      </div>
    </div>
  )
}

interface TriangleProps {
  x1: number
  y1: number
  x2: number
  y2: number
  x3: number
  y3: number
  depth: number
  currentDepth?: number
  onZoomIn?: (triangle: TriangleProps) => void
  isZoomable?: boolean
}

function SierpinskiRecursive({
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  depth,
  currentDepth = 0,
  onZoomIn,
  isZoomable = false,
}: TriangleProps) {
  const handleClick = () => {
    if (onZoomIn && isZoomable) {
      onZoomIn({ x1, y1, x2, y2, x3, y3, depth: currentDepth })
    }
  }

  if (currentDepth === depth) {
    return (
      <polygon
        points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
        fill="currentColor"
        className={`text-primary ${isZoomable ? "cursor-pointer hover:text-primary/80" : ""}`}
        onClick={handleClick}
      />
    )
  }

  const x12 = (x1 + x2) / 2
  const y12 = (y1 + y2) / 2

  const x23 = (x2 + x3) / 2
  const y23 = (y2 + y3) / 2

  const x31 = (x3 + x1) / 2
  const y31 = (y3 + y1) / 2

  return (
    <>
      <SierpinskiRecursive
        x1={x1}
        y1={y1}
        x2={x12}
        y2={y12}
        x3={x31}
        y3={y31}
        depth={depth}
        currentDepth={currentDepth + 1}
        onZoomIn={onZoomIn}
        isZoomable={isZoomable}
      />
      <SierpinskiRecursive
        x1={x12}
        y1={y12}
        x2={x2}
        y2={y2}
        x3={x23}
        y3={y23}
        depth={depth}
        currentDepth={currentDepth + 1}
        onZoomIn={onZoomIn}
        isZoomable={isZoomable}
      />
      <SierpinskiRecursive
        x1={x31}
        y1={y31}
        x2={x23}
        y2={y23}
        x3={x3}
        y3={y3}
        depth={depth}
        currentDepth={currentDepth + 1}
        onZoomIn={onZoomIn}
        isZoomable={isZoomable}
      />
    </>
  )
}

