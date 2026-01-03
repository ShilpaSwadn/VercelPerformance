import { NextResponse } from 'next/server'
import { ensureDbInitialized } from '@lib/server/middleware/dbInit.js'
import { query } from '@lib/server/config/database.js'

/**
 * API Route to export test users as CSV for JMeter
 * GET /api/admin/export-users
 */
export async function GET() {
    try {
        // Initialize database
        await ensureDbInitialized()

        // Fetch all test users
        const result = await query(
            "SELECT first_name FROM users WHERE email LIKE 'user%@test.com' ORDER BY first_name ASC"
        )

        // Generate CSV content
        const csvHeader = 'userId,password\n'
        const csvRows = result.rows.map(row => {
            const userId = row.first_name
            const num = userId.replace('user', '')
            const password = `pwd${num.padStart(4, '0')}`
            return `${userId},${password}`
        }).join('\n')

        const csvContent = csvHeader + csvRows

        // Return CSV as a downloadable file
        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=jmeter_test_users.csv'
            }
        })
    } catch (error) {
        console.error('Error exporting CSV:', error)
        return NextResponse.json({
            success: false,
            message: 'Error exporting CSV'
        }, { status: 500 })
    }
}