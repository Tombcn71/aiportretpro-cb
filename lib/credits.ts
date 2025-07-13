import { sql } from "@vercel/postgres"

export interface Credit {
  id: number
  userId: number
  amount: number
  createdAt: Date
  updatedAt: Date
}

export class CreditManager {
  static async getUserCredits(userId: number): Promise<number> {
    try {
      const result = await sql`
        SELECT amount FROM credits WHERE user_id = ${userId}
      `
      return result.rows[0]?.amount || 0
    } catch (error) {
      console.error("Error getting user credits:", error)
      return 0
    }
  }

  static async addCredits(userId: number, amount: number): Promise<boolean> {
    try {
      await sql`
        INSERT INTO credits (user_id, amount, created_at, updated_at)
        VALUES (${userId}, ${amount}, NOW(), NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          amount = credits.amount + ${amount},
          updated_at = NOW()
      `
      return true
    } catch (error) {
      console.error("Error adding credits:", error)
      return false
    }
  }

  static async useCredit(userId: number): Promise<boolean> {
    try {
      const result = await sql`
        UPDATE credits 
        SET amount = amount - 1, updated_at = NOW()
        WHERE user_id = ${userId} AND amount > 0
        RETURNING amount
      `
      return result.rowCount > 0
    } catch (error) {
      console.error("Error using credit:", error)
      return false
    }
  }

  static async setCredits(userId: number, amount: number): Promise<boolean> {
    try {
      await sql`
        INSERT INTO credits (user_id, amount, created_at, updated_at)
        VALUES (${userId}, ${amount}, NOW(), NOW())
        ON CONFLICT (user_id) 
        DO UPDATE SET 
          amount = ${amount},
          updated_at = NOW()
      `
      return true
    } catch (error) {
      console.error("Error setting credits:", error)
      return false
    }
  }
}

export async function getUserCredits(userId: number): Promise<number> {
  return CreditManager.getUserCredits(userId)
}

export async function addCredits(userId: number, amount: number): Promise<boolean> {
  return CreditManager.addCredits(userId, amount)
}

export async function useCredit(userId: number): Promise<boolean> {
  return CreditManager.useCredit(userId)
}

export async function setCredits(userId: number, amount: number): Promise<boolean> {
  return CreditManager.setCredits(userId, amount)
}
