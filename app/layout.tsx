@@ .. @@
import { Inter } from 'next/font/google'
import './globals.css'
+import { MSWProvider } from '@/components/MSWProvider'

const inter = Inter({ subsets: ['latin'] })

@@ .. @@
export default function RootLayout({
   children,
 }: {
   children: React.ReactNode
 }) {
   return (
     <html lang="en">
       <body className={inter.className}>
-        {children}
+        <MSWProvider>
+          {children}
+        </MSWProvider>
       </body>
     </html>
   )
 }