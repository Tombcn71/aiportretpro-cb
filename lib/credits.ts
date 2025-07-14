import { sql } from "@/lib/db"

export class CreditManager {
  static async getUserCredits(userId: number): Promise<number> {
    try {
      const result = await sql`
        SELECT credits FROM credits WHERE user_id = ${userId}
      `
      return result[0]?.credits || 0
    } catch (error) {
      console.error("Error getting user credits:", error)
      return 0
    }
  }

  static async useCredit(userId: number, projectId: number): Promise<boolean> {
    try {
      // Check current credits first
      const currentCredits = await this.getUserCredits(userId)
      console.log(`User ${userId} has ${currentCredits} credits`)

      if (currentCredits < 1) {
        throw new Error("Insufficient credits")
      }

      // Deduct credit
      const updateResult = await sql`
        UPDATE credits 
        SET credits = credits - 1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND credits > 0
        RETURNING credits
      `

      if (updateResult.length === 0) {
        throw new Error("Failed to deduct credit - insufficient balance")
      }

      console.log(`Credit used. User ${userId} now has ${updateResult[0].credits} credits`)

      // Track usage in project
      await sql`
        UPDATE projects 
        SET credits_used = 1
        WHERE id = ${projectId}
      `

      return true
    } catch (error) {
      console.error("Error using credit:", error)
      throw error
    }
  }

  static async addCredits(userId: number, creditsToAdd: number): Promise<void> {
    try {
      console.log(`Adding ${creditsToAdd} credits to user ${userId}`)

      // Check if user already has credits
      const existingCredit = await sql`
        SELECT credits FROM credits WHERE user_id = ${userId}
      `

      if (existingCredit[0]) {
        // Update existing
        const result = await sql`
          UPDATE credits 
          SET credits = credits + ${creditsToAdd}, updated_at = CURRENT_TIMESTAMP
          WHERE user_id = ${userId}
          RETURNING credits
        `
        console.log(`User ${userId} now has ${result[0]?.credits} total credits`)
      } else {
        // Create new
        const result = await sql`
          INSERT INTO credits (user_id, credits, created_at, updated_at)
          VALUES (${userId}, ${creditsToAdd}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          RETURNING credits
        `
        console.log(`User ${userId} now has ${result[0]?.credits} total credits`)
      }
    } catch (error) {
      console.error("Error adding credits:", error)
      throw error
    }
  }
}
