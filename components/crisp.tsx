"use client"

import { useEffect } from "react"
import { Crisp } from "crisp-sdk-web"

const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("9bdd6a78-a829-4220-bfe4-5ad9336aca6b")
  }, [])

  return null
}

export default CrispChat
