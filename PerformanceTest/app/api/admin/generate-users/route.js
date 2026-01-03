import { NextResponse } from 'next/server'
import { ensureDbInitialized } from '@lib/server/middleware/dbInit.js'
import { query } from '@lib/server/config/database.js'
import bcrypt from 'bcryptjs'

/**
 * API Route to generate performance test users
 * POST /api/admin/generate-users
 * Body: { count: number } (optional, defaults to 100)
 */
export async function POST(request) {
  const startTime = Date.now()

  try {
    // Initialize database
    await ensureDbInitialized()

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const count = parseInt(body.count) || 100

    if (count < 1 || count > 10000) {
      return NextResponse.json({
        success: false,
        message: 'Count must be between 1 and 10000'
      }, { status: 400 })
    }

    console.log(`Generating ${count} performance test users...`)

    // Find the current highest user ID number to continue sequence
    const maxUserResult = await query(`
      SELECT COALESCE(MAX(CAST(SUBSTRING(first_name FROM 5) AS INTEGER)), 0) as max_id
      FROM users
      WHERE first_name LIKE 'user%'
    `)
    const startIdx = parseInt(maxUserResult.rows[0].max_id)

    // Generate user data in parallel
    const userPromises = []
    for (let i = 1; i <= count; i++) {
      const currentIdx = startIdx + i
      const userId = `user${String(currentIdx).padStart(4, '0')}`
      const password = `pwd${String(currentIdx).padStart(4, '0')}`
      const email = `${userId}@test.com`

      // Hash password asynchronously (lower cost for performance testing)
      userPromises.push(
        bcrypt.hash(password, 8).then(hashedPassword => ({
          userId,
          password,
          email,
          hashedPassword,
          mobileNumber: `000000${String(currentIdx).padStart(4, '0')}`
        }))
      )
    }

    // Wait for all passwords to be hashed
    const userData = await Promise.all(userPromises)

    // Bulk insert using a single query with multiple VALUES
    const values = []
    const placeholders = []

    userData.forEach((user, index) => {
      const baseIndex = index * 5
      placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`)
      values.push(user.userId, 'Test', user.email, user.mobileNumber, user.hashedPassword)
    })

    const bulkInsertQuery = `
      INSERT INTO users (first_name, last_name, email, mobile_number, password)
      VALUES ${placeholders.join(', ')}
    `

    await query(bulkInsertQuery, values)

    const endTime = Date.now()
    const duration = (endTime - startTime) / 1000
    console.log(`✅ Generated ${userData.length} users in ${duration.toFixed(2)} seconds (${(userData.length / duration).toFixed(0)} users/sec)`)

    return NextResponse.json({
      success: true,
      message: `Successfully generated ${userData.length} performance test users in ${duration.toFixed(2)}s`,
      data: {
        count: userData.length,
        users: userData.slice(0, 20).map(user => ({
          userId: user.userId,
          password: user.password,
          email: user.email
        })) // Return first 20 as sample
      }
    })
  } catch (error) {
    console.error('Error generating performance users:', error)

    // Provide more helpful error messages
    let errorMessage = 'Error generating users'
    if (error.message.includes('password must be a string')) {
      errorMessage = 'Database password configuration error. Please check your .env file and ensure DB_PASSWORD is set correctly.'
    } else if (error.message.includes('Connection') || error.message.includes('ECONNREFUSED')) {
      errorMessage = 'Cannot connect to database. Please ensure your database is running and connection settings are correct.'
    } else if (error.message.includes('authentication failed')) {
      errorMessage = 'Database authentication failed. Please check your database credentials.'
    }

    return NextResponse.json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 })
  }
}