import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Credit {
  id: number
  userId: string
  amount: number
  createdAt: Date
  updatedAt: Date
}

export class CreditManager {
  static async getUserCredits(userId: string): Promise<number> {
    try {
      const result = await sql`
        SELECT credits FROM credits WHERE user_id = ${userId}
      `
      return result.length > 0 ? result[0].credits : 0
    } catch (error) {
      console.error("Error getting user credits:", error)
      return 0
    }
  }

  static async addCredits(userId: string, amount: number): Promise<boolean> {
    try {
      await sql`
        INSERT INTO credits (user_id, credits)
        VALUES (${userId}, ${amount})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          credits = credits + ${amount},
          updated_at = CURRENT_TIMESTAMP
      `
      return true
    } catch (error) {
      console.error("Error adding credits:", error)
      return false
    }
  }

  static async useCredit(userId: string): Promise<boolean> {
    try {
      const result = await sql`
        UPDATE credits 
        SET credits = credits - 1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = ${userId} AND credits > 0
        RETURNING credits
      `
      return result.length > 0
    } catch (error) {
      console.error("Error using credit:", error)
      return false
    }
  }

  static async setCredits(userId: string, amount: number): Promise<boolean> {
    try {
      await sql`
        INSERT INTO credits (user_id, credits)
        VALUES (${userId}, ${amount})
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          credits = ${amount},
          updated_at = CURRENT_TIMESTAMP
      `
      return true
    } catch (error) {
      console.error("Error setting credits:", error)
      return false
    }
  }
}

export async function getUserCredits(userId: string): Promise<number> {
  return CreditManager.getUserCredits(userId)
}

export async function addCredits(userId: string, amount: number): Promise<boolean> {
  return CreditManager.addCredits(userId, amount)
}

export async function useCredit(userId: string): Promise<boolean> {
  return CreditManager.useCredit(userId)
}

export async function setCredits(userId: string, amount: number): Promise<boolean> {
  return CreditManager.setCredits(userId, amount)
}
