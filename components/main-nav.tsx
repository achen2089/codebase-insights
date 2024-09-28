"use client"

import { BarChart } from "lucide-react"
import CustomLink from "./custom-link"
import React from "react"
import { Button } from "./ui/button"

export function MainNav() {
  return (
    <div className="flex items-center gap-4">
      <CustomLink href="/">
        <Button variant="ghost" className="p-0">
          <BarChart className="w-6 h-6 text-blue-500" />
          <span className="ml-2">Codebase Insights</span>
        </Button>
      </CustomLink>
    </div>
  )
}