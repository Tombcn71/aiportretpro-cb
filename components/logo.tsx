import Link from "next/link"
import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "default" | "white" | "dark"
  showText?: boolean
}

export function Logo({ size = "md", variant = "default", showText = true }: LogoProps) {
  const sizeClasses = {
    sm: "h-5 w-5",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-md",
    lg: "text-lg",
  }

  return (
    <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
      {/* Your exact logo image */}
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <Image
          src="/images/logo-icon.png"
          alt="AI Portret Pro Logo"
          width={40}
          height={40}
          className="w-full h-full object-contain"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]}  text-black leading-tight`}>AiPortretPro</span>
          {size === "lg" && (
            <span className="text-xs text-gray-500 font-medium tracking-wide">PROFESSIONELE HEADSHOTS</span>
          )}
        </div>
      )}
    </Link>
  )
}

// EXACT LinkedIn-style logo zoals in de afbeelding
export function LinkedInStyleLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const boxSizes = {
    sm: "w-5 h-5 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base",
  }

  return (
    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
      <div className="flex items-center">
        {/* AI Portrait tekst in LinkedIn blauw */}
        <span className={`${textSizes[size]} font-bold text-[#0A66C2] tracking-tight`}>AI Portrait</span>

        {/* PRO in blauw vierkant zoals LinkedIn "in" */}
        <div
          className={`${boxSizes[size]} bg-[#0A66C2] text-white font-bold rounded-sm flex items-center justify-center ml-1 shadow-sm`}
        >
          PRO
        </div>
      </div>
    </Link>
  )
}

// Main Logo - Using your exact image with closer spacing
export function LightningLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const containerSizes = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  }

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-6",
    lg: "w-9 h-9",
  }

  const textSizes = {
    sm: "text-xs",
    md: "text-xl",
    lg: "text-2xl",
  }

  return (
    <Link
      href="/"
      className={`flex items-center space-x-2 hover:opacity-80 transition-opacity ${containerSizes[size]}`}
    >
      {/* Your exact logo image */}
      <div className={`${iconSizes[size]} relative flex-shrink-0`}>
        <Image
          src="/images/logo.png"
          alt="AI Portret Pro Logo"
          width={40}
          height={40}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Logo Text - Now in black */}
      <div className="flex flex-col">
        <span className={`${textSizes[size]}  text-black leading-tight`}>AiPortretPro</span>
        {size === "lg" && (
          <span className="text-xs text-gray-500 font-medium tracking-wide">PROFESSIONELE HEADSHOTS</span>
        )}
      </div>
    </Link>
  )
}

// Alternatieve versie - nog meer zoals LinkedIn
export function ExactLinkedInLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const containerSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
  }

  const proBoxSizes = {
    sm: "px-1.5 py-0.5 text-xs",
    md: "px-2 py-1 text-sm",
    lg: "px-2.5 py-1 text-base",
  }

  return (
    <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
      <div className={`${containerSizes[size]} font-bold flex items-center`}>
        {/* AIPortrait in black like LinkedIn */}
        <span className="text-black">A Portret</span>

        {/* PRO in blue box with proper padding like LinkedIn */}
        <div className={`${proBoxSizes[size]} bg-[#0077B5] text-white rounded-sm font-bold ml-1`}>PRO</div>
      </div>
    </Link>
  )
}
