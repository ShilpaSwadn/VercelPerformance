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

        // Create a streaming response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // Send CSV Header
                    const csvHeader = 'userId,password\n'
                    controller.enqueue(new TextEncoder().encode(csvHeader))

                    let offset = 0
                    const limit = 1000
                    let hasMore = true

                    while (hasMore) {
                        // Fetch records in chunks to avoid timeouts and high memory usage
                        const result = await query(
                            "SELECT first_name FROM users WHERE email LIKE 'user%@test.com' ORDER BY CAST(SUBSTRING(first_name FROM 5) AS INTEGER) ASC LIMIT $1 OFFSET $2",
                            [limit, offset]
                        )

                        if (result.rows.length === 0) {
                            hasMore = false
                            break
                        }

                        // Generate CSV chunk
                        const chunk = result.rows.map(row => {
                            const userId = row.first_name
                            // Extract number from userId user0001 -> 0001
                            const numStr = userId.replace('user', '')
                            // Reconstruct password (pwd0001)
                            const password = `pwd${numStr.padStart(4, '0')}` // Ensure padding if number extraction stripped it, though padStart(4) on '0001' is '0001'
                            return `${userId},${password}`
                        }).join('\n') + '\n'

                        // Send chunk
                        controller.enqueue(new TextEncoder().encode(chunk))

                        // Prepare for next chunk
                        offset += limit

                        // If we got fewer rows than limit, we are done
                        if (result.rows.length < limit) {
                            hasMore = false
                        }
                    }
                    controller.close()
                } catch (error) {
                    console.error('Stream processing error:', error)
                    controller.error(error)
                }
            }
        })

        // Return the stream
        return new NextResponse(stream, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename=jmeter_test_users.csv',
                'Cache-Control': 'no-cache'
            }
        })

    } catch (error) {
        console.error('Error initiating export:', error)
        return NextResponse.json({
            success: false,
            message: 'Error initiating export'
        }, { status: 500 })
    }
}