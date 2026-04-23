"use client"

import { useState } from "react"
import CheckoutForm from "./CheckoutForm"
import OrderSummary from "./OrderSummary"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const [form, setForm] = useState({
    fullName: "",
    email:    "",
    phone:    "",
    line1:    "",
    city:     "",
    state:    "",
  })

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter mb-16"
        >
          Checkout
        </motion.h1>

        <div className="grid lg:grid-cols-[1fr_400px] gap-16 items-start">
          <CheckoutForm form={form} setForm={setForm} />
          <OrderSummary form={form} />
        </div>
      </div>
    </div>
  )
}
