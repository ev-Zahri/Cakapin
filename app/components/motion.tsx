"use client";

import { motion, type HTMLMotionProps } from "motion/react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
};

/** Pembungkus yang memunculkan anak-anaknya (<Item>) satu per satu. */
export function Stagger(props: HTMLMotionProps<"div">) {
  return <motion.div variants={container} initial="hidden" animate="show" {...props} />;
}

export function Item(props: HTMLMotionProps<"div">) {
  return <motion.div variants={item} {...props} />;
}

/** Efek tekan/hover untuk elemen interaktif. */
export function Bounce(props: HTMLMotionProps<"div">) {
  return <motion.div whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.94 }} transition={{ type: "spring", stiffness: 400, damping: 17 }} {...props} />;
}

/** Gambar/ikon yang melayang pelan (maskot). */
export function Float(props: HTMLMotionProps<"div">) {
  return <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} {...props} />;
}

export function FadeIn(props: HTMLMotionProps<"div">) {
  return <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} {...props} />;
}
