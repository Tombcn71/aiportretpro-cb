"use client"

import { Component } from "react"
import { Crisp } from "crisp-sdk-web"

class CrispChat extends Component {
  componentDidMount() {
    Crisp.configure("9bdd6a78-a829-4220-bfe4-5ad9336aca6b")
  }

  render() {
    return null
  }
}

export default CrispChat
