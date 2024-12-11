"use client"
import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { Button } from './ui/button'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle("dark", savedTheme === "dark")
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
      document.documentElement.classList.toggle("dark", prefersDark)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark")
    localStorage.setItem("theme", newTheme)
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} >
      {theme === 'light' ? <Moon className="h-5 w-5 " /> : <Sun className="h-5 w-5" />}
    </Button>
  )
}

export default ThemeToggle