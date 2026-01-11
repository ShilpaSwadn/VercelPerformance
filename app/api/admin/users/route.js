import { NextResponse } from 'next/server'
import { ensureDbInitialized } from '@lib/server/middleware/dbInit.js'
import { query } from '@lib/server/config/database.js'

export const dynamic = 'force-dynamic'  // ✅ tells Next.js this route is dynamic

export async function GET(request) {
  try {
    await ensureDbInitialized()

    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit')) || 50

    const countResult = await query(
      "SELECT COUNT(*) FROM users WHERE email LIKE 'user%@test.com'"
    )
    const totalCount = parseInt(countResult.rows[0].count)

    const result = await query(
      `SELECT email, first_name
       FROM users
       WHERE email LIKE 'user%@test.com'
       ORDER BY CAST(SUBSTRING(first_name FROM 5) AS INTEGER) DESC
       LIMIT $1`,
      [limit]
    )

    const users = result.rows.map(row => {
      const userId = row.first_name
      const email = row.email
      const num = userId.replace('user', '')
      const password = `pwd${num.padStart(4, '0')}`
      return { userId, password, email }
    })

    return NextResponse.json({ success: true, total: totalCount, data: users })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching users',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}
