/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DepositModal({ isOpen }: DepositModalProps) {
  const [amount, setAmount] = useState("");

    function setIsDepositOpen(_arg0: boolean): void {
        throw new Error("Function not implemented.");
    }

    function setIsTradeOpen(arg0: boolean): void {
        throw new Error("Function not implemented.");
    }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 w-80"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Deposit Funds</h2>
            <input
              type="number"
              placeholder="Enter amount ($)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex justify-end gap-3">
                <button onClick={() => setIsDepositOpen(true)} className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50">
                    Deposit
                </button>
            <button onClick={() => setIsTradeOpen(true)} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                Trade
            </button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
