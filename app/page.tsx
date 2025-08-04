import Link from "next/link"
import Button from "./Button" // Assuming Button component is imported from a local file

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <h1>Welcome to AI Portretten</h1>
        <p>Experience the future of portrait creation with AI.</p>
        <Link href="/wizard/welcome">
          <Button size="lg" className="bg-[#0077B5] hover:bg-[#004182] text-white px-8 py-4 text-lg font-semibold">
            Start Nu - Maak Je AI Portretten
          </Button>
        </Link>
      </div>

      {/* Rest of the code here */}
    </div>
  )
}

export default HomePage
