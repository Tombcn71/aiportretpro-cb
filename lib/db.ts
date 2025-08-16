import { neon } from "@neondatabase/serverless"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set")
}

const sql = neon(process.env.DATABASE_URL)

export { sql }

export async function getUserByEmail(email: string) {
  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`
    return result[0] || null
  } catch (error) {
    console.error("Error getting user by email:", error)
    throw error
  }
}

export async function createUser(data: {
  email: string
  name?: string
  image?: string
  password_hash?: string
}) {
  try {
    const result = await sql`
      INSERT INTO users (email, name, image, password_hash)
      VALUES (${data.email}, ${data.name || ""}, ${data.image || ""}, ${data.password_hash || null})
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        image = EXCLUDED.image,
        password_hash = COALESCE(EXCLUDED.password_hash, users.password_hash),
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function createPurchase(data: {
  userId: number
  stripeSessionId: string
  planType: string
  amount: number
  headshotsIncluded: number
}) {
  try {
    const result = await sql`
      INSERT INTO purchases (user_id, stripe_session_id, plan_type, amount, headshots_included)
      VALUES (${data.userId}, ${data.stripeSessionId}, ${data.planType}, ${data.amount}, ${data.headshotsIncluded})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating purchase:", error)
    throw error
  }
}

export async function updatePurchaseStatus(sessionId: string, status: string) {
  try {
    const result = await sql`
      UPDATE purchases 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE stripe_session_id = ${sessionId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating purchase status:", error)
    throw error
  }
}

export async function createProject(data: {
  userId: number
  purchaseId: number
  name: string
  gender: string
  characteristics?: Record<string, string>
  outfits: string[]
  backgrounds: string[]
  uploadedPhotos: string[]
}) {
  try {
    const result = await sql`
      INSERT INTO projects (user_id, purchase_id, name, gender, characteristics, outfits, backgrounds, uploaded_photos)
      VALUES (${data.userId}, ${data.purchaseId}, ${data.name}, ${data.gender}, ${data.characteristics || {}}, ${data.outfits}, ${data.backgrounds}, ${data.uploadedPhotos})
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error creating project:", error)
    throw error
  }
}

export async function getProjectsByUserId(userId: number) {
  try {
    return await sql`SELECT * FROM projects WHERE user_id = ${userId} ORDER BY created_at DESC`
  } catch (error) {
    console.error("Error getting projects by user ID:", error)
    throw error
  }
}

export async function updateProjectWithGeneratedPhotos(projectId: number, generatedPhotos: string[], status: string) {
  try {
    const result = await sql`
      UPDATE projects 
      SET generated_photos = ${generatedPhotos}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating project with generated photos:", error)
    throw error
  }
}

export async function getProjectById(projectId: number) {
  try {
    const result = await sql`SELECT * FROM projects WHERE id = ${projectId}`
    return result[0] || null
  } catch (error) {
    console.error("Error getting project by ID:", error)
    throw error
  }
}

export async function updateProjectStatus(projectId: number, status: string) {
  try {
    const result = await sql`
      UPDATE projects 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${projectId}
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Error updating project status:", error)
    throw error
  }
}
