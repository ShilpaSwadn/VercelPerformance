import './globals.css'

export const metadata = {
  title: 'Performance Test App',
  description: 'Application for performance testing login functionality',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}